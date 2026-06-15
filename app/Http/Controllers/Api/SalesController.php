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
use App\Models\SentMessage;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class SalesController extends Controller
{
    private function myLocation(): string
    {
        $userRole = auth()->user()->role->name;
        if ($userRole === 'shop_manager_kabuga') {
            return 'kabuga';
        } elseif ($userRole === 'shop_manager_masaka') {
            return 'masaka';
        }
        return 'kabuga';
    }

    // DASHBOARD
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

    // ALL CAKE ORDERS
    public function cakeOrders()
    {
        return CakeOrder::latest()->get()->map(function ($order) {
            if ($order->inspo_image_path) {
                $order->inspo_image_url = asset('storage/' . $order->inspo_image_path);
            }
            return $order;
        });
    }

    // CREATE CAKE ORDER
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
            'payment_method'       => 'nullable|string|in:cash,Cash,card,mobile_money,bank_transfer,momo,Momo,MoMo',
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
    public function addCakeOrderPayment(Request $request, $id)
    {
        $request->validate([
            'payment_amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:cash,Cash,card,mobile_money,bank_transfer,momo,Momo,MoMo',
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

    // Get single order with full details
    public function getRequestDetails($id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);

        return response()->json([
            'id'           => $order->id,
            'status'       => $order->status,
            'location'     => $order->location,
            'created_at'   => $order->created_at,
            'updated_at'   => $order->updated_at,
            'requested_by' => optional($order->user)->name,
            'items'        => $order->items->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'product_id'    => $item->product_id,
                    'product_name'  => optional($item->product)->name,
                    'product_price' => optional($item->product)->price,
                    'quantity'      => $item->quantity,
                    'unit_price'    => $item->price,
                    'total'         => $item->quantity * $item->price,
                ];
            })->toArray(),
            'total_amount' => $order->items->sum(function ($item) {
                return $item->quantity * $item->price;
            }),
        ]);
    }

    // Get single cake order with full details
    public function getCakeOrderDetails($id)
    {
        $cakeOrder = CakeOrder::findOrFail($id);

        if ($cakeOrder->inspo_image_path) {
            $cakeOrder->inspo_image_url = asset('storage/' . $cakeOrder->inspo_image_path);
        }

        $paymentSummary = [
            'total_price'       => (float) $cakeOrder->price,
            'advance_payment'   => (float) $cakeOrder->advance_payment,
            'total_paid'        => (float) $cakeOrder->total_paid,
            'remaining_payment' => (float) $cakeOrder->remaining_payment,
            'payment_status'    => $cakeOrder->getPaymentStatusAttribute(),
            'payment_method'    => $cakeOrder->payment_method,
            'payer_name'        => $cakeOrder->payer_name,
        ];

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
                    'type'   => $revenue->source === 'cake_order_advance' ? 'Advance Payment' : 'Additional Payment',
                    'date'   => $revenue->created_at->toDateString(),
                    'time'   => $revenue->created_at->format('h:i A'),
                ];
            });

        return response()->json([
            'id'                   => $cakeOrder->id,
            'customer_name'        => $cakeOrder->customer_name,
            'phone'                => $cakeOrder->phone,
            'cake_type'            => $cakeOrder->cake_type,
            'quantity'             => $cakeOrder->quantity,
            'location'             => $cakeOrder->location,
            'delivery_date'        => $cakeOrder->delivery_date,
            'status'               => $cakeOrder->status,
            'cake_message'         => $cakeOrder->cake_message,
            'cake_size'            => $cakeOrder->cake_size,
            'frosting_cream'       => $cakeOrder->frosting_cream,
            'frosting_color'       => $cakeOrder->frosting_color,
            'special_instructions' => $cakeOrder->special_instructions,
            'reception_location'   => $cakeOrder->reception_location,
            'needs_sample'         => $cakeOrder->needs_sample,
            'inspo_image_url'      => $cakeOrder->inspo_image_url ?? null,
            'created_at'           => $cakeOrder->created_at,
            'updated_at'           => $cakeOrder->updated_at,
            'payment'              => $paymentSummary,
            'payment_history'      => $paymentHistory,
        ]);
    }

    // ============================================
    // MESSAGE SENDING
    // ============================================

    public function sendMessage(Request $request)
    {
        $request->validate([
            'recipient_roles'   => 'sometimes|array',
            'recipient_roles.*' => 'string|in:shop_manager_kabuga,shop_manager_masaka,store_keeper,baker_assistant,production_manager,sales_coordinator,cicm',
            'recipient_role'    => 'sometimes|string|in:shop_manager_kabuga,shop_manager_masaka,store_keeper,baker_assistant,production_manager,sales_coordinator,cicm,all',
            'message'           => 'required|string|min:1|max:1000',
        ]);

        $message = $request->message;
        $roles   = [];

        if ($request->has('recipient_roles')) {
            $roles = $request->recipient_roles;
        } elseif ($request->has('recipient_role')) {
            if ($request->recipient_role === 'all') {
                $roles = [
                    'shop_manager_kabuga', 'shop_manager_masaka', 'store_keeper',
                    'baker_assistant', 'production_manager', 'sales_coordinator', 'cicm',
                ];
            } else {
                $roles = [$request->recipient_role];
            }
        } else {
            return response()->json(['error' => 'Please provide recipient_role or recipient_roles'], 422);
        }

        $forbiddenRoles = ['marketing_manager', 'finance_chief'];
        $roles          = array_diff($roles, $forbiddenRoles);

        if (empty($roles)) {
            return response()->json(['error' => 'No valid recipient roles selected'], 422);
        }

        $recipientCount = 0;
        foreach ($roles as $role) {
            $count = User::whereHas('role', fn($q) => $q->where('name', $role))->count();
            $recipientCount += $count;
            SendNotificationJob::dispatch($role, $message);
        }

        SentMessage::create([
            'sender_id'       => auth()->id(),
            'recipient_role'  => implode(', ', $roles),
            'message'         => $message,
            'recipient_count' => $recipientCount,
        ]);

        return response()->json([
            'status'           => 'sent',
            'message'          => 'Message sent to ' . count($roles) . ' role(s)',
            'recipient_roles'  => $roles,
            'recipient_count'  => $recipientCount,
            'sent_at'          => now()->toISOString(),
        ]);
    }

    public function getSentMessagesHistory(Request $request)
    {
        $messages = SentMessage::where('sender_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->map(function ($msg) {
                return [
                    'id'              => $msg->id,
                    'recipient_role'  => $msg->recipient_role,
                    'message'         => $msg->message,
                    'recipient_count' => $msg->recipient_count,
                    'sent_at'         => $msg->created_at,
                    'date'            => $msg->created_at->toDateString(),
                    'time'            => $msg->created_at->format('h:i A'),
                ];
            });

        return response()->json([
            'total' => $messages->count(),
            'data'  => $messages,
        ]);
    }

    // ============================================
    // STOCK METHODS
    // ============================================

    /**
     * Get net available stock for a shop manager's own branch.
     * Subtracts only that branch's own pending orders from shop stock.
     * GET /api/sales/available-stock
     */
    public function getAvailableStock(Request $request)
    {
        $location = $request->query('location');

        if (!$location) {
            $userRole = auth()->user()->role->name;
            if ($userRole === 'shop_manager_kabuga') {
                $location = 'kabuga';
            } elseif ($userRole === 'shop_manager_masaka') {
                $location = 'masaka';
            } else {
                $location = 'kabuga';
            }
        }

        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }

        $physicalStock = Stock::with('product')
            ->where('location', $location)
            ->get();

        // Only subtract pending orders for THIS branch's own shop stock
        $pendingRequests = Order::with('items')
            ->where('location', $location)
            ->where('status', 'pending')
            ->get();

        // Debug logging
        Log::info('Available Stock Calculation', [
            'location' => $location,
            'physical_stock_count' => $physicalStock->count(),
            'pending_orders_count' => $pendingRequests->count(),
        ]);

        $availableStock = [];

        foreach ($physicalStock as $stock) {
            $productId    = $stock->product_id;
            $requestedQty = 0;

            foreach ($pendingRequests as $pendingRequest) {
                foreach ($pendingRequest->items as $item) {
                    if ($item->product_id === $productId) {
                        $requestedQty += $item->quantity;
                    }
                }
            }

            $availableStock[] = [
                'id'                 => $stock->id,
                'product_id'         => $productId,
                'product_name'       => $stock->product->name,
                'product_price'      => $stock->product->price,
                'physical_quantity'  => $stock->quantity,
                'requested_quantity' => $requestedQty,
                'available_quantity' => max(0, $stock->quantity - $requestedQty),
                'location'           => $stock->location,
                'unit'               => $stock->unit ?? 'pcs',
            ];
        }

        // Also include products that have pending orders but no stock yet
        $productIdsWithRequests = [];
        foreach ($pendingRequests as $pendingRequest) {
            foreach ($pendingRequest->items as $item) {
                $productIdsWithRequests[$item->product_id] = ($productIdsWithRequests[$item->product_id] ?? 0) + $item->quantity;
            }
        }

        $existingProductIds = collect($availableStock)->pluck('product_id')->toArray();
        $missingProductIds = array_diff(array_keys($productIdsWithRequests), $existingProductIds);

        foreach ($missingProductIds as $productId) {
            /** @var Product|null $product */
            $product = Product::find($productId);
            $requestedQty = $productIdsWithRequests[$productId];
            if ($product instanceof Product) {
                $availableStock[] = [
                    'id'                 => null,
                    'product_id'         => $productId,
                    'product_name'       => $product->name,
                    'product_price'      => $product->price,
                    'physical_quantity'  => 0,
                    'requested_quantity' => $requestedQty,
                    'available_quantity' => 0,
                    'location'           => $location,
                    'unit'               => $product->type === 'unbaked' ? 'kg' : 'pcs',
                ];
            }
        }

        return response()->json([
            'location'        => $location,
            'total_available' => collect($availableStock)->sum('available_quantity'),
            'data'            => $availableStock,
        ]);
    }

    /**
     * Get net available stock at the factory.
     *
     * This subtracts ALL pending orders from ALL branches so every shop manager
     * (and the sales coordinator) sees the same accurate factory stock number.
     *
     * Example:
     *   Factory physical stock: Bread = 50
     *   Kabuga pending order:   Bread = 30
     *   Masaka pending order:   Bread = 10
     *   → available_quantity:   Bread = 10  (for everyone)
     *
     * GET /api/sales/factory-available-stock
     */
    public function getFactoryAvailableStock(Request $request)
    {
        $factoryStock = Stock::with('product')
            ->where('location', 'factory')
            ->get();

        // ✅ KEY FIX: Fetch ALL pending orders regardless of branch
        $allPendingOrders = Order::with('items')
            ->where('status', 'pending')
            ->get();

        // Build a lookup: product_id → total qty requested across all branches
        $requestedByProduct = [];

        foreach ($allPendingOrders as $order) {
            foreach ($order->items as $item) {
                $requestedByProduct[$item->product_id] =
                    ($requestedByProduct[$item->product_id] ?? 0) + $item->quantity;
            }
        }

        // Debug logging to verify
        Log::info('Factory Available Stock Calculation', [
            'pending_orders_count' => $allPendingOrders->count(),
            'requested_by_product' => $requestedByProduct,
            'factory_stock_count' => $factoryStock->count(),
        ]);

        $availableStock = [];

        foreach ($factoryStock as $stock) {
            $productId    = $stock->product_id;
            $requestedQty = $requestedByProduct[$productId] ?? 0;
            $available    = max(0, $stock->quantity - $requestedQty);

            $availableStock[] = [
                'id'                 => $stock->id,
                'product_id'         => $productId,
                'product_name'       => $stock->product->name,
                'product_price'      => $stock->product->price,
                'physical_quantity'  => $stock->quantity,
                'requested_quantity' => $requestedQty,
                'available_quantity' => $available,
                'location'           => $stock->location,
                'unit'               => $stock->unit ?? 'pcs',
                'status'             => $available < 10 ? 'Low Stock' : 'Available',
            ];
        }

        // Also include products that have pending orders but no factory stock yet
        $productIdsWithRequests = array_keys($requestedByProduct);
        $existingProductIds = collect($availableStock)->pluck('product_id')->toArray();
        $missingProductIds = array_diff($productIdsWithRequests, $existingProductIds);

        foreach ($missingProductIds as $productId) {
            /** @var Product|null $product */
            $product = Product::find($productId);
            if ($product instanceof Product) {
                $availableStock[] = [
                    'id'                 => null,
                    'product_id'         => $productId,
                    'product_name'       => $product->name,
                    'product_price'      => $product->price,
                    'physical_quantity'  => 0,
                    'requested_quantity' => $requestedByProduct[$productId],
                    'available_quantity' => 0,
                    'location'           => 'factory',
                    'unit'               => $product->type === 'unbaked' ? 'kg' : 'pcs',
                    'status'             => 'Out of Stock',
                ];
            }
        }

        return response()->json([
            'location'        => 'factory',
            'total_available' => collect($availableStock)->sum('available_quantity'),
            'data'            => $availableStock,
        ]);
    }
}