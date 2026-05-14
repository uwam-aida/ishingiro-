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
use App\Models\Revenue;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
    // public function storeCakeOrder(Request $request)
    // {
    //     $request->validate([
    //         'customer_name'        => 'required|string',
    //         'phone'                => 'required|string',
    //         'cake_type'            => 'required|string',
    //         'quantity'             => 'required|integer|min:1',
    //         'price'                => 'required|numeric',
    //         'location'             => 'required|in:kabuga,masaka',
    //         'delivery_date'        => 'required|date',
    //         'cake_message'         => 'nullable|string',
    //         'cake_size'            => 'nullable|string',
    //         'frosting_cream'       => 'nullable|string',
    //         'frosting_color'       => 'nullable|string',
    //         'special_instructions' => 'nullable|string',
    //         'reception_location'   => 'nullable|string',
    //         'needs_sample'         => 'nullable|boolean',
    //     ]);

    //     $order = CakeOrder::create($request->all());

    //     SendNotificationJob::dispatch('store_keeper', 'New cake order from ' . $request->location);
    //     SendNotificationJob::dispatch('sales_coordinator', 'New cake order submitted');

    //     return $order;
    // }

    // UPDATE CAKE ORDER STATUS (e.g. pending → in_progress → ready → delivered)
    // public function updateCakeOrder(Request $request, $id)
    // {
    //     $request->validate([
    //         'status'               => 'sometimes|string',
    //         'cake_message'         => 'sometimes|string',
    //         'cake_size'            => 'sometimes|string',
    //         'frosting_cream'       => 'sometimes|string',
    //         'frosting_color'       => 'sometimes|string',
    //         'special_instructions' => 'sometimes|string',
    //         'reception_location'   => 'sometimes|string',
    //         'needs_sample'         => 'sometimes|boolean',
    //         'delivery_date'        => 'sometimes|date',
    //     ]);

    //     $cakeOrder = CakeOrder::where('location', auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka')
    //         ->findOrFail($id);

    //     $cakeOrder->update($request->all());

    //     return $cakeOrder;
    // }

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
    // public function cakeOrdersByLocation($location)
    // {
    //     return CakeOrder::where('location', $location)->latest()->get();
    // }

    // GET DAMAGES BY LOCATION
    // public function damagesByLocation($location)
    // {
    //     return Damage::with('product')
    //         ->where('location', $location)
    //         ->latest()
    //         ->get();
    // }
    public function cakeOrdersLocation()
    {
        $location = auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka';

        return CakeOrder::latest()
            ->where('location', $location)
            ->get()
            ->map(fn($c) => array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]));
    }

    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'cake_type' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'advance_payment' => 'nullable|numeric|min:0|max:' . ($request->price ?? 0),
            'location' => 'required|in:kabuga,masaka',
            'delivery_date' => 'required|date|after_or_equal:today',
            'cake_message' => 'nullable|string',
            'cake_size' => 'nullable|string|max:100',
            'frosting_cream' => 'nullable|string|max:100',
            'frosting_color' => 'nullable|string|max:50',
            'special_instructions' => 'nullable|string',
            'reception_location' => 'nullable|string|max:255',
            'needs_sample' => 'nullable|boolean',
            'payment_method' => 'nullable|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name' => 'nullable|string|max:255',
            'inspo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        DB::beginTransaction();

        try {
            // Handle image upload
            $inspoImagePath = null;
            if ($request->hasFile('inspo_image')) {
                $inspoImagePath = $request->file('inspo_image')->store('cake-inspo', 'public');
            }

            // Calculate payments
            $advancePayment = $request->advance_payment ?? 0;
            $totalPaid = $advancePayment;
            $remainingPayment = $request->price - $advancePayment;

            $cakeOrder = CakeOrder::create([
                'customer_name' => $request->customer_name,
                'phone' => $request->phone,
                'cake_type' => $request->cake_type,
                'quantity' => $request->quantity,
                'price' => $request->price,
                'advance_payment' => $advancePayment,
                'remaining_payment' => $remainingPayment,
                'total_paid' => $totalPaid,
                'location' => $request->location,
                'delivery_date' => $request->delivery_date,
                'status' => 'pending',
                'cake_message' => $request->cake_message,
                'cake_size' => $request->cake_size,
                'frosting_cream' => $request->frosting_cream,
                'frosting_color' => $request->frosting_color,
                'special_instructions' => $request->special_instructions,
                'reception_location' => $request->reception_location,
                'needs_sample' => $request->needs_sample ?? false,
                'inspo_image_path' => $inspoImagePath,
                'payment_method' => $request->payment_method,
                'payer_name' => $request->payer_name,
            ]);

            // Record revenue if advance payment was made
            if ($advancePayment > 0) {
                Revenue::create([
                    'amount' => $advancePayment,
                    'source' => 'cake_order_advance',
                    'location' => $request->location,
                    'reference_type' => CakeOrder::class,
                    'reference_id' => $cakeOrder->id,
                ]);
            }

            DB::commit();

            SendNotificationJob::dispatch('store_keeper', 'New cake order #' . $cakeOrder->id . ' from ' . $request->location);
            SendNotificationJob::dispatch('sales_coordinator', 'New cake order #' . $cakeOrder->id . ' submitted');

            return response()->json($cakeOrder, 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create cake order: ' . $e->getMessage()], 500);
        }
    }

    // UPDATE CAKE ORDER
    public function updateCakeOrder(Request $request, $id)
    {
        $location = auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka';
        
        $cakeOrder = CakeOrder::where('location', $location)->findOrFail($id);

        $request->validate([
            'status' => 'sometimes|string|in:pending,in_progress,ready,delivered,cancelled',
            'cake_message' => 'nullable|string',
            'cake_size' => 'nullable|string|max:100',
            'frosting_cream' => 'nullable|string|max:100',
            'frosting_color' => 'nullable|string|max:50',
            'special_instructions' => 'nullable|string',
            'reception_location' => 'nullable|string|max:255',
            'needs_sample' => 'nullable|boolean',
            'delivery_date' => 'nullable|date',
            'additional_payment' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name' => 'nullable|string|max:255',
            'inspo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        DB::beginTransaction();

        try {
            // Handle additional payment
            if ($request->has('additional_payment') && $request->additional_payment > 0) {
                $newTotalPaid = $cakeOrder->total_paid + $request->additional_payment;
                
                if ($newTotalPaid > $cakeOrder->price) {
                    return response()->json(['error' => 'Payment amount exceeds remaining balance'], 400);
                }
                
                $cakeOrder->total_paid = $newTotalPaid;
                $cakeOrder->remaining_payment = $cakeOrder->price - $newTotalPaid;
                
                // Record revenue for additional payment
                Revenue::create([
                    'amount' => $request->additional_payment,
                    'source' => 'cake_order_payment',
                    'location' => $cakeOrder->location,
                    'reference_type' => CakeOrder::class,
                    'reference_id' => $cakeOrder->id,
                ]);
            }

            // Handle payment method and payer name
            if ($request->has('payment_method')) {
                $cakeOrder->payment_method = $request->payment_method;
            }
            if ($request->has('payer_name')) {
                $cakeOrder->payer_name = $request->payer_name;
            }

            // Handle image upload
            if ($request->hasFile('inspo_image')) {
                // Delete old image if exists
                if ($cakeOrder->inspo_image_path) {
                    Storage::disk('public')->delete($cakeOrder->inspo_image_path);
                }
                $cakeOrder->inspo_image_path = $request->file('inspo_image')->store('cake-inspo', 'public');
            }

            // Update other fields
            $cakeOrder->fill($request->only([
                'status', 'cake_message', 'cake_size', 'frosting_cream', 
                'frosting_color', 'special_instructions', 'reception_location', 
                'needs_sample', 'delivery_date'
            ]));

            $cakeOrder->save();

            DB::commit();

            return response()->json($cakeOrder);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update cake order: ' . $e->getMessage()], 500);
        }
    }

    // GET CAKE ORDERS BY LOCATION with image URL
    // public function cakeOrdersByLocation($location)
    // {
    //     $orders = CakeOrder::where('location', $location)->latest()->get();
    //     return response()->json($orders);
    // }

    // GET CURRENT MANAGER'S CAKE ORDERS
    // public function cakeOrdersLocation()
    // {
    //     $location = auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka';
        
    //     return CakeOrder::latest()
    //         ->where('location', $location)
    //         ->get()
    //         ->map(fn($c) => array_merge($c->toArray(), [
    //             'time' => $c->created_at->format('h:i A'),
    //             'date' => $c->created_at->toDateString(),
    //         ]));
    // }


}