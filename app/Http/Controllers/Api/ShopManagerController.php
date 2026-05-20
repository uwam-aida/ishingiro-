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
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ShopManagerController extends Controller
{
    // Helper: get location from authenticated manager's role
    private function myLocation(): string
    {
        return auth()->user()->role->name === 'shop_manager_kabuga' ? 'kabuga' : 'masaka';
    }

    // CREATE ORDER — places product request to store keeper
    public function storeOrder(Request $request)
    {
        $request->validate([
            'location'           => 'required|in:kabuga,masaka',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
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

    // MARK ORDER AS RECEIVED
    // - Updates order status → received
    // - Increments shop stock for every item
    // - Logs StockMovement (type = in) for every item
    // - Notifies store_keeper and sales_coordinator
    public function receiveOrder(Request $request, $id)
    {
        $order = Order::with('items.product')
            ->where('location', $this->myLocation())
            ->findOrFail($id);

        if ($order->status === 'received') {
            return response()->json(['error' => 'Order already marked as received'], 400);
        }

        DB::transaction(function () use ($order, $id) {
            $order->update(['status' => 'received']);

            foreach ($order->items as $item) {
                $stock = Stock::firstOrCreate([
                    'product_id' => $item->product_id,
                    'location'   => $order->location,
                ]);
                $stock->increment('quantity', $item->quantity);

                StockMovement::create([
                    'product_id' => $item->product_id,
                    'type'       => 'in',
                    'quantity'   => $item->quantity,
                    'location'   => $order->location,
                    'user_id'    => auth()->id(),
                ]);
            }
        });

        SendNotificationJob::dispatch(
            'store_keeper',
            'Order #' . $id . ' marked as received by ' . $order->location
        );
        SendNotificationJob::dispatch(
            'sales_coordinator',
            'Order #' . $id . ' has been received'
        );

        return $order->fresh()->load('items.product');
    }

    // CREATE CAKE ORDER
    // - Full payment fields: advance_payment, remaining_payment, total_paid
    // - Uploads inspo image to public disk
    // - Records advance payment as Revenue if > 0
    // - Wraps in DB transaction for safety
    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name'        => 'required|string|max:255',
            'phone'                => 'required|string|max:20',
            'cake_type'            => 'required|string|max:255',
            'quantity'             => 'required|integer|min:1',
            'price'                => 'required|numeric|min:0',
            'advance_payment'      => 'nullable|numeric|min:0',
            'location'             => 'required|in:kabuga,masaka',
            'delivery_date'        => 'required|date|after_or_equal:today',
            'cake_message'         => 'nullable|string',
            'cake_size'            => 'nullable|string|max:100',
            'frosting_cream'       => 'nullable|string|max:100',
            'frosting_color'       => 'nullable|string|max:50',
            'special_instructions' => 'nullable|string',
            'reception_location'   => 'nullable|string|max:255',
            'needs_sample'         => 'nullable|boolean',
            'payment_method'       => 'nullable|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name'           => 'nullable|string|max:255',
            'inspo_image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $cakeOrder = DB::transaction(function () use ($request) {
            $inspoImagePath = $request->hasFile('inspo_image')
                ? $request->file('inspo_image')->store('cake-inspo', 'public')
                : null;

            $advance          = (float) ($request->advance_payment ?? 0);
            $remaining        = (float) $request->price - $advance;

            $cakeOrder = CakeOrder::create([
                'customer_name'        => $request->customer_name,
                'phone'                => $request->phone,
                'cake_type'            => $request->cake_type,
                'quantity'             => $request->quantity,
                'price'                => $request->price,
                'advance_payment'      => $advance,
                'remaining_payment'    => $remaining,
                'total_paid'           => $advance,
                'location'             => $request->location,
                'delivery_date'        => $request->delivery_date,
                'status'               => 'pending',
                'cake_message'         => $request->cake_message,
                'cake_size'            => $request->cake_size,
                'frosting_cream'       => $request->frosting_cream,
                'frosting_color'       => $request->frosting_color,
                'special_instructions' => $request->special_instructions,
                'reception_location'   => $request->reception_location,
                'needs_sample'         => $request->needs_sample ?? false,
                'inspo_image_path'     => $inspoImagePath,
                'payment_method'       => $request->payment_method,
                'payer_name'           => $request->payer_name,
            ]);

            // Record advance as revenue immediately
            if ($advance > 0) {
                Revenue::create([
                    'amount'   => $advance,
                    'source'   => 'cake_order_advance',
                    'location' => $request->location,
                ]);
            }

            return $cakeOrder;
        });

        SendNotificationJob::dispatch(
            'store_keeper',
            'New cake order #' . $cakeOrder->id . ' from ' . $request->location
        );
        SendNotificationJob::dispatch(
            'sales_coordinator',
            'New cake order #' . $cakeOrder->id . ' submitted'
        );

        return response()->json($cakeOrder, 201);
    }

    // UPDATE CAKE ORDER
    // - Scoped to manager's branch only
    // - Handles additional_payment: updates total_paid/remaining, records Revenue
    // - Replaces inspo image if new one uploaded
    public function updateCakeOrder(Request $request, $id)
    {
        $cakeOrder = CakeOrder::where('location', $this->myLocation())->findOrFail($id);

        $request->validate([
            'status'               => 'nullable|string|in:pending,in_progress,ready,delivered,cancelled',
            'cake_message'         => 'nullable|string',
            'cake_size'            => 'nullable|string|max:100',
            'frosting_cream'       => 'nullable|string|max:100',
            'frosting_color'       => 'nullable|string|max:50',
            'special_instructions' => 'nullable|string',
            'reception_location'   => 'nullable|string|max:255',
            'needs_sample'         => 'nullable|boolean',
            'delivery_date'        => 'nullable|date',
            'additional_payment'   => 'nullable|numeric|min:0',
            'payment_method'       => 'nullable|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name'           => 'nullable|string|max:255',
            'inspo_image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        DB::transaction(function () use ($request, $cakeOrder) {
            // Additional payment
            if ($request->filled('additional_payment') && $request->additional_payment > 0) {
                $newTotal = $cakeOrder->total_paid + $request->additional_payment;

                if ($newTotal > $cakeOrder->price) {
                    abort(400, 'Payment amount exceeds remaining balance');
                }

                $cakeOrder->total_paid        = $newTotal;
                $cakeOrder->remaining_payment = $cakeOrder->price - $newTotal;

                Revenue::create([
                    'amount'   => $request->additional_payment,
                    'source'   => 'cake_order_payment',
                    'location' => $cakeOrder->location,
                ]);
            }

            // Replace inspo image
            if ($request->hasFile('inspo_image')) {
                if ($cakeOrder->inspo_image_path) {
                    Storage::disk('public')->delete($cakeOrder->inspo_image_path);
                }
                $cakeOrder->inspo_image_path = $request->file('inspo_image')
                    ->store('cake-inspo', 'public');
            }

            $cakeOrder->fill($request->only([
                'status', 'cake_message', 'cake_size', 'frosting_cream',
                'frosting_color', 'special_instructions', 'reception_location',
                'needs_sample', 'delivery_date', 'payment_method', 'payer_name',
            ]));

            $cakeOrder->save();
        });

        return response()->json($cakeOrder);
    }

    // GET MANAGER'S CAKE ORDERS (branch-scoped)
    public function cakeOrdersLocation()
    {
        return CakeOrder::where('location', $this->myLocation())
            ->latest()
            ->get()
            ->map(fn($c) => array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]));
    }

    // CREATE FEEDBACK
    public function storeFeedback(Request $request)
    {
        $request->validate([
            'customer_name' => 'nullable|string',
            'message'       => 'nullable|string',
            'rating'        => 'nullable|integer|min:1|max:5',
            'location'      => 'nullable|string',
        ]);

        return Feedback::create($request->all());
    }

    // RECORD DAMAGE
    // - Creates Damage record
    // - Decrements shop stock + logs StockMovement (out)
    public function recordDamage(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'nullable|string',
            'location'   => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, &$damage) {
            $damage = Damage::create($request->all());

            $location = $request->location ?? $this->myLocation();
            $stock    = Stock::where('product_id', $request->product_id)
                ->where('location', $location)
                ->first();

            if ($stock && $stock->quantity >= $request->quantity) {
                $stock->decrement('quantity', $request->quantity);

                StockMovement::create([
                    'product_id' => $request->product_id,
                    'type'       => 'out',
                    'quantity'   => $request->quantity,
                    'location'   => $location,
                    'user_id'    => auth()->id(),
                ]);
            }
        });

        if ($damage && $damage->quantity > 20) {
            SendNotificationJob::dispatch('operations_manager', 'High damage reported at shop');
            SendNotificationJob::dispatch('marketing_manager', 'Critical damage alert');
        }

        return $damage ? $damage->load('product') : null;
    }
}