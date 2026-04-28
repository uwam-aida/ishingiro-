<?php

namespace App\Http\Controllers;

use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Feedback;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class ShopManagerController extends Controller
{
    // CREATE ORDER
    public function storeOrder(Request $request)
    {
        $order = Order::create([
            'user_id' => auth()->id(),
            'location' => $request->location
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => Product::find($item['product_id'])->price
            ]);
        }

        return $order->load('items');
    }

    // CREATE CAKE ORDER
    public function storeCakeOrder(Request $request)
    {
        return CakeOrder::create($request->all());
    }

    // CREATE FEEDBACK
    public function storeFeedback(Request $request)
    {
        return Feedback::create($request->all());
    }

    // RECORD DAMAGE
    public function recordDamage(Request $request)
    {
        return Damage::create($request->all());
    }
}
