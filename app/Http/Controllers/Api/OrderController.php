<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\Collection;

class OrderController extends Controller
{
    // CREATE ORDER
    // - Gets location from authenticated user's role
    // - Validates requested quantities against the SAME shared factory pool
    //   that getFactoryAvailableStock()/getGlobalAvailableStock() use, locking
    //   the relevant Stock rows for the duration of the check so two branches
    //   submitting at the same moment can't both be approved against the same
    //   units (this is what previously let stock be over-committed and made
    //   one branch's available number disagree with another's).
    // - Creates Order + OrderItems with price snapshot
    // - Notifies store_keeper, sales_coordinator, marketing_manager
    public function store(Request $request)
    {
        $request->validate([
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|exists:products,id',
            'items.*.quantity'       => 'required|integer|min:1',
        ]);

        // Get location from authenticated user's role
        $userRole = auth()->user()->role->name;

        // Determine location based on role
        if ($userRole === 'shop_manager_kabuga') {
            $location = 'kabuga';
        } elseif ($userRole === 'shop_manager_masaka') {
            $location = 'masaka';
        } else {
            return response()->json([
                'error' => 'Unauthorized - Invalid shop manager role'
            ], 403);
        }

        $order = DB::transaction(function () use ($request, $location) {
            // Lock the factory stock rows for every requested product first.
            // Any other request trying to order the same product will wait
            // here until this transaction commits or rolls back, so the
            // availability check below can never be checked against a stale
            // number.
            $productIds = collect($request->items)->pluck('product_id')->unique()->values();

            $factoryStock = Stock::where('location', 'factory')
                ->whereIn('product_id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('product_id');

            foreach ($request->items as $item) {
                $productId    = $item['product_id'];
                $requestedQty = $item['quantity'];

                $stockRow    = $factoryStock->get($productId);
                $physicalQty = $stockRow ? $stockRow->quantity : 0;

                // Same "physical - already pending elsewhere" formula used by
                // getFactoryAvailableStock(), so the number we validate against
                // here is always the same number every dashboard is showing.
                $alreadyPending = OrderItem::where('product_id', $productId)
                    ->whereHas('order', fn ($q) => $q->where('status', 'pending'))
                    ->sum('quantity');

                $available = max(0, $physicalQty - $alreadyPending);

                if ($requestedQty > $available) {
                    $product = Product::find($productId);
                    $name    = $product ? $product->name : "product #{$productId}";

                    throw ValidationException::withMessages([
                        'items' => ["Only {$available} unit(s) of {$name} are currently available. Requested: {$requestedQty}."],
                    ]);
                }
            }

            $order = Order::create([
                'user_id'  => auth()->id(),
                'location' => $location,
                'status'   => 'pending',
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $product->price,
                ]);
            }

            return $order;
        });

        SendNotificationJob::dispatch('store_keeper', "New order received ($location)");
        SendNotificationJob::dispatch('sales_coordinator', "New order created");
        SendNotificationJob::dispatch('marketing_manager', "Order created in $location");

        return $order->load('items.product');
    }

    // GET ALL ORDERS BY LOCATION
    public function indexByLocation($location)
    {
        /** @var Collection $orders */
        $orders = Order::with('items.product')
            ->where('location', $location)
            ->latest()
            ->get();

        return $orders->map(function ($order) {
            /** @var Collection $items */
            $items = $order->items;
            
            return [
                'id'           => $order->id,
                'user_id'      => $order->user_id,
                'location'     => $order->location,
                'status'       => $order->status,
                'created_at'   => $order->created_at,
                'updated_at'   => $order->updated_at,
                'items'        => $items->map(function ($item) {
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
                'total_amount' => $items->sum(function ($item) {
                    return $item->quantity * $item->price;
                }),
            ];
        });
    }
}