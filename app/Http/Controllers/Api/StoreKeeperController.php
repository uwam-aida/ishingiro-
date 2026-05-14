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
use App\Services\DeliveryNoteService;
use Illuminate\Http\Request;

class StoreKeeperController extends Controller
{
    // VIEW ALL STOCK
    public function index()
    {
        return Stock::with('product')->get();
    }

    // ADD / INCREMENT STOCK
    public function store(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'location'    => 'required|in:kabuga,masaka',
            'description' => 'nullable|string',
            'unit'        => 'nullable|string',
        ]);

        $stock = Stock::firstOrCreate([
            'product_id' => $request->product_id,
            'location'   => $request->location,
        ]);

        $stock->increment('quantity', $request->quantity);

        $stock->update(array_filter([
            'description' => $request->description,
            'unit'        => $request->unit,
        ], fn($v) => !is_null($v)));

        return $stock->fresh();
    }

    // UPDATE STOCK COUNT DIRECTLY
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->only(['quantity', 'description', 'unit']));

        return $stock;
    }

    // INCOMING PRODUCT REQUESTS (pending orders from shop managers)
    // FIX: use ->each() to append fields directly onto the model instead of
    // array_merge(->toArray()) which can silently drop items when relations
    // have null/empty values and reindex the collection.
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

    // RECORD A DELIVERY
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

    // PENDING CAKE REQUESTS only
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

    // ── DELIVER ───────────────────────────────────────────────────────────────
    // Marks one or more orders / cake orders as "delivered",
    // decrements factory stock for each item, creates Delivery records,
    // notifies the shop, and returns a PDF delivery note.
    //
    // POST /api/storekeeper/deliver
    // {
    //   "order_ids":      [1, 2],          // optional
    //   "cake_order_ids": [3],             // optional
    //   "recipient_name": "Kabuga Shop"    // optional, printed on the note
    // }
    public function deliver(Request $request)
    {
        $request->validate([
            'order_ids'         => 'nullable|array',
            'order_ids.*'       => 'integer|exists:orders,id',
            'cake_order_ids'    => 'nullable|array',
            'cake_order_ids.*'  => 'integer|exists:cake_orders,id',
            'recipient_name'    => 'nullable|string',
            'payment_received'  => 'nullable|boolean',  // NEW
        ]);

        if (empty($request->order_ids) && empty($request->cake_order_ids)) {
            return response()->json([
                'error' => 'Provide at least one order_id or cake_order_id'
            ], 422);
        }

        $orders     = collect();
        $cakeOrders = collect();
        $totalRevenue = 0;

        // ── Regular orders ────────────────────────────────────────────────────
        if (!empty($request->order_ids)) {
            $orders = Order::with('items.product')
                ->whereIn('id', $request->order_ids)
                ->get();

            foreach ($orders as $order) {
                // Skip if already delivered
                if ($order->status === 'delivered') {
                    continue;
                }

                $orderTotal = 0;

                foreach ($order->items as $item) {
                    $itemTotal = $item->quantity * $item->price;
                    $orderTotal += $itemTotal;

                    // 1. Record the delivery
                    Delivery::create([
                        'product_id'    => $item->product_id,
                        'quantity'      => $item->quantity,
                        'from_location' => 'factory',
                        'to_location'   => $order->location,
                    ]);

                    // 2. Reduce factory stock
                    $factoryStock = Stock::where('product_id', $item->product_id)
                        ->where('location', 'factory')
                        ->first();

                    if ($factoryStock) {
                        $newQty = max(0, $factoryStock->quantity - $item->quantity);
                        $factoryStock->update(['quantity' => $newQty]);
                    }

                    // 3. INCREASE SHOP STOCK (products arriving at shop)
                    $shopStock = Stock::firstOrCreate([
                        'product_id' => $item->product_id,
                        'location'   => $order->location,
                    ]);
                    $shopStock->increment('quantity', $item->quantity);
                }

                // 4. Create revenue record if payment was received
                if ($request->input('payment_received', true)) {
                    Revenue::create([
                        'amount'   => $orderTotal,
                        'source'   => 'order_' . $order->id,
                        'location' => $order->location,
                    ]);
                    $totalRevenue += $orderTotal;
                }

                // 5. Update order status
                $order->update(['status' => 'delivered']);

                // 6. Send notification
                SendNotificationJob::dispatch(
                    'shop_manager_' . $order->location,
                    'Your order #' . $order->id . ' has been delivered. Total: ' . number_format($orderTotal) . ' RWF'
                );
            }
        }

        // ── Cake orders ───────────────────────────────────────────────────────
        if (!empty($request->cake_order_ids)) {
            $cakeOrders = CakeOrder::whereIn('id', $request->cake_order_ids)->get();

            foreach ($cakeOrders as $cake) {
                // Skip if already delivered
                if ($cake->status === 'delivered') {
                    continue;
                }

                $cakeTotal = $cake->quantity * $cake->price;

                // Create revenue record if payment was received
                if ($request->input('payment_received', true)) {
                    Revenue::create([
                        'amount'   => $cakeTotal,
                        'source'   => 'cake_order_' . $cake->id,
                        'location' => $cake->location,
                    ]);
                    $totalRevenue += $cakeTotal;
                }

                // Update cake order status
                $cake->update(['status' => 'delivered']);

                // Send notification
                SendNotificationJob::dispatch(
                    'shop_manager_' . $cake->location,
                    'Cake order for ' . $cake->customer_name . ' has been delivered. Total: ' . number_format($cakeTotal) . ' RWF'
                );
            }
        }

        // ── Generate and stream the PDF ───────────────────────────────────────
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


    // ── UPDATE REQUEST ────────────────────────────────────────────────────────
    // Allows the store keeper to update an order's status and/or adjust
    // individual item quantities before dispatching.
    //
    // PUT /api/storekeeper/requests/{id}
    // {
    //   "status": "dispatched",          // optional: pending|dispatched|delivered
    //   "items": [                        // optional: adjust quantities
    //     { "id": 1, "quantity": 80 },
    //     { "id": 2, "quantity": 50 }
    //   ]
    // }
    public function updateRequest(Request $request, $id)
    {
        $request->validate([
            'status'           => 'nullable|in:pending,dispatched,delivered',
            'items'            => 'nullable|array',
            'items.*.id'       => 'required_with:items|integer|exists:order_items,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ]);

        $order = Order::with('items.product')->findOrFail($id);

        // Update status if provided
        if ($request->filled('status')) {
            $order->update(['status' => $request->status]);

            // Notify the shop when status changes
            SendNotificationJob::dispatch(
                'shop_manager_' . $order->location,
                'Your order #' . $order->id . ' is now ' . $request->status
            );
        }

        // Update individual item quantities if provided
        if (!empty($request->items)) {
            foreach ($request->items as $itemData) {
                OrderItem::where('id', $itemData['id'])
                    ->where('order_id', $order->id) // security: ensure item belongs to this order
                    ->update(['quantity' => $itemData['quantity']]);
            }
        }

        // Return the fresh order with updated items
        return $order->fresh()->load('items.product');
    }
}