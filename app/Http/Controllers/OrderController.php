<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request, $location, NotificationService $notify)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if (!in_array($location, ['kabuga', 'masaka'])) {
            abort(400, 'Invalid location');
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'location' => $location,
            'status' => 'pending'
        ]);

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);

            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price
            ]);
        }

        //NOTIFICATIONS
        $notify->sendToRole('store_keeper', "New order received ($location)");
        $notify->sendToRole('sales_coordinator', "New order created");
        $notify->sendToRole('marketing_manager', "Order created in $location");

        return $order->load('items');
    }
        
}
