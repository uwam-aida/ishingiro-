<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Feedback;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;

class ShopManagerController extends Controller
{
    // CREATE ORDER
    public function storeOrder(Request $request)
    {
        $request->validate([
            'location'             => 'required|in:kabuga,masaka',
            'items'                => 'required|array|min:1',
            'items.*.product_id'   => 'required|exists:products,id',
            'items.*.quantity'     => 'required|integer|min:1',
        ]);

        $order = Order::create([
            'user_id'  => auth()->id(),
            'location' => $request->location,
            'status'   => 'pending',
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'product_id' => $item['product_id'],
                'quantity'   => $item['quantity'],
                'price'      => Product::find($item['product_id'])->price,
            ]);
        }

        SendNotificationJob::dispatch('store_keeper', 'New product request from ' . $request->location);

        return $order->load('items.product');
    }

    // CREATE CAKE ORDER — full fields including new cake detail columns
    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name'        => 'required|string',
            'phone'                => 'required|string',
            'cake_type'            => 'required|string',
            'quantity'             => 'required|integer|min:1',
            'price'                => 'required|numeric',
            'location'             => 'required|in:kabuga,masaka',
            'delivery_date'        => 'required|date',
            'cake_message'         => 'nullable|string',
            'cake_size'            => 'nullable|string',
            'frosting_cream'       => 'nullable|string',
            'frosting_color'       => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'reception_location'   => 'nullable|string',
            'needs_sample'         => 'nullable|boolean',
        ]);

        $order = CakeOrder::create($request->all());

        SendNotificationJob::dispatch('store_keeper', 'New cake order from ' . $request->location);
        SendNotificationJob::dispatch('sales_coordinator', 'New cake order submitted');

        return $order;
    }

    // UPDATE CAKE ORDER STATUS (e.g. pending → in_progress → ready → delivered)
    public function updateCakeOrder(Request $request, $id)
    {
        $request->validate([
            'status'               => 'sometimes|string',
            'cake_message'         => 'sometimes|string',
            'cake_size'            => 'sometimes|string',
            'frosting_cream'       => 'sometimes|string',
            'frosting_color'       => 'sometimes|string',
            'special_instructions' => 'sometimes|string',
            'reception_location'   => 'sometimes|string',
            'needs_sample'         => 'sometimes|boolean',
            'delivery_date'        => 'sometimes|date',
        ]);

        $cakeOrder = CakeOrder::where('location', auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka')
            ->findOrFail($id);

        $cakeOrder->update($request->all());

        return $cakeOrder;
    }

    // MARK ORDER AS RECEIVED — updates status and adds received stock
    public function receiveOrder(Request $request, $id)
    {
        $order = Order::with('items.product')
            ->where('location', auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka')
            ->findOrFail($id);

        if ($order->status === 'received') {
            return response()->json(['error' => 'Order already marked as received'], 400);
        }

        // Update order status
        $order->update(['status' => 'received']);

        // Increment stock for each item in the order
        foreach ($order->items as $item) {
            $stock = Stock::firstOrCreate([
                'product_id' => $item->product_id,
                'location'   => $order->location,
            ]);
            $stock->increment('quantity', $item->quantity);
        }

        SendNotificationJob::dispatch('store_keeper', 'Order #' . $id . ' marked as received by ' . $order->location);
        SendNotificationJob::dispatch('sales_coordinator', 'Order #' . $id . ' has been received');

        return $order->fresh()->load('items.product');
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

    // GET CAKE ORDERS BY LOCATION
    public function cakeOrdersByLocation($location)
    {
        return CakeOrder::where('location', $location)->latest()->get();
    }

    // GET DAMAGES BY LOCATION
    public function damagesByLocation($location)
    {
        return Damage::with('product')
            ->where('location', $location)
            ->latest()
            ->get();
    }

}