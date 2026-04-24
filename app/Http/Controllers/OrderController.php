<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = Order::create([
            'user_id' => auth()->id(),
            'location' => $request->location,
        ]);

        foreach ($request->items as $item) {

            $product = Product::find($item['product_id']);

            // Reduce stock
            app(StockController::class)->reduceStock(
                $product->id,
                $request->location,
                $item['quantity']
            );

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price
            ]);
        }

        return $order->load('items');
    }
}
