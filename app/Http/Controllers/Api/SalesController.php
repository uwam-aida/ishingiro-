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
use Illuminate\Http\Request;

class SalesController extends Controller
{
    // DASHBOARD — all 6 cards
    public function dashboard()
    {
        return [
            'shop_requests'      => Order::count(),
            'cake_orders'        => CakeOrder::count(),
            'baked_products'     => Production::sum('quantity'),
            'delivered_products' => Delivery::sum('quantity'),
            'shop_stock'         => Stock::sum('quantity'),
            'damaged_products'   => Damage::sum('quantity'),
        ];
    }

    // GET CAKE ORDERS
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
                $actual >= $target->target_volume              => 'Completed',
                $actual >= ($target->target_volume * 0.7)     => 'On Track',
                default                                        => 'Behind',
            };

            return [
                'id'            => $target->id,
                'product_name'  => $target->product->name,
                'target_volume' => $target->target_volume,
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
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after:start_date',
        ]);

        return SalesTarget::create($request->all());
    }
}