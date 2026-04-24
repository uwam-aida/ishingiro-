<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request, $location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            abort(400, 'Invalid location');
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'location' => $location
        ]);

        foreach ($request->items as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => Product::find($item['product_id'])->price
            ]);
        }

        return $order->load('items');
    }
}
