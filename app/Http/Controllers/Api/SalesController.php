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
use App\Models\SalesTarget;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    // DASHBOARD — all 6 summary cards + history count
    public function dashboard()
    {
        return [
            'shop_requests'      => Order::count(),
            'cake_orders'        => CakeOrder::count(),
            'baked_products'     => Production::sum('quantity'),
            'delivered_products' => Delivery::sum('quantity'),
            'shop_stock'         => Stock::sum('quantity'),
            'damaged_products'   => Damage::sum('quantity'),
            'history'            => StockMovement::count(),
        ];
    }

    // DETAILED LISTS — individual page data

    // Pending shop requests
    public function requests()
    {
        return Order::with('items.product')
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    // Finished goods from factory
    public function baked()
    {
        return Production::with('product')->latest()->get();
    }

    // Delivered products (in transit / delivered to shops)
    public function delivered()
    {
        return Delivery::with('product')->latest()->get();
    }

    // Branch inventory
    public function stock()
    {
        return Stock::with('product')->get();
    }

    // Recorded losses
    public function damaged()
    {
        return Damage::with('product')->latest()->get();
    }

    // Lifetime stock movement log
    public function history()
    {
        return StockMovement::with('product')->latest()->get();
    }

    // ALL CAKE ORDERS
    public function cakeOrders()
    {
        return CakeOrder::latest()->get();
    }

    // CREATE CAKE ORDER
    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'date'          => 'required|date',
        ]);

        $order = CakeOrder::create($request->all());

        SendNotificationJob::dispatch('shop_manager_kabuga', 'New cake order received');
        SendNotificationJob::dispatch('shop_manager_masaka', 'New cake order received');

        return $order;
    }

    // SEND MESSAGE TO STAFF GROUP
    public function sendMessage(Request $request)
    {
        $request->validate([
            'recipient_role' => 'required|string',
            'message'        => 'required|string',
        ]);

        SendNotificationJob::dispatch($request->recipient_role, $request->message);

        return response()->json(['status' => 'sent']);
    }

    // GET TARGETS WITH LIVE PROGRESS
    public function targets()
    {
        return SalesTarget::with('product')->get()->map(function ($target) {
            $actual = OrderItem::where('product_id', $target->product_id)
                ->whereBetween('created_at', [$target->start_date, $target->end_date])
                ->sum('quantity');

            $status = match (true) {
                $actual >= $target->target_volume          => 'Completed',
                $actual >= ($target->target_volume * 0.7) => 'On Track',
                default                                    => 'Behind',
            };

            return [
                'id'            => $target->id,
                'product_name'  => $target->product->name,
                'target_volume' => $target->target_volume,
                'unit'          => $target->unit,
                'actual_volume' => $actual,
                'status'        => $status,
            ];
        });
    }

    // CREATE TARGET
    public function storeTarget(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,id',
            'target_volume' => 'required|integer|min:1',
            'unit'          => 'required|in:pieces,kg',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after:start_date',
        ]);

        return SalesTarget::create($request->all());
    }

    // UPDATE TARGET
    public function updateTarget(Request $request, $id)
    {
        $target = SalesTarget::findOrFail($id);

        $request->validate([
            'target_volume' => 'sometimes|integer|min:1',
            'unit'          => 'sometimes|in:pieces,kg',
            'start_date'    => 'sometimes|date',
            'end_date'      => 'sometimes|date|after:start_date',
        ]);

        $target->update($request->only(['target_volume', 'unit', 'start_date', 'end_date']));

        return $target;
    }

    // DELETE TARGET
    public function destroyTarget($id)
    {
        SalesTarget::findOrFail($id)->delete();

        return response()->noContent();
    }
}