<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\DeliveryNote;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Production;
use App\Models\Revenue;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Services\DeliveryNoteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreKeeperController extends Controller
{
    // VIEW ALL STOCK
    // FIX: was returning every Stock row (factory + both branches), which made
    // a shop's close-day "remaining" look like it bled into the store keeper's
    // physical stock numbers. Store keeper's "My Stock" is factory-only.
    public function index()
    {
        return Stock::with('product')->where('location', 'factory')->get();
    }

    // ADD / INCREMENT STOCK
    public function store(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'location'    => 'required|in:kabuga,masaka,factory',
            'type'        => 'nullable|in:baked,regular',
            'description' => 'nullable|string',
            'unit'        => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);
        $type    = $request->type ?? $product->type ?? 'regular';
        $stock   = null;

        DB::transaction(function () use ($request, $product, $type, &$stock) {
            $stock = Stock::firstOrCreate([
                'product_id' => $request->product_id,
                'location'   => $request->location,
            ]);

            $stock->increment('quantity', $request->quantity);

            $stock->update(array_filter([
                'description' => $request->description,
                'unit'        => $request->unit,
            ], fn($v) => !is_null($v)));

            StockMovement::create([
                'product_id' => $request->product_id,
                'type'       => 'in',
                'quantity'   => $request->quantity,
                'location'   => $request->location,
                'user_id'    => auth()->id(),
            ]);

            if ($type === 'baked') {
                Production::create([
                    'product_id' => $request->product_id,
                    'quantity'   => $request->quantity,
                    'location'   => $request->location,
                ]);
            }
        });

        if ($stock === null) {
            throw new \RuntimeException('Failed to create or retrieve stock record.');
        }

        if ($stock->quantity < 10) {
            SendNotificationJob::dispatch(
                'operations_manager',
                "Low stock: {$product->name} ({$stock->quantity} units at {$request->location})"
            );
        }

        return $stock->fresh()->load('product');
    }

    // UPDATE STOCK COUNT DIRECTLY
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->only(['quantity', 'description', 'unit']));

        return $stock->load('product');
    }

    // INCOMING PRODUCT REQUESTS (pending orders from shop managers)
    public function requests()
    {
        $orders = Order::with('items.product')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return $orders->map(function ($order) {
            return [
                'id'         => $order->id,
                'user_id'    => $order->user_id,
                'location'   => $order->location,
                'status'     => $order->status,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'items'      => $order->items,
                'time'       => $order->created_at->format('h:i A'),
                'date'       => $order->created_at->toDateString(),
            ];
        });
    }

    // UPDATE REQUEST STATUS + OPTIONAL ITEM QUANTITY ADJUSTMENTS
    public function updateRequest(Request $request, $id)
    {
        $request->validate([
            'status'           => 'nullable|in:pending,dispatched,delivered',
            'items'            => 'nullable|array',
            'items.*.id'       => 'required_with:items|integer|exists:order_items,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ]);

        $order = Order::with('items.product')->findOrFail($id);

        if ($request->filled('status')) {
            $order->update(['status' => $request->status]);

            SendNotificationJob::dispatch(
                'shop_manager_' . $order->location,
                'Order #' . $order->id . ' is now ' . $request->status
            );
        }

        if (!empty($request->items)) {
            foreach ($request->items as $itemData) {
                OrderItem::where('id', $itemData['id'])
                    ->where('order_id', $order->id)
                    ->update(['quantity' => $itemData['quantity']]);
            }
        }

        return $order->fresh()->load('items.product');
    }

    // DELIVER ORDERS + GENERATE PDF DELIVERY NOTE
    public function deliver(Request $request)
    {
        $request->validate([
            'order_ids'        => 'nullable|array',
            'order_ids.*'      => 'integer|exists:orders,id',
            'cake_order_ids'   => 'nullable|array',
            'cake_order_ids.*' => 'integer|exists:cake_orders,id',
            'recipient_name'   => 'nullable|string',
            'payment_received' => 'nullable|boolean',
        ]);

        if (empty($request->order_ids) && empty($request->cake_order_ids)) {
            return response()->json([
                'error' => 'Provide at least one order_id or cake_order_id',
            ], 422);
        }

        $orders       = collect();
        $cakeOrders   = collect();
        $deliveryNote = null;

        // ── Run the entire delivery inside a transaction ──────────────────
        // If anything fails (e.g. insufficient stock), everything rolls back
        // and NO delivery note or PDF is produced.
        try {
            DB::transaction(function () use ($request, &$orders, &$cakeOrders, &$deliveryNote) {

                // ── Regular orders ────────────────────────────────────────
                if (!empty($request->order_ids)) {
                    $orders = Order::with('items.product')
                        ->whereIn('id', $request->order_ids)
                        ->get();

                    foreach ($orders as $order) {
                        if ($order->status === 'delivered') {
                            continue;
                        }

                        $orderTotal = 0;

                        foreach ($order->items as $item) {
                            $product   = $item->product;
                            $itemTotal = $item->quantity * $item->price;
                            $orderTotal += $itemTotal;

                            Delivery::create([
                                'product_id'    => $item->product_id,
                                'quantity'      => $item->quantity,
                                'from_location' => 'factory',
                                'to_location'   => $order->location,
                            ]);

                            $factoryStock = Stock::firstOrCreate(
                                ['product_id' => $item->product_id, 'location' => 'factory'],
                                [
                                    'quantity'    => 0,
                                    'unit'        => $product && $product->type === 'unbaked' ? 'kg' : 'pcs',
                                    'description' => 'Auto-created during delivery',
                                ]
                            );

                            if ($factoryStock->quantity < $item->quantity) {
                                throw new \Exception(
                                    "Insufficient stock for product: " . ($product->name ?? 'Unknown') . ". " .
                                    "Available: {$factoryStock->quantity}, Requested: {$item->quantity}"
                                );
                            }

                            $factoryStock->decrement('quantity', $item->quantity);

                            StockMovement::create([
                                'product_id' => $item->product_id,
                                'type'       => 'out',
                                'quantity'   => $item->quantity,
                                'location'   => 'factory',
                                'user_id'    => auth()->id(),
                                'note'       => "Dispatched to {$order->location}",
                            ]);

                            $shopStock = Stock::firstOrCreate([
                                'product_id' => $item->product_id,
                                'location'   => $order->location,
                            ]);
                            $shopStock->increment('quantity', $item->quantity);

                            StockMovement::create([
                                'product_id' => $item->product_id,
                                'type'       => 'in',
                                'quantity'   => $item->quantity,
                                'location'   => $order->location,
                                'user_id'    => auth()->id(),
                                'note'       => "Received from factory",
                            ]);
                        }

                        // ✅ Mark delivered — this is what removes it from requests()
                        $order->update(['status' => 'delivered']);

                        if ($request->input('payment_received', true)) {
                            Revenue::create([
                                'amount'   => $orderTotal,
                                'source'   => 'order_' . $order->id,
                                'location' => $order->location,
                            ]);
                        }

                        SendNotificationJob::dispatch(
                            'shop_manager_' . $order->location,
                            'Order #' . $order->id . ' delivered — ' . number_format($orderTotal) . ' RWF'
                        );
                    }
                }

                // ── Cake orders ───────────────────────────────────────────
                if (!empty($request->cake_order_ids)) {
                    $cakeOrders = CakeOrder::whereIn('id', $request->cake_order_ids)->get();

                    foreach ($cakeOrders as $cake) {
                        if ($cake->status === 'delivered') {
                            continue;
                        }

                        // ✅ Mark delivered — this removes it from pending lists
                        $cake->update(['status' => 'delivered']);

                        $outstanding = $cake->price - ($cake->total_paid ?? 0);
                        if ($request->input('payment_received', true) && $outstanding > 0) {
                            Revenue::create([
                                'amount'   => $outstanding,
                                'source'   => 'cake_order_' . $cake->id,
                                'location' => $cake->location,
                            ]);

                            $cake->update([
                                'total_paid'        => $cake->price,
                                'remaining_payment' => 0,
                            ]);
                        }

                        SendNotificationJob::dispatch(
                            'shop_manager_' . $cake->location,
                            'Cake for ' . $cake->customer_name . ' delivered'
                        );
                    }
                }

                // ── Save delivery note ────────────────────────────────────
                $allItems = collect();

                foreach ($orders as $order) {
                    foreach ($order->items as $item) {
                        $productName = optional($item->product)->name ?? 'Unknown Product';
                        $allItems->push([
                            'name'         => $productName,
                            'product_name' => $productName,
                            'item_name'    => $productName,
                            'qty'          => $item->quantity,
                            'quantity'     => $item->quantity,
                            'unit_price'   => $item->price,
                            'price'        => $item->price,
                            'total'        => $item->quantity * $item->price,
                        ]);
                    }
                }

                foreach ($cakeOrders as $cake) {
                    $cakeName = $cake->cake_type;
                    $allItems->push([
                        'name'         => $cakeName,
                        'product_name' => $cakeName,
                        'item_name'    => $cakeName,
                        'qty'          => $cake->quantity,
                        'quantity'     => $cake->quantity,
                        'unit_price'   => $cake->price,
                        'price'        => $cake->price,
                        'total'        => $cake->quantity * $cake->price,
                        // FIX: Carry the cake's sample image through so it
                        // can be printed on the delivery note PDF — this
                        // was never being captured before.
                        'image'        => $cake->inspo_image_url,
                    ]);
                }

                if ($allItems->count() > 0) {
                    $deliveryNote = DeliveryNote::create([
                        'user_id'        => auth()->id(),
                        'recipient_name' => $request->input('recipient_name', 'Shop'),
                        'location'       => $orders->first()?->location ?? $cakeOrders->first()?->location ?? 'unknown',
                        'items'          => $allItems->toArray(),
                        'total_amount'   => $allItems->sum('total'),
                    ]);
                }
            });
        } catch (\Exception $e) {
            // Transaction rolled back — orders are still 'pending', no stock changed
            return response()->json(['error' => $e->getMessage()], 422);
        }

        // Only reached if transaction succeeded — orders are now 'delivered'
        $pdf = app(DeliveryNoteService::class)->generate(
            orders:      $orders,
            cakeOrders:  $cakeOrders,
            recipient:   $request->input('recipient_name', 'Shop'),
            deliveredAt: now(),
        );

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="delivery-note-' . now()->format('Y-m-d-His') . '.pdf"',
        ]);
    }

    // RECORD A DELIVERY MANUALLY
    public function storeDelivery(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,id',
            'quantity'      => 'required|integer|min:1',
            'from_location' => 'nullable|string',
            'to_location'   => 'nullable|string',
        ]);

        $delivery = null;

        DB::transaction(function () use ($request, &$delivery) {
            $delivery = Delivery::create($request->only([
                'product_id', 'quantity', 'from_location', 'to_location',
            ]));

            if ($request->from_location) {
                $from = Stock::where('product_id', $request->product_id)
                    ->where('location', $request->from_location)
                    ->first();

                if ($from) {
                    $from->decrement('quantity', $request->quantity);

                    StockMovement::create([
                        'product_id' => $request->product_id,
                        'type'       => 'out',
                        'quantity'   => $request->quantity,
                        'location'   => $request->from_location,
                        'user_id'    => auth()->id(),
                    ]);
                }
            }

            if ($request->to_location) {
                $to = Stock::firstOrCreate([
                    'product_id' => $request->product_id,
                    'location'   => $request->to_location,
                ]);
                $to->increment('quantity', $request->quantity);

                StockMovement::create([
                    'product_id' => $request->product_id,
                    'type'       => 'in',
                    'quantity'   => $request->quantity,
                    'location'   => $request->to_location,
                    'user_id'    => auth()->id(),
                ]);
            }
        });

        if (!$delivery) {
            throw new \RuntimeException('Failed to create delivery record.');
        }

        return $delivery->load('product');
    }

    // DELIVERY HISTORY
    public function deliveryHistory()
    {
        return Delivery::with('product')
            ->latest()
            ->get()
            ->each(function ($d) {
                $d->time = $d->created_at->format('h:i A');
                $d->date = $d->created_at->toDateString();
                $d->product_name = optional($d->product)->name ?? 'Unknown Product';
            });
    }

    // RECORD DAMAGE - with user_id
    public function storeDamage(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'location'    => 'required|string',
            'reason'      => 'nullable|string',
            'description' => 'nullable|string',
            'unit'        => 'nullable|string',
        ]);

        $damage = DB::transaction(function () use ($request) {
            // ✅ Add user_id so reported_by works
            $damage = Damage::create([
                'product_id'  => $request->product_id,
                'quantity'    => $request->quantity,
                'location'    => $request->location,
                'reason'      => $request->reason,
                'description' => $request->description,
                'unit'        => $request->unit,
                'user_id'     => auth()->id(),  // ✅ THIS SAVES THE REPORTER
            ]);

            $stock = Stock::where('product_id', $request->product_id)
                ->where('location', $request->location)
                ->first();

            if ($stock && $stock->quantity >= $request->quantity) {
                $stock->decrement('quantity', $request->quantity);

                StockMovement::create([
                    'product_id' => $request->product_id,
                    'type'       => 'out',
                    'quantity'   => $request->quantity,
                    'location'   => $request->location,
                    'user_id'    => auth()->id(),
                ]);
            }

            return $damage;
        });

        if ($damage->quantity > 20) {
            SendNotificationJob::dispatch('operations_manager', 'High damage detected');
            SendNotificationJob::dispatch('marketing_manager', 'Critical damage alert');
        }

        return $damage->load(['product', 'user']);  // ✅ return with user
    }

    // GET DAMAGE LOG - with reported_by and product name
    public function damages()
    {
        return Damage::with(['product', 'user'])  // ✅ eager load user
            ->latest()
            ->get()
            ->map(function ($d) {
                return [
                    'id'          => $d->id,
                    'product_id'  => $d->product_id,
                    'product'     => optional($d->product)->name ?? 'Unknown Product',
                    'product_name'=> optional($d->product)->name ?? 'Unknown Product',
                    'quantity'    => $d->quantity,
                    'reason'      => $d->reason,
                    'location'    => $d->location,
                    'reported_by' => optional($d->user)->name ?? 'Unknown',  // ✅ add reported_by
                    'created_at'  => $d->created_at,
                    'time'        => $d->created_at->format('h:i A'),
                    'date'        => $d->created_at->toDateString(),
                ];
            });
    }

    // GET PRODUCTION LOG - with product names
    public function productionLog()
    {
        return Production::with('product')
            ->whereHas('product', function ($query) {
                $query->where('type', 'baked');
            })
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id'          => $p->id,
                    'product_id'  => $p->product_id,
                    'product'     => optional($p->product)->name ?? 'Unknown Product',
                    'product_name'=> optional($p->product)->name ?? 'Unknown Product',
                    'quantity'    => $p->quantity,
                    'location'    => $p->location,
                    'created_at'  => $p->created_at,
                    'time'        => $p->created_at->format('h:i A'),
                    'date'        => $p->created_at->toDateString(),
                ];
            });
    }

    // ALL CAKE ORDERS (all types across all branches) - with reported_by and image
    public function cakeOrders()
    {
        return CakeOrder::with('user')
            ->where('type', 'order')
            ->where('status', '!=', 'delivered')
            ->latest()
            ->get()
            ->map(function ($c) {
                $data = $c->toArray();
                $data['time']            = $c->created_at->format('h:i A');
                $data['date']            = $c->created_at->toDateString();
                $data['reported_by']     = optional($c->user)->name ?? 'Unknown';
                $data['inspo_image_url'] = $c->inspo_image_url; // always present, null if no image
                // FIX: Derive needs_sample from image presence too, so
                // orders saved before the frontend's needs_sample bug was
                // fixed still display correctly here.
                $data['needs_sample']    = (bool) ($c->needs_sample || $c->inspo_image_url);
                // FIX: location was already included via toArray() (it's a
                // fillable column), but we re-assert it explicitly so the
                // store keeper can always see which branch placed the
                // order, even if the frontend ever narrows the fields it
                // reads from this response.
                $data['location']        = $c->location;
                $data['total_paid']       = (float) $c->total_paid;
                $data['remaining_payment']= (float) $c->remaining_payment;
                $data['advance_payment']  = (float) $c->advance_payment;
                $data['is_fully_paid']    = $c->isFullyPaid();
                $data['payment_status']   = $c->getPaymentStatusAttribute();
                return $data;
            });
    }

    // PENDING CAKE REQUESTS ONLY (type = 'request', status = 'pending') - with reported_by and image
    public function cakeRequests()
    {
        return CakeOrder::with('user')
            ->where('type', 'request')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($c) {
                $data = $c->toArray();
                $data['time']             = $c->created_at->format('h:i A');
                $data['date']             = $c->created_at->toDateString();
                $data['reported_by']      = optional($c->user)->name ?? 'Unknown';
                $data['inspo_image_url']  = $c->inspo_image_url; // always present, null if no image
                $data['total_paid']       = (float) $c->total_paid;
                $data['remaining_payment']= (float) $c->remaining_payment;
                $data['advance_payment']  = (float) $c->advance_payment;
                return $data;
            });
    }

    // RECORD CAKE PAYMENT (for store keeper)
    public function recordCakePayment(Request $request, $id)
    {
        $request->validate([
            'payment_amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name'     => 'nullable|string',
        ]);

        $cakeOrder = CakeOrder::findOrFail($id);

        if ($cakeOrder->remaining_payment <= 0) {
            return response()->json(['error' => 'Order is already fully paid'], 400);
        }

        $newTotal = $cakeOrder->total_paid + $request->payment_amount;

        if ($newTotal > $cakeOrder->price) {
            return response()->json(['error' => 'Payment amount exceeds remaining balance'], 400);
        }

        DB::transaction(function () use ($request, $cakeOrder, $newTotal) {
            $cakeOrder->update([
                'total_paid'        => $newTotal,
                'remaining_payment' => $cakeOrder->price - $newTotal,
                'payment_method'    => $request->payment_method,
                'payer_name'        => $request->payer_name ?? $cakeOrder->payer_name,
            ]);

            Revenue::create([
                'amount'   => $request->payment_amount,
                'source'   => 'cake_order_payment',
                'location' => $cakeOrder->location,
            ]);

            // ✅ If fully paid, update status
            if ($cakeOrder->total_paid >= $cakeOrder->price) {
                $cakeOrder->update(['status' => 'paid']);
            }
        });

        return response()->json([
            'message'           => 'Payment recorded successfully',
            'cake_order'        => $cakeOrder->fresh(),
            'total_paid'        => $cakeOrder->total_paid,
            'remaining_balance' => $cakeOrder->remaining_payment,
            'payment_status'    => $cakeOrder->getPaymentStatusAttribute(),
            'status'            => $cakeOrder->status,
        ]);
    }

    // FULL STOCK MOVEMENT HISTORY
    public function history(Request $request)
    {
        $query = StockMovement::with('product', 'user')->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        $limit = (int) $request->query('limit', 100);

        return $query->take($limit)->get()->map(fn($m) => [
            'id'           => $m->id,
            'product_id'   => $m->product_id,
            'product_name' => optional($m->product)->name ?? 'Unknown Product',
            'type'         => $m->type === 'in' ? 'Added' : 'Removed',
            'quantity'     => $m->quantity,
            'location'     => $m->location,
            'added_by'     => optional($m->user)->name ?? 'System',
            'date'         => $m->created_at->toDateString(),
            'time'         => $m->created_at->format('h:i A'),
            'timestamp'    => $m->created_at->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Get single stock item by ID with full details
     */
    public function getStockItem($id)
    {
        $stock = Stock::with('product')->findOrFail($id);

        return response()->json([
            'id'            => $stock->id,
            'product_id'    => $stock->product_id,
            'product_name'  => optional($stock->product)->name ?? 'Unknown Product',
            'product_price' => optional($stock->product)->price,
            'product_cost'  => optional($stock->product)->cost,
            'product_type'  => optional($stock->product)->type,
            'location'      => $stock->location,
            'quantity'      => $stock->quantity,
            'description'   => $stock->description,
            'unit'          => $stock->unit,
            'created_at'    => $stock->created_at,
            'updated_at'    => $stock->updated_at,
        ]);
    }

    /**
     * Delete a stock item
     */
    public function deleteStockItem($id)
    {
        $stock = Stock::findOrFail($id);

        StockMovement::create([
            'product_id' => $stock->product_id,
            'type'       => 'out',
            'quantity'   => $stock->quantity,
            'location'   => $stock->location,
            'user_id'    => auth()->id(),
            'note'       => 'Stock item deleted from inventory',
        ]);

        $stock->delete();

        return response()->json(['message' => 'Stock item deleted successfully'], 200);
    }

    /**
     * Get detailed stock movement history for store keeper
     */
    public function getStockMovements(Request $request)
    {
        $query = StockMovement::with('product', 'user')->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $limit = (int) $request->query('limit', 100);

        $movements = $query->take($limit)->get();

        return response()->json([
            'total' => $movements->count(),
            'data'  => $movements->map(function ($movement) {
                return [
                    'id'             => $movement->id,
                    'product_id'     => $movement->product_id,
                    'product_name'   => optional($movement->product)->name ?? 'Unknown Product',
                    'type'           => $movement->type === 'in' ? 'Added' : 'Removed',
                    'type_code'      => $movement->type,
                    'quantity'       => $movement->quantity,
                    'location'       => $movement->location,
                    'performed_by'   => optional($movement->user)->name ?? 'System',
                    'date'           => $movement->created_at->toDateString(),
                    'time'           => $movement->created_at->format('h:i A'),
                    'full_timestamp' => $movement->created_at->toISOString(),
                ];
            }),
        ]);
    }

    // ============================================
    // DELIVERY NOTES METHODS
    // ============================================

    public function getDeliveryNotes(Request $request)
    {
        $query = DeliveryNote::with('user')->latest();

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        $limit = (int) $request->query('limit', 100);
        $notes = $query->take($limit)->get();

        return response()->json([
            'total' => $notes->count(),
            'data'  => $notes->map(function ($note) {
                return [
                    'id'             => $note->id,
                    'note_number'    => $note->note_number,
                    'recipient_name' => $note->recipient_name,
                    'location'       => $note->location,
                    'items_count'    => count($note->items),
                    'total_amount'   => $note->total_amount,
                    'created_by'     => optional($note->user)->name,
                    'date'           => $note->created_at->toDateString(),
                    'time'           => $note->created_at->format('h:i A'),
                    'created_at'     => $note->created_at,
                ];
            }),
        ]);
    }

    public function getDeliveryNote($id)
    {
        $note = DeliveryNote::with('user')->findOrFail($id);

        $transformedItems = collect($note->items)->map(function ($item) {
            $productName = $item['name']
                ?? $item['product_name']
                ?? $item['item_name']
                ?? $item['item']
                ?? 'Unknown Product';

            return [
                'name'       => $productName,
                'qty'        => $item['qty'] ?? $item['quantity'] ?? 0,
                'unit_price' => $item['unit_price'] ?? $item['price'] ?? 0,
                'total'      => $item['total'] ?? 0,
                'image'      => $item['image'] ?? null,
            ];
        });

        return response()->json([
            'id'             => $note->id,
            'note_number'    => $note->note_number,
            'recipient_name' => $note->recipient_name,
            'location'       => $note->location,
            'items'          => $transformedItems,
            'total_amount'   => $note->total_amount,
            'created_by'     => optional($note->user)->name,
            'created_at'     => $note->created_at,
            'date'           => $note->created_at->toDateString(),
            'time'           => $note->created_at->format('h:i A'),
        ]);
    }

    public function regenerateDeliveryNotePdf($id)
    {
        $note = DeliveryNote::with('user')->findOrFail($id);

        $items = collect($note->items)->map(function ($item) {
            $productName = $item['name']
                ?? $item['product_name']
                ?? $item['item_name']
                ?? $item['item']
                ?? 'Unknown Product';

            return [
                'name'       => $productName,
                'qty'        => $item['qty'] ?? $item['quantity'] ?? 0,
                'unit_price' => $item['unit_price'] ?? $item['price'] ?? 0,
                'total'      => $item['total'] ?? 0,
                'image'      => $item['image'] ?? null,
            ];
        });

        $pdf = app(DeliveryNoteService::class)->generateFromArray(
            items:       $items,
            recipient:   $note->recipient_name,
            deliveredAt: $note->created_at,
        );

        return response($pdf, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="delivery-note-' . $note->note_number . '.pdf"',
        ]);
    }

    public function getOrdersByLocation($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }

        $orders = Order::with('items.product')
            ->where('location', $location)
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id'         => $order->id,
                    'user_id'    => $order->user_id,
                    'location'   => $order->location,
                    'status'     => $order->status,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'items'      => $order->items,
                    'time'       => $order->created_at->format('h:i A'),
                    'date'       => $order->created_at->toDateString(),
                ];
            });

        return response()->json($orders);
    }

    public function getAllOrders(Request $request)
    {
        $query = Order::with('items.product')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        $limit  = (int) $request->query('limit', 100);
        $orders = $query->take($limit)->get();

        return response()->json([
            'total' => $orders->count(),
            'data'  => $orders->map(function ($order) {
                return [
                    'id'           => $order->id,
                    'status'       => $order->status,
                    'location'     => $order->location,
                    'created_at'   => $order->created_at,
                    'items'        => $order->items->map(function ($item) {
                        return [
                            'id'           => $item->id,
                            'product_name' => optional($item->product)->name ?? 'Unknown Product',
                            'quantity'     => $item->quantity,
                            'price'        => $item->price,
                            'total'        => $item->quantity * $item->price,
                        ];
                    }),
                    'total_amount' => $order->items->sum(function ($item) {
                        return $item->quantity * $item->price;
                    }),
                ];
            }),
        ]);
    }

    public function getStockByLocation($location)
    {
        if (!in_array($location, ['kabuga', 'masaka', 'factory'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }

        $stock = Stock::with('product')
            ->where('location', $location)
            ->get()
            ->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'product_id'    => $item->product_id,
                    'product_name'  => optional($item->product)->name ?? 'Unknown Product',
                    'product_price' => optional($item->product)->price,
                    'quantity'      => $item->quantity,
                    'unit'          => $item->unit ?? 'pcs',
                    'location'      => $item->location,
                    'last_updated'  => $item->updated_at->toDateTimeString(),
                ];
            });

        return response()->json($stock);
    }

    /**
     * Get available stock (physical stock minus pending requests)
     * GET /api/storekeeper/available-stock
     *
     * FIX: defaulted to location=all, which pulled kabuga/masaka stock into
     * the store keeper's Requested/Available math along with factory stock.
     * Store keeper's "available" view should be factory stock by default.
     */
    public function getAvailableStock(Request $request)
    {
        $location = $request->query('location', 'factory');

        $stockQuery = Stock::with('product');
        if ($location !== 'all') {
            $stockQuery->where('location', $location);
        }
        $physicalStock = $stockQuery->get();

        $pendingRequests = Order::with('items')
            ->where('status', 'pending')
            ->get();

        $availableStock = [];

        foreach ($physicalStock as $stock) {
            $productId    = $stock->product_id;
            $requestedQty = 0;

            foreach ($pendingRequests as $pendingRequest) {
                foreach ($pendingRequest->items as $item) {
                    if ($item->product_id === $productId) {
                        $requestedQty += $item->quantity;
                    }
                }
            }

            $availableStock[] = [
                'id'                 => $stock->id,
                'product_id'         => $productId,
                'product_name'       => $stock->product->name,
                'product_price'      => $stock->product->price,
                'physical_quantity'  => $stock->quantity,
                'requested_quantity' => $requestedQty,
                'available_quantity' => max(0, $stock->quantity - $requestedQty),
                'location'           => $stock->location,
                'unit'               => $stock->unit ?? 'pcs',
                'status'             => ($stock->quantity - $requestedQty) < 10 ? 'Low Stock' : 'Available',
            ];
        }

        return response()->json([
            'total_available' => collect($availableStock)->sum('available_quantity'),
            'data'            => $availableStock,
        ]);
    }

    /**
     * Get single cake order by ID for store keeper - with reported_by and image
     * GET /api/storekeeper/cake-orders/{id}
     */
    public function getCakeOrder($id)
    {
        $cakeOrder = CakeOrder::with('user')->findOrFail($id);

        if ($cakeOrder->inspo_image_path) {
            $cakeOrder->inspo_image_url = asset('storage/' . $cakeOrder->inspo_image_path);
        }

        $cakeOrder->time = $cakeOrder->created_at->format('h:i A');
        $cakeOrder->date = $cakeOrder->created_at->toDateString();
        $cakeOrder->reported_by = optional($cakeOrder->user)->name ?? 'Unknown';
        $cakeOrder->is_fully_paid = $cakeOrder->isFullyPaid();
        $cakeOrder->payment_status = $cakeOrder->getPaymentStatusAttribute();

        return response()->json($cakeOrder);
    }
}