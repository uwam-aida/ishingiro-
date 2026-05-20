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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SalesController extends Controller
{
    // DASHBOARD — all summary cards + history count
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

    // PENDING SHOP REQUESTS
    public function requests()
    {
        return Order::with('items.product')
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    // PRODUCTION LIST
    public function baked()
    {
        return Production::with('product')->latest()->get();
    }

    // DELIVERIES LIST
    public function delivered()
    {
        return Delivery::with('product')->latest()->get();
    }

    // ALL BRANCH STOCK
    public function stock()
    {
        return Stock::with('product')->get();
    }

    // DAMAGE LIST
    public function damaged()
    {
        return Damage::with('product')->latest()->get();
    }

    // STOCK MOVEMENT HISTORY
    public function history()
    {
        return StockMovement::with('product')->latest()->get();
    }

    // ALL CAKE ORDERS — with inspo image URL resolved
    public function cakeOrders()
    {
        return CakeOrder::latest()->get()->map(function ($order) {
            if ($order->inspo_image_path) {
                $order->inspo_image_url = asset('storage/' . $order->inspo_image_path);
            }
            return $order;
        });
    }

    // CREATE CAKE ORDER (sales coordinator)
    // - Full payment fields + image upload
    // - Records advance payment as Revenue
    // - Notifies shop manager + store keeper
    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name'        => 'required|string',
            'phone'                => 'required|string',
            'cake_type'            => 'required|string',
            'quantity'             => 'required|integer|min:1',
            'price'                => 'required|numeric|min:0',
            'advance_payment'      => 'nullable|numeric|min:0',
            'location'             => 'required|in:kabuga,masaka',
            'delivery_date'        => 'required|date',
            'cake_message'         => 'nullable|string',
            'cake_size'            => 'nullable|string',
            'frosting_cream'       => 'nullable|string',
            'frosting_color'       => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'reception_location'   => 'nullable|string',
            'needs_sample'         => 'nullable|boolean',
            'payment_method'       => 'nullable|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name'           => 'nullable|string',
            'inspo_image'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $cakeOrder = DB::transaction(function () use ($request) {
            $inspoImagePath = $request->hasFile('inspo_image')
                ? $request->file('inspo_image')->store('cake-inspo', 'public')
                : null;

            $advance   = (float) ($request->advance_payment ?? 0);
            $remaining = (float) $request->price - $advance;

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
            'shop_manager_' . $request->location,
            'New cake order #' . $cakeOrder->id . ' from sales coordinator'
        );
        SendNotificationJob::dispatch(
            'store_keeper',
            'New cake order #' . $cakeOrder->id . ' requires preparation'
        );

        return response()->json($cakeOrder, 201);
    }

    // ADD PAYMENT TO EXISTING CAKE ORDER
    // - Updates total_paid + remaining_payment
    // - Records Revenue for the payment amount
    public function addCakeOrderPayment(Request $request, $id)
    {
        $request->validate([
            'payment_amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:cash,card,mobile_money,bank_transfer',
            'payer_name'     => 'nullable|string',
        ]);

        $cakeOrder = CakeOrder::findOrFail($id);

        if ($cakeOrder->remaining_payment <= 0) {
            return response()->json(['error' => 'Order is already fully paid'], 400);
        }

        $newTotal = $cakeOrder->total_paid + $request->payment_amount;

        if ($newTotal > $cakeOrder->price) {
            return response()->json(['error' => 'Payment amount exceeds remaining balance'], 400);
        }

        DB::transaction(function () use ($request, $cakeOrder, $newTotal) {
            $cakeOrder->update([
                'total_paid'        => $newTotal,
                'remaining_payment' => $cakeOrder->price - $newTotal,
                'payment_method'    => $request->payment_method,
                'payer_name'        => $request->payer_name ?? $cakeOrder->payer_name,
            ]);

            Revenue::create([
                'amount'   => $request->payment_amount,
                'source'   => 'cake_order_payment',
                'location' => $cakeOrder->location,
            ]);
        });

        return response()->json([
            'message'           => 'Payment recorded successfully',
            'cake_order'        => $cakeOrder->fresh(),
            'total_paid'        => $cakeOrder->total_paid,
            'remaining_balance' => $cakeOrder->remaining_payment,
        ]);
    }

    // SEND MESSAGE TO A ROLE GROUP
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

    //Get single order with full details including items
    
    public function getRequestDetails($id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);
        
        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'location' => $order->location,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'requested_by' => optional($order->user)->name,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => optional($item->product)->name,
                    'product_price' => optional($item->product)->price,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->price,
                    'total' => $item->quantity * $item->price,
                ];
            })->toArray(),
            'total_amount' => $order->items->sum(function ($item) {
                return $item->quantity * $item->price;
            }),
        ]);
    }

    /**
     * Get single cake order with full details including payment info
     * GET /api/sales/cake-orders/{id}
     */
    public function getCakeOrderDetails($id)
    {
        $cakeOrder = CakeOrder::findOrFail($id);
        
        // Add image URL if exists
        if ($cakeOrder->inspo_image_path) {
            $cakeOrder->inspo_image_url = asset('storage/' . $cakeOrder->inspo_image_path);
        }
        
        // Calculate payment summary
        $paymentSummary = [
            'total_price' => (float) $cakeOrder->price,
            'advance_payment' => (float) $cakeOrder->advance_payment,
            'total_paid' => (float) $cakeOrder->total_paid,
            'remaining_payment' => (float) $cakeOrder->remaining_payment,
            'payment_status' => $cakeOrder->getPaymentStatusAttribute(),
            'payment_method' => $cakeOrder->payment_method,
            'payer_name' => $cakeOrder->payer_name,
        ];
        
        // Get payment history from revenues
        $paymentHistory = Revenue::where(function ($query) use ($cakeOrder) {
                $query->where('source', 'cake_order_advance')
                      ->orWhere('source', 'cake_order_payment');
            })
            ->where('location', $cakeOrder->location)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($revenue) {
                return [
                    'amount' => (float) $revenue->amount,
                    'type' => $revenue->source === 'cake_order_advance' ? 'Advance Payment' : 'Additional Payment',
                    'date' => $revenue->created_at->toDateString(),
                    'time' => $revenue->created_at->format('h:i A'),
                ];
            });
        
        return response()->json([
            'id' => $cakeOrder->id,
            'customer_name' => $cakeOrder->customer_name,
            'phone' => $cakeOrder->phone,
            'cake_type' => $cakeOrder->cake_type,
            'quantity' => $cakeOrder->quantity,
            'location' => $cakeOrder->location,
            'delivery_date' => $cakeOrder->delivery_date,
            'status' => $cakeOrder->status,
            'cake_message' => $cakeOrder->cake_message,
            'cake_size' => $cakeOrder->cake_size,
            'frosting_cream' => $cakeOrder->frosting_cream,
            'frosting_color' => $cakeOrder->frosting_color,
            'special_instructions' => $cakeOrder->special_instructions,
            'reception_location' => $cakeOrder->reception_location,
            'needs_sample' => $cakeOrder->needs_sample,
            'inspo_image_url' => $cakeOrder->inspo_image_url,
            'created_at' => $cakeOrder->created_at,
            'updated_at' => $cakeOrder->updated_at,
            'payment' => $paymentSummary,
            'payment_history' => $paymentHistory,
        ]);
    }
}
