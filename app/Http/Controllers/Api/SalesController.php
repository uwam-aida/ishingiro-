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
use App\Models\Revenue;
use App\Models\SalesTarget;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    /**
     * Get all cake orders with image URLs
     */
    public function cakeOrders()
    {
        $orders = CakeOrder::latest()->get();
        
        $orders->transform(function ($order) {
            if ($order->inspo_image_path) {
                $order->inspo_image_url = Storage::disk('public')->url($order->inspo_image_path);
            }
            return $order;
        });
        
        return response()->json($orders);
    }

    /**
     * CREATE CAKE ORDER from sales coordinator - FULL PAYLOAD
     */
    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'cake_type' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'advance_payment' => 'nullable|numeric|min:0',
            'location' => 'required|in:kabuga,masaka',
            'delivery_date' => 'required|date',
            'cake_message' => 'nullable|string',
            'cake_size' => 'nullable|string',
            'frosting_cream' => 'nullable|string',
            'frosting_color' => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'reception_location' => 'nullable|string',
            'needs_sample' => 'nullable|boolean',
            'payment_method' => 'nullable|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name' => 'nullable|string',
            'inspo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        // Handle image upload
        $inspoImagePath = null;
        if ($request->hasFile('inspo_image')) {
            $inspoImagePath = $request->file('inspo_image')->store('cake-inspo', 'public');
        }

        // Calculate payments
        $advancePayment = $request->advance_payment ?? 0;
        $remainingPayment = $request->price - $advancePayment;
        $totalPaid = $advancePayment;

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

        // Record advance payment revenue
        if ($advancePayment > 0) {
            Revenue::create([
                'amount' => $advancePayment,
                'source' => 'cake_order_advance_' . $cakeOrder->id,
                'location' => $request->location,
            ]);
        }

        SendNotificationJob::dispatch('shop_manager_' . $request->location, 'New cake order #' . $cakeOrder->id . ' from sales coordinator');
        SendNotificationJob::dispatch('store_keeper', 'New cake order #' . $cakeOrder->id . ' requires preparation');

        return response()->json($cakeOrder, 201);
    }

    /**
     * ADDITIONAL PAYMENT ON CAKE ORDER
     */
    public function addCakeOrderPayment(Request $request, $id)
    {
        $request->validate([
            'payment_amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name' => 'nullable|string',
        ]);

        $cakeOrder = CakeOrder::findOrFail($id);

        if ($cakeOrder->status === 'delivered' && $cakeOrder->remaining_payment == 0) {
            return response()->json(['error' => 'Order is already fully paid'], 400);
        }

        $newTotalPaid = $cakeOrder->total_paid + $request->payment_amount;
        
        if ($newTotalPaid > $cakeOrder->price) {
            return response()->json(['error' => 'Payment amount exceeds remaining balance'], 400);
        }

        $cakeOrder->total_paid = $newTotalPaid;
        $cakeOrder->remaining_payment = $cakeOrder->price - $newTotalPaid;
        
        if ($request->has('payment_method')) {
            $cakeOrder->payment_method = $request->payment_method;
        }
        if ($request->has('payer_name')) {
            $cakeOrder->payer_name = $request->payer_name;
        }
        
        $cakeOrder->save();

        // Record revenue for this payment
        Revenue::create([
            'amount' => $request->payment_amount,
            'source' => 'cake_order_payment_' . $cakeOrder->id,
            'location' => $cakeOrder->location,
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'cake_order' => $cakeOrder,
            'remaining_balance' => $cakeOrder->remaining_payment,
            'total_paid' => $cakeOrder->total_paid,
        ]);
    }
}