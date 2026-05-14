<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Production;
use App\Models\Revenue;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Services\DeliveryNoteService;
use Illuminate\Http\Request;

class StoreKeeperController extends Controller
{
    /**
     * VIEW ALL STOCK
     */
    public function index()
    {
        return Stock::with('product')->get();
    }

    /**
     * ADD / INCREMENT STOCK
     * 
     * Automatically categorizes items:
     * - Baked items → Added to Production
     * - Cake items → Added to CakeOrder requests
     * - Regular items → Stock only
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'location'    => 'required|in:kabuga,masaka',
            'type'        => 'nullable|in:baked,cake,regular',
            'description' => 'nullable|string',
            'unit'        => 'nullable|string',
        ]);

        $product = \App\Models\Product::find($request->product_id);
        $type = $request->type ?? $product->type ?? 'regular';

        // 1. CREATE/UPDATE STOCK
        $stock = Stock::firstOrCreate([
            'product_id' => $request->product_id,
            'location'   => $request->location,
        ]);

        $stock->increment('quantity', $request->quantity);

        $stock->update(array_filter([
            'description' => $request->description,
            'unit'        => $request->unit,
        ], fn($v) => !is_null($v)));

        // 2. LOG STOCK MOVEMENT (HISTORY)
        StockMovement::create([
            'product_id' => $request->product_id,
            'type'       => 'in',
            'quantity'   => $request->quantity,
            'location'   => $request->location,
            'user_id'    => auth()->id()
        ]);

        // 3. HANDLE BAKED ITEMS
        if ($type === 'baked') {
            Production::create([
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity,
                'location'   => $request->location
            ]);
        }

        // 4. HANDLE CAKE ITEMS
        if ($type === 'cake') {
            CakeOrder::create([
                'customer_name' => 'Store Added',
                'phone'         => auth()->user()->id,
                'cake_type'     => $product->name,
                'quantity'      => $request->quantity,
                'price'         => $product->price,
                'location'      => $request->location,
                'delivery_date' => now()->addDays(1),
                'status'        => 'pending'
            ]);
        }

        // 5. LOW STOCK ALERT
        if ($stock->quantity < 10) {
            SendNotificationJob::dispatch(
                'operations_manager',
                "Low stock: {$product->name} ({$stock->quantity} units)"
            );
        }

        return $stock->fresh();
    }

    /**
     * UPDATE STOCK COUNT DIRECTLY
     */
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->only(['quantity', 'description', 'unit']));

        return $stock;
    }

    /**
     * INCOMING PRODUCT REQUESTS (pending orders from shop managers)
     */
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

    /**
     * RECORD A DELIVERY
     */
    public function storeDelivery(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,id',
            'quantity'      => 'required|integer|min:1',
            'from_location' => 'nullable|string',
            'to_location'   => 'nullable|string',
        ]);

        return Delivery::create($request->all());
    }

    /**
     * DELIVERY HISTORY
     */
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

    /**
     * RECORD DAMAGE
     */
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

        $damage = Damage::create($request->all());

        if ($damage->quantity > 20) {
            SendNotificationJob::dispatch('operations_manager', 'High damage detected');
            SendNotificationJob::dispatch('marketing_manager', 'Critical damage alert');
        }

        return $damage;
    }

    /**
     * GET DAMAGE LOG
     */
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

    /**
     * GET PRODUCTION LOG
     */
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

    /**
     * ALL CAKE ORDERS
     */
    public function cakeOrders()
    {
        return CakeOrder::latest()
            ->get()
            ->each(function ($c) {
                $c->time = $c->created_at->format('h:i A');
                $c->date = $c->created_at->toDateString();
            });
    }

    /**
     * PENDING CAKE REQUESTS ONLY
     */
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

    /**
     * FULL HISTORY OF ADDED PRODUCTS
     * 
     * Logs every single item added to stock
     * Shows what, when, by whom, and from where
     */
    public function history(Request $request)
    {
        $query = StockMovement::with('product', 'user')->latest();

        // Filter by type if provided (in/out)
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by location if provided
        if ($request->has('location')) {
            $query->where('location', $request->location);
        }

        $limit = (int) $request->query('limit', 100);

        return $query->take($limit)->get()->map(function ($movement) {
            return [
                'id'           => $movement->id,
                'product_id'   => $movement->product_id,
                'product_name' => optional($movement->product)->name,
                'type'         => $movement->type === 'in' ? 'Added' : 'Removed',
                'quantity'     => $movement->quantity,
                'location'     => $movement->location,
                'added_by'     => optional($movement->user)->name ?? 'System',
                'created_at'   => $movement->created_at,
                'date'         => $movement->created_at->toDateString(),
                'time'         => $movement->created_at->format('H:i A'),
                'timestamp'    => $movement->created_at->format('Y-m-d H:i:s'),
            ];
        });
    }

    /**
     * DELIVER ORDERS AND GENERATE PDF
     * 
     * Marks orders as delivered, reduces factory stock,
     * increases shop stock, and generates delivery note
     */
    public function deliver(Request $request)
    {
        $request->validate([
            'order_ids'         => 'nullable|array',
            'order_ids.*'       => 'integer|exists:orders,id',
            'cake_order_ids'    => 'nullable|array',
            'cake_order_ids.*'  => 'integer|exists:cake_orders,id',
            'recipient_name'    => 'nullable|string',
            'payment_received'  => 'nullable|boolean',
        ]);

        if (empty($request->order_ids) && empty($request->cake_order_ids)) {
            return response()->json([
                'error' => 'Provide at least one order_id or cake_order_id'
            ], 422);
        }

        $orders     = collect();
        $cakeOrders = collect();
        $totalRevenue = 0;

        // ── Regular orders ────────────────────────────────────────────────
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
                    $itemTotal = $item->quantity * $item->price;
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
                    }

                    // Increase shop stock
                    $shopStock = Stock::firstOrCreate([
                        'product_id' => $item->product_id,
                        'location'   => $order->location,
                    ]);
                    $shopStock->increment('quantity', $item->quantity);
                }

                // Create revenue record
                if ($request->input('payment_received', true)) {
                    Revenue::create([
                        'amount'   => $orderTotal,
                        'source'   => 'order_' . $order->id,
                        'location' => $order->location,
                    ]);
                    $totalRevenue += $orderTotal;
                }

                $order->update(['status' => 'delivered']);

                SendNotificationJob::dispatch(
                    'shop_manager_' . $order->location,
                    'Order #' . $order->id . ' delivered. Total: ' . number_format($orderTotal) . ' RWF'
                );
            }
        }

        // ── Cake orders ───────────────────────────────────────────────────
        if (!empty($request->cake_order_ids)) {
            $cakeOrders = CakeOrder::whereIn('id', $request->cake_order_ids)->get();

            foreach ($cakeOrders as $cake) {
                if ($cake->status === 'delivered') {
                    continue;
                }

                $cakeTotal = $cake->quantity * $cake->price;

                if ($request->input('payment_received', true)) {
                    Revenue::create([
                        'amount'   => $cakeTotal,
                        'source'   => 'cake_order_' . $cake->id,
                        'location' => $cake->location,
                    ]);
                    $totalRevenue += $cakeTotal;
                }

                $cake->update(['status' => 'delivered']);

                SendNotificationJob::dispatch(
                    'shop_manager_' . $cake->location,
                    'Cake for ' . $cake->customer_name . ' delivered. Total: ' . number_format($cakeTotal) . ' RWF'
                );
            }
        }

        // Generate PDF
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

    /**
     * UPDATE REQUEST STATUS AND ITEMS
     */
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
}