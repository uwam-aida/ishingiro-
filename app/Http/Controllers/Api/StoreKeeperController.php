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
    public function index()
    {
        return Stock::with('product')->get();
    }

    // ADD / INCREMENT STOCK
    // - Baked type  → also creates Production record
    // - Any type    → logs StockMovement (type = in)
    // - Alerts on low stock (< 10)
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

            // If baked, also record in production
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
        return Order::with('items.product')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->each(function ($order) {
                $order->time = $order->created_at->format('h:i A');
                $order->date = $order->created_at->toDateString();
            });
    }

    // UPDATE REQUEST STATUS + OPTIONAL ITEM QUANTITY ADJUSTMENTS
    // - Notifies shop manager on every status change
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
    // - Marks orders as delivered
    // - Creates Delivery records per item
    // - Reduces factory stock per item (logs StockMovement out)
    // - Increases shop stock per item (logs StockMovement in)
    // - Records Revenue per order (unless payment_received = false)
    // - Notifies shop managers
    // - Saves delivery note to database
    // - Returns PDF
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

        $orders     = collect();
        $cakeOrders = collect();
        $deliveryNote = null;

        DB::transaction(function () use ($request, &$orders, &$cakeOrders, &$deliveryNote) {
            // ── Regular orders ────────────────────────────────────────────
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
                        $itemTotal   = $item->quantity * $item->price;
                        $orderTotal += $itemTotal;

                        // Record delivery
                        Delivery::create([
                            'product_id'    => $item->product_id,
                            'quantity'      => $item->quantity,
                            'from_location' => 'factory',
                            'to_location'   => $order->location,
                        ]);

                        // Reduce factory stock
                        $factoryStock = Stock::where('product_id', $item->product_id)
                            ->where('location', 'factory')
                            ->first();

                        if ($factoryStock) {
                            $newQty = max(0, $factoryStock->quantity - $item->quantity);
                            $factoryStock->update(['quantity' => $newQty]);

                            StockMovement::create([
                                'product_id' => $item->product_id,
                                'type'       => 'out',
                                'quantity'   => $item->quantity,
                                'location'   => 'factory',
                                'user_id'    => auth()->id(),
                            ]);
                        }

                        // Increase shop stock
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
                        ]);
                    }

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

            // ── Cake orders ───────────────────────────────────────────────
            if (!empty($request->cake_order_ids)) {
                $cakeOrders = CakeOrder::whereIn('id', $request->cake_order_ids)->get();

                foreach ($cakeOrders as $cake) {
                    if ($cake->status === 'delivered') {
                        continue;
                    }

                    $cake->update(['status' => 'delivered']);

                    // Only record outstanding revenue (price minus what's already been paid)
                    $outstanding = $cake->price - ($cake->total_paid ?? 0);
                    if ($request->input('payment_received', true) && $outstanding > 0) {
                        Revenue::create([
                            'amount'   => $outstanding,
                            'source'   => 'cake_order_' . $cake->id,
                            'location' => $cake->location,
                        ]);

                        // Mark fully paid
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

            // ── Save delivery note to database ────────────────────────────
            $allItems = collect();

            foreach ($orders as $order) {
                foreach ($order->items as $item) {
                    $allItems->push([
                        'product_name' => optional($item->product)->name ?? 'Unknown Product',
                        'quantity'     => $item->quantity,
                        'unit_price'   => $item->price,
                        'total'        => $item->quantity * $item->price,
                    ]);
                }
            }

            foreach ($cakeOrders as $cake) {
                $allItems->push([
                    'product_name' => $cake->cake_type,
                    'quantity'     => $cake->quantity,
                    'unit_price'   => $cake->price,
                    'total'        => $cake->quantity * $cake->price,
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

    // RECORD A DELIVERY MANUALLY (without full deliver flow)
    // - Creates Delivery record
    // - Reduces from_location stock + logs movement
    // - Increases to_location stock + logs movement
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
            });
    }

    // RECORD DAMAGE
    // - Creates Damage record
    // - Decrements stock at location + logs StockMovement (out)
    // - Alerts if qty > 20
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
            $damage = Damage::create($request->only([
                'product_id', 'quantity', 'location', 'reason', 'description', 'unit',
            ]));

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

        return $damage->load('product');
    }

    // GET DAMAGE LOG
    public function damages()
    {
        return Damage::with('product')
            ->latest()
            ->get()
            ->each(function ($d) {
                $d->time = $d->created_at->format('h:i A');
                $d->date = $d->created_at->toDateString();
            });
    }

    // GET PRODUCTION LOG
    public function productionLog()
    {
        return Production::with('product')
            ->latest()
            ->get()
            ->each(function ($p) {
                $p->time = $p->created_at->format('h:i A');
                $p->date = $p->created_at->toDateString();
            });
    }

    // ALL CAKE ORDERS
    public function cakeOrders()
    {
        return CakeOrder::latest()
            ->get()
            ->each(function ($c) {
                $c->time = $c->created_at->format('h:i A');
                $c->date = $c->created_at->toDateString();
            });
    }

    // PENDING CAKE REQUESTS ONLY
    public function cakeRequests()
    {
        return CakeOrder::where('status', 'pending')
            ->latest()
            ->get()
            ->each(function ($c) {
                $c->time = $c->created_at->format('h:i A');
                $c->date = $c->created_at->toDateString();
            });
    }

    // FULL STOCK MOVEMENT HISTORY
    // Supports: ?type=in|out  ?location=  ?limit=
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
            'product_name' => optional($m->product)->name,
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
     * GET /api/storekeeper/stock/{id}
     */
    public function getStockItem($id)
    {
        $stock = Stock::with('product')->findOrFail($id);
        
        return response()->json([
            'id' => $stock->id,
            'product_id' => $stock->product_id,
            'product_name' => optional($stock->product)->name,
            'product_price' => optional($stock->product)->price,
            'product_cost' => optional($stock->product)->cost,
            'product_type' => optional($stock->product)->type,
            'location' => $stock->location,
            'quantity' => $stock->quantity,
            'description' => $stock->description,
            'unit' => $stock->unit,
            'created_at' => $stock->created_at,
            'updated_at' => $stock->updated_at,
        ]);
    }

    /**
     * Delete a stock item
     * DELETE /api/storekeeper/stock/{id}
     */
    public function deleteStockItem($id)
    {
        $stock = Stock::findOrFail($id);
        
        // Log the deletion in stock movements
        StockMovement::create([
            'product_id' => $stock->product_id,
            'type' => 'out',
            'quantity' => $stock->quantity,
            'location' => $stock->location,
            'user_id' => auth()->id(),
            'note' => 'Stock item deleted from inventory'
        ]);
        
        $stock->delete();
        
        return response()->json(['message' => 'Stock item deleted successfully'], 200);
    }

    /**
     * Get detailed stock movement history for store keeper
     * GET /api/storekeeper/stock/movements
     * 
     * Query Parameters:
     * - type: 'in' or 'out'
     * - location: kabuga, masaka, factory
     * - product_id: filter by product
     * - limit: number of records (default 100)
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
            'data' => $movements->map(function ($movement) {
                return [
                    'id' => $movement->id,
                    'product_id' => $movement->product_id,
                    'product_name' => optional($movement->product)->name,
                    'type' => $movement->type === 'in' ? 'Added' : 'Removed',
                    'type_code' => $movement->type,
                    'quantity' => $movement->quantity,
                    'location' => $movement->location,
                    'performed_by' => optional($movement->user)->name ?? 'System',
                    'date' => $movement->created_at->toDateString(),
                    'time' => $movement->created_at->format('h:i A'),
                    'full_timestamp' => $movement->created_at->toISOString(),
                ];
            }),
        ]);
    }

    // ============================================
    // DELIVERY NOTES METHODS
    // ============================================

    /**
     * Get all delivery notes history
     * GET /api/storekeeper/delivery-notes
     */
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
            'data' => $notes->map(function ($note) {
                return [
                    'id' => $note->id,
                    'note_number' => $note->note_number,
                    'recipient_name' => $note->recipient_name,
                    'location' => $note->location,
                    'items_count' => count($note->items),
                    'total_amount' => $note->total_amount,
                    'created_by' => optional($note->user)->name,
                    'date' => $note->created_at->toDateString(),
                    'time' => $note->created_at->format('h:i A'),
                    'created_at' => $note->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get single delivery note by ID with full details
     * GET /api/storekeeper/delivery-notes/{id}
     */
    public function getDeliveryNote($id)
    {
        $note = DeliveryNote::with('user')->findOrFail($id);
        
        return response()->json([
            'id' => $note->id,
            'note_number' => $note->note_number,
            'recipient_name' => $note->recipient_name,
            'location' => $note->location,
            'items' => $note->items,
            'total_amount' => $note->total_amount,
            'created_by' => optional($note->user)->name,
            'created_at' => $note->created_at,
            'date' => $note->created_at->toDateString(),
            'time' => $note->created_at->format('h:i A'),
        ]);
    }

    /**
     * Regenerate PDF for an existing delivery note
     * GET /api/storekeeper/delivery-notes/{id}/pdf
     */
    public function regenerateDeliveryNotePdf($id)
    {
        $note = DeliveryNote::with('user')->findOrFail($id);
        
        // Convert stored items back to collection
        $items = collect($note->items);
        
        $pdf = app(DeliveryNoteService::class)->generateFromArray(
            items: $items,
            recipient: $note->recipient_name,
            deliveredAt: $note->created_at,
        );
        
        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="delivery-note-' . $note->note_number . '.pdf"',
        ]);
    }

    /**
     * Get orders by location for store keeper
     * GET /api/storekeeper/orders/{location}
     */
    public function getOrdersByLocation($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }
        
        $orders = Order::with('items.product')
            ->where('location', $location)
            ->latest()
            ->get()
            ->each(function ($order) {
                $order->time = $order->created_at->format('h:i A');
                $order->date = $order->created_at->toDateString();
            });
        
        return response()->json($orders);
    }

    /**
     * Get all orders across all branches for store keeper
     * GET /api/storekeeper/all-orders
     */
    public function getAllOrders(Request $request)
    {
        $query = Order::with('items.product')->latest();
        
        // Optional filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Optional filter by location
        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }
        
        $limit = (int) $request->query('limit', 100);
        $orders = $query->take($limit)->get();
        
        return response()->json([
            'total' => $orders->count(),
            'data' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'location' => $order->location,
                    'created_at' => $order->created_at,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => optional($item->product)->name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'total' => $item->quantity * $item->price,
                        ];
                    }),
                    'total_amount' => $order->items->sum(function ($item) {
                        return $item->quantity * $item->price;
                    }),
                ];
            }),
        ]);
    }

    /**
     * Get stock by location for store keeper
     * GET /api/storekeeper/stock/{location}
     */
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
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => optional($item->product)->name,
                    'product_price' => optional($item->product)->price,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit ?? 'pcs',
                    'location' => $item->location,
                    'last_updated' => $item->updated_at->toDateTimeString(),
                ];
            });
        
        return response()->json($stock);
    }
}