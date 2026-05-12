<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\Production;
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
    public function requests()
    {
        return Order::with('items.product')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($order) => array_merge($order->toArray(), [
                'time' => $order->created_at->format('h:i A'),
                'date' => $order->created_at->toDateString(),
            ]));
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
            ->map(fn($d) => array_merge($d->toArray(), [
                'time' => $d->created_at->format('h:i A'),
                'date' => $d->created_at->toDateString(),
            ]));
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
            ->map(fn($d) => array_merge($d->toArray(), [
                'time' => $d->created_at->format('h:i A'),
                'date' => $d->created_at->toDateString(),
            ]));
    }

    // GET PRODUCTION LOG
    public function productionLog()
    {
        return Production::with('product')
            ->latest()
            ->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                'time' => $p->created_at->format('h:i A'),
                'date' => $p->created_at->toDateString(),
            ]));
    }

    // ALL CAKE ORDERS
    public function cakeOrders()
    {
        return CakeOrder::latest()
            ->get()
            ->map(fn($c) => array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]));
    }

    


    // PENDING CAKE REQUESTS only
    public function cakeRequests()
    {
        return CakeOrder::where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($c) => array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]));
    }

    // ── DELIVER ───────────────────────────────────────────────────────────────
    // Marks one or more orders / cake orders as "delivered",
    // creates Delivery records, notifies the shop, and returns a PDF.
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
            'order_ids'        => 'nullable|array',
            'order_ids.*'      => 'integer|exists:orders,id',
            'cake_order_ids'   => 'nullable|array',
            'cake_order_ids.*' => 'integer|exists:cake_orders,id',
            'recipient_name'   => 'nullable|string',
        ]);

        if (empty($request->order_ids) && empty($request->cake_order_ids)) {
            return response()->json([
                'error' => 'Provide at least one order_id or cake_order_id'
            ], 422);
        }

        $orders     = collect();
        $cakeOrders = collect();

        // ── Regular orders ───────────────────────────────────────────────────
        if (!empty($request->order_ids)) {
            $orders = Order::with('items.product')
                ->whereIn('id', $request->order_ids)
                ->get();

            foreach ($orders as $order) {
                $order->update(['status' => 'delivered']);

                foreach ($order->items as $item) {
                    Delivery::create([
                        'product_id'    => $item->product_id,
                        'quantity'      => $item->quantity,
                        'from_location' => 'factory',
                        'to_location'   => $order->location,
                    ]);
                }

                SendNotificationJob::dispatch(
                    'shop_manager_' . $order->location,
                    'Your order #' . $order->id . ' has been delivered'
                );
            }
        }

        // ── Cake orders ──────────────────────────────────────────────────────
        if (!empty($request->cake_order_ids)) {
            $cakeOrders = CakeOrder::whereIn('id', $request->cake_order_ids)->get();

            foreach ($cakeOrders as $cake) {
                $cake->update(['status' => 'delivered']);

                SendNotificationJob::dispatch(
                    'shop_manager_' . $cake->location,
                    'Cake order for ' . $cake->customer_name . ' has been delivered'
                );
            }
        }

        // ── Generate and stream the PDF ──────────────────────────────────────
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
}