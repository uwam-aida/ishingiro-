<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Store a new order
     * 
     * @param Request $request
     * @param string $location - 'kabuga' or 'masaka'
     */
    public function store(Request $request, $location)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
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

        // NOTIFICATIONS
        SendNotificationJob::dispatch('store_keeper', "New order received ($location)");
        SendNotificationJob::dispatch('sales_coordinator', "New order created");
        SendNotificationJob::dispatch('marketing_manager', "Order created in $location");

        return $order->load('items');
    }

    /**
     * Get all orders for a specific location
     * 
     * @param string $location
     */
    public function indexByLocation($location)
    {
        return Order::with('items.product')
            ->where('location', $location)
            ->latest()
            ->get();
    }
}