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
use App\Models\Production;
use App\Models\Revenue;
use App\Models\ShopClosingRecord;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ShopManagerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:shop_manager_kabuga,shop_manager_masaka')->only([
            'storeCakeOrder', 
            'storeCakeRequest',
            'updateCakeOrder', 
            'receiveOrder',
            'recordDamage',
            'storeFeedback',
            'getCakeRequests'
        ]);
    }

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

    // CREATE CAKE ORDER (type = 'order')
    public function storeCakeOrder(Request $request)
    {
        $request->validate([
            'customer_name'        => 'required|string|max:255',
            'phone'                => 'required|string|max:20',
            'cake_type'            => 'required|string|max:255',
            'quantity'             => 'required|integer|min:1',
            'price'                => 'required|numeric|min:0',
            'advance_payment'      => 'nullable|numeric|min:0|max:' . ($request->price ?? 0),
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
                'type'                 => 'order',
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
            'store_keeper',
            'New cake order #' . $cakeOrder->id . ' from ' . $request->location
        );
        SendNotificationJob::dispatch(
            'sales_coordinator',
            'New cake order #' . $cakeOrder->id . ' submitted'
        );

        return response()->json($cakeOrder, 201);
    }

    // CREATE CAKE REQUEST (type = 'request')
    public function storeCakeRequest(Request $request)
    {
        $request->validate([
            'customer_name'        => 'required|string|max:255',
            'phone'                => 'required|string|max:20',
            'cake_type'            => 'required|string|max:255',
            'quantity'             => 'required|integer|min:1',
            'price'                => 'required|numeric|min:0',
            'advance_payment'      => 'nullable|numeric|min:0|max:' . ($request->price ?? 0),
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
                'type'                 => 'request',
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
                    'source'   => 'cake_request_advance',
                    'location' => $request->location,
                ]);
            }

            return $cakeOrder;
        });

        SendNotificationJob::dispatch(
            'store_keeper',
            'New cake request #' . $cakeOrder->id . ' from ' . $request->location
        );
        SendNotificationJob::dispatch(
            'sales_coordinator',
            'New cake request #' . $cakeOrder->id . ' submitted'
        );

        return response()->json($cakeOrder, 201);
    }

    // UPDATE CAKE ORDER
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

    // GET MANAGER'S CAKE ORDERS (branch-scoped, all types)
    public function cakeOrdersLocation()
    {
        $orders = CakeOrder::where('location', $this->myLocation())
            ->latest()
            ->get();
        
        $result = [];
        foreach ($orders as $c) {
            $result[] = array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]);
        }
        
        return response()->json($result);
    }

    // GET CAKE ORDERS BY LOCATION (only type = 'order')
    public function cakeOrdersByLocation($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }
        
        $cakeOrders = CakeOrder::where('location', $location)
            ->where('type', 'order')
            ->latest()
            ->get();
        
        $result = [];
        foreach ($cakeOrders as $cake) {
            $cakeData = $cake->toArray();
            if ($cake->inspo_image_path) {
                $cakeData['inspo_image_url'] = asset('storage/' . $cake->inspo_image_path);
            }
            $result[] = $cakeData;
        }
        
        return response()->json($result);
    }

    // GET ALL CAKE REQUESTS FOR CURRENT MANAGER'S BRANCH
    public function getCakeRequests()
    {
        $myLocation = $this->myLocation();
        
        $cakeRequests = CakeOrder::where('location', $myLocation)
            ->where('type', 'request')
            ->latest()
            ->get()
            ->map(function ($cake) {
                if ($cake->inspo_image_path) {
                    $cake->inspo_image_url = asset('storage/' . $cake->inspo_image_path);
                }
                return $cake;
            });
        
        return response()->json($cakeRequests);
    }

    // GET CAKE REQUESTS BY LOCATION (only type = 'request')
    public function cakeRequestsByLocation($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }
        
        $cakeRequests = CakeOrder::where('location', $location)
            ->where('type', 'request')
            ->latest()
            ->get()
            ->map(function ($cake) {
                if ($cake->inspo_image_path) {
                    $cake->inspo_image_url = asset('storage/' . $cake->inspo_image_path);
                }
                return $cake;
            });
        
        return response()->json($cakeRequests);
    }

    // GET DAMAGES BY LOCATION
    public function damagesByLocation($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }
        
        $damages = Damage::with('product')
            ->where('location', $location)
            ->latest()
            ->get();
        
        return response()->json($damages);
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
    public function recordDamage(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'nullable|string',
            'location'   => 'nullable|string',
        ]);

        $damage = null;

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

    // ============================================
    // ADDITIONAL ENDPOINTS
    // ============================================

    /**
     * Get single order with full details including items
     * GET /api/orders/{id}
     */
    public function getOrderDetails($id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);
        
        $myLocation = $this->myLocation();
        if ($order->location !== $myLocation) {
            return response()->json(['error' => 'Unauthorized to view this order'], 403);
        }
        
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => optional($item->product)->name,
                'product_price' => optional($item->product)->price,
                'quantity' => $item->quantity,
                'unit_price' => $item->price,
                'total' => $item->quantity * $item->price,
            ];
        }
        
        $totalAmount = 0;
        foreach ($order->items as $item) {
            $totalAmount += $item->quantity * $item->price;
        }
        
        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'location' => $order->location,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'requested_by' => optional($order->user)->name,
            'items' => $items,
            'total_amount' => $totalAmount,
        ]);
    }

    /**
     * Get single stock item by ID for shop manager
     * GET /api/shop/stock/{id}
     */
    public function getStockItem($id)
    {
        $stock = Stock::with('product')->findOrFail($id);
        
        $myLocation = $this->myLocation();
        if ($stock->location !== $myLocation) {
            return response()->json(['error' => 'Unauthorized to view this stock'], 403);
        }
        
        return response()->json([
            'id' => $stock->id,
            'product_id' => $stock->product_id,
            'product_name' => optional($stock->product)->name,
            'product_price' => optional($stock->product)->price,
            'product_cost' => optional($stock->product)->cost,
            'product_type' => optional($stock->product)->type,
            'location' => $stock->location,
            'quantity' => $stock->quantity,
            'description' => $stock->description,
            'unit' => $stock->unit,
            'created_at' => $stock->created_at,
            'updated_at' => $stock->updated_at,
        ]);
    }

    /**
     * Update stock quantity for shop manager
     * PUT /api/shop/stock/{id}
     */
    public function updateStockItem(Request $request, $id)
    {
        $stock = Stock::with('product')->findOrFail($id);
        
        $myLocation = $this->myLocation();
        if ($stock->location !== $myLocation) {
            return response()->json(['error' => 'Unauthorized to update this stock'], 403);
        }
        
        $request->validate([
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'unit' => 'nullable|string',
        ]);
        
        $oldQuantity = $stock->quantity;
        $stock->update([
            'quantity' => $request->quantity,
            'description' => $request->description ?? $stock->description,
            'unit' => $request->unit ?? $stock->unit,
        ]);
        
        $difference = $request->quantity - $oldQuantity;
        if ($difference != 0) {
            StockMovement::create([
                'product_id' => $stock->product_id,
                'type' => $difference > 0 ? 'in' : 'out',
                'quantity' => abs($difference),
                'location' => $stock->location,
                'user_id' => auth()->id(),
            ]);
        }
        
        return response()->json([
            'message' => 'Stock updated successfully',
            'stock' => $stock->fresh('product'),
        ]);
    }

    /**
     * Get all feedback for this branch
     * GET /api/shop/feedback
     */
    public function getFeedback(Request $request)
    {
        $myLocation = $this->myLocation();
        
        $query = Feedback::where('location', $myLocation)->latest();
        
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }
        
        $limit = (int) $request->query('limit', 50);
        $feedback = $query->take($limit)->get();
        
        $data = [];
        foreach ($feedback as $item) {
            $data[] = [
                'id' => $item->id,
                'customer_name' => $item->customer_name,
                'message' => $item->message,
                'rating' => $item->rating,
                'location' => $item->location,
                'created_at' => $item->created_at,
                'date' => $item->created_at->toDateString(),
                'time' => $item->created_at->format('h:i A'),
            ];
        }
        
        return response()->json([
            'total' => count($feedback),
            'average_rating' => $feedback->avg('rating'),
            'data' => $data,
        ]);
    }

    /**
     * Get all cake orders with filtering options (type = 'order')
     * GET /api/shop/cake-orders (with query params)
     */
    public function getAllCakeOrders(Request $request)
    {
        $myLocation = $this->myLocation();
        
        $query = CakeOrder::where('location', $myLocation)
            ->where('type', 'order')
            ->latest();
        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('date_from')) {
            $query->whereDate('delivery_date', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('delivery_date', '<=', $request->date_to);
        }
        
        $limit = (int) $request->query('limit', 100);
        $orders = $query->take($limit)->get();
        
        $result = [];
        foreach ($orders as $order) {
            $orderData = $order->toArray();
            if ($order->inspo_image_path) {
                $orderData['inspo_image_url'] = asset('storage/' . $order->inspo_image_path);
            }
            $result[] = $orderData;
        }
        
        return response()->json([
            'total' => $orders->count(),
            'data' => $result,
        ]);
    }

    /**
     * Update order status (pending → dispatched → received)
     * PUT /api/orders/{id}/status
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,dispatched,received,delivered,cancelled',
        ]);
        
        $order = Order::where('location', $this->myLocation())->findOrFail($id);
        
        $oldStatus = $order->status;
        $order->update(['status' => $request->status]);
        
        SendNotificationJob::dispatch(
            'store_keeper',
            "Order #{$id} status changed from {$oldStatus} to {$request->status}"
        );
        
        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->fresh('items.product'),
        ]);
    }

    /**
     * Get dashboard summary for shop manager
     * GET /api/shop/dashboard
     */
    public function getDashboardSummary()
    {
        $myLocation = $this->myLocation();
        
        $pendingOrders = Order::where('location', $myLocation)
            ->where('status', 'pending')
            ->count();
        
        $completedOrders = Order::where('location', $myLocation)
            ->where('status', 'received')
            ->count();
        
        $totalStock = Stock::where('location', $myLocation)->sum('quantity');
        
        $pendingCakeOrders = CakeOrder::where('location', $myLocation)
            ->where('type', 'order')
            ->where('status', 'pending')
            ->count();
        
        $totalDamages = Damage::where('location', $myLocation)->sum('quantity');
        
        $totalRevenue = Revenue::where('location', $myLocation)->sum('amount');
        
        return response()->json([
            'pending_orders' => $pendingOrders,
            'completed_orders' => $completedOrders,
            'total_stock_items' => $totalStock,
            'pending_cake_orders' => $pendingCakeOrders,
            'total_damages' => $totalDamages,
            'total_revenue' => $totalRevenue,
        ]);
    }

    /**
     * Get orders for the current manager's branch
     * GET /api/my-orders
     */
    public function myOrders(Request $request)
    {
        $myLocation = $this->myLocation();
        
        $orders = Order::with('items.product')
            ->where('location', $myLocation)
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'location' => $order->location,
                    'created_at' => $order->created_at,
                    'items_count' => $order->items->count(),
                    'total_amount' => $order->items->sum(function ($item) {
                        return $item->quantity * $item->price;
                    }),
                ];
            });
        
        return response()->json($orders);
    }

    // ============================================
    // CLOSING DAY & STOCK METHODS
    // ============================================

    /**
     * Get current stock for a branch (for closing day)
     * GET /api/shop/current-stock/{location}
     */
    public function getCurrentStock($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }

        // Check if location matches manager's role
        if ($this->myLocation() !== $location) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $stock = Stock::with('product')
            ->where('location', $location)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit ?? 'pcs',
                    'location' => $item->location,
                ];
            });

        return response()->json([
            'location' => $location,
            'date' => now()->toDateString(),
            'opening_stock' => $stock,
        ]);
    }

    /**
     * Close the day by recording remaining, damaged, and expired stock
     * POST /api/shop/close-day
     */
    public function closeDay(Request $request)
    {
        $myLocation = $this->myLocation();

        $request->validate([
            'closing_date' => 'required|date',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.remaining' => 'required|integer|min:0',
            'products.*.damaged' => 'nullable|integer|min:0',
            'products.*.expired' => 'nullable|integer|min:0',
        ]);

        $closingDate = $request->closing_date;

        // Check if already closed for this date
        $existing = ShopClosingRecord::where('location', $myLocation)
            ->where('closing_date', $closingDate)
            ->first();

        if ($existing) {
            return response()->json(['error' => 'Already closed for this date'], 400);
        }

        // Get current stock (opening stock for the day)
        $currentStock = Stock::with('product')
            ->where('location', $myLocation)
            ->get()
            ->keyBy('product_id');

        $productsData = [];
        $summary = [
            'total_sold' => 0,
            'total_damaged' => 0,
            'total_expired' => 0,
            'total_remaining' => 0,
            'total_products' => 0,
        ];

        DB::transaction(function () use ($request, $myLocation, $closingDate, $currentStock, &$productsData, &$summary) {
            foreach ($request->products as $productData) {
                $productId = $productData['product_id'];
                $stock = $currentStock[$productId] ?? null;

                if (!$stock) {
                    continue;
                }

                $product = $stock->product;
                $openingStock = $stock->quantity;
                $remaining = $productData['remaining'];
                $damaged = $productData['damaged'] ?? 0;
                $expired = $productData['expired'] ?? 0;

                // Validate remaining doesn't exceed opening stock
                if ($remaining > $openingStock) {
                    throw new \Exception("Remaining quantity for {$product->name} cannot exceed opening stock");
                }

                // Calculate sold
                $sold = $openingStock - $remaining - $damaged - $expired;

                if ($sold < 0) {
                    throw new \Exception("Invalid calculation for {$product->name}: Sold cannot be negative");
                }

                // Record damage and expired as separate entries
                if ($damaged > 0) {
                    Damage::create([
                        'product_id' => $productId,
                        'quantity' => $damaged,
                        'reason' => 'End of day damage',
                        'location' => $myLocation,
                    ]);
                }

                if ($expired > 0) {
                    Damage::create([
                        'product_id' => $productId,
                        'quantity' => $expired,
                        'reason' => 'Expired',
                        'location' => $myLocation,
                    ]);
                }

                // Record revenue for sold items
                if ($sold > 0) {
                    Revenue::create([
                        'amount' => $sold * $product->price,
                        'source' => 'end_of_day_sales',
                        'location' => $myLocation,
                    ]);
                }

                // Update stock to remaining quantity for next day
                $stock->update(['quantity' => $remaining]);

                StockMovement::create([
                    'product_id' => $productId,
                    'type' => 'out',
                    'quantity' => $sold + $damaged + $expired,
                    'location' => $myLocation,
                    'user_id' => auth()->id(),
                    'note' => 'End of day adjustment',
                ]);

                $productsData[] = [
                    'product_id' => $productId,
                    'product_name' => $product->name,
                    'opening_stock' => $openingStock,
                    'remaining' => $remaining,
                    'damaged' => $damaged,
                    'expired' => $expired,
                    'sold' => $sold,
                    'unit' => $stock->unit ?? 'pcs',
                ];

                $summary['total_sold'] += $sold;
                $summary['total_damaged'] += $damaged;
                $summary['total_expired'] += $expired;
                $summary['total_remaining'] += $remaining;
                $summary['total_products']++;
            }

            // Create closing record
            ShopClosingRecord::create([
                'shop_manager_id' => auth()->id(),
                'location' => $myLocation,
                'closing_date' => $closingDate,
                'products' => $productsData,
                'summary' => $summary,
            ]);
        });

        return response()->json([
            'message' => 'Day closed successfully',
            'closing_record' => [
                'location' => $myLocation,
                'closing_date' => $closingDate,
                'products' => $productsData,
                'summary' => $summary,
            ],
        ], 201);
    }

    /**
     * Get latest closing record for a branch
     * GET /api/shop/close-day/{location}/latest
     */
    public function getLatestClosingRecord($location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }

        $record = ShopClosingRecord::with('shopManager')
            ->where('location', $location)
            ->latest('closing_date')
            ->first();

        if (!$record) {
            return response()->json(['error' => "No closing record found for {$location}"], 404);
        }

        return response()->json([
            'id' => $record->id,
            'closing_date' => $record->closing_date,
            'location' => $record->location,
            'products' => $record->products,
            'summary' => $record->summary,
            'closed_at' => $record->created_at,
            'closed_by' => $record->shopManager->name,
        ]);
    }

    /**
     * Get closing day report for a branch
     * GET /api/shop/close-day-report/{location}
     */
    public function getClosingReport(Request $request, $location)
    {
        if (!in_array($location, ['kabuga', 'masaka'])) {
            return response()->json(['error' => 'Invalid location'], 400);
        }

        $date = $request->query('date');

        $query = ShopClosingRecord::where('location', $location);

        if ($date) {
            $query->where('closing_date', $date);
        } else {
            $query->latest('closing_date');
        }

        $record = $query->first();

        if (!$record) {
            return response()->json(['error' => "No closing record found for {$location}"], 404);
        }

        $productsWithRevenue = collect($record->products)->map(function ($product) {
            $productModel = Product::find($product['product_id']);
            return [
                'product_id' => $product['product_id'],
                'product_name' => $product['product_name'],
                'opening_stock' => $product['opening_stock'],
                'sold' => $product['sold'],
                'damaged' => $product['damaged'],
                'expired' => $product['expired'],
                'remaining' => $product['remaining'],
                'revenue' => $product['sold'] * ($productModel->price ?? 0),
                'loss_value' => ($product['damaged'] + $product['expired']) * ($productModel->cost ?? 0),
                'unit' => $product['unit'],
            ];
        });

        return response()->json([
            'location' => $location,
            'report_date' => $record->closing_date,
            'products' => $productsWithRevenue,
            'summary' => [
                'total_revenue' => $productsWithRevenue->sum('revenue'),
                'total_loss' => $productsWithRevenue->sum('loss_value'),
                'total_sold' => $record->summary['total_sold'],
                'total_damaged' => $record->summary['total_damaged'],
                'total_expired' => $record->summary['total_expired'],
                'total_remaining' => $record->summary['total_remaining'],
            ],
        ]);
    }

    /**
     * Get baked items (production log) for shop manager
     * GET /api/shop/baked-items
     */
    public function getBakedItems()
    {
        $productions = Production::with('product')
            ->whereHas('product', function ($query) {
                $query->where('type', 'baked');
            })
            ->latest()
            ->get()
            ->map(function ($production) {
                return [
                    'id' => $production->id,
                    'product_id' => $production->product_id,
                    'product_name' => $production->product->name,
                    'product_price' => $production->product->price,
                    'quantity' => $production->quantity,
                    'unit' => $production->product->type === 'unbaked' ? 'kg' : 'pcs',
                    'location' => $production->location,
                    'baked_at' => $production->created_at->toDateTimeString(),
                    'time' => $production->created_at->format('h:i A'),
                    'date' => $production->created_at->toDateString(),
                ];
            });
        
        return response()->json($productions);
    }
}