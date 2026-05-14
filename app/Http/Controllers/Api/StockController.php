<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\CakeOrder;
use App\Models\Production;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * Add stock with automatic categorization
     * 
     * Rules:
     * - Regular item → Stock only
     * - Baked item → Stock + Production
     * - Cake item → Stock + CakeOrder request
     */
    public function addStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'location'   => 'required|in:kabuga,masaka',
            'type'       => 'nullable|in:baked,cake,regular', // Item type
        ]);

        $product = \App\Models\Product::find($validated['product_id']);
        $type = $validated['type'] ?? $product->type ?? 'regular';

        // 1. ADD TO STOCK
        $stock = Stock::firstOrCreate([
            'product_id' => $validated['product_id'],
            'location'   => $validated['location']
        ]);

        $stock->increment('quantity', $validated['quantity']);

        // 2. LOG IN STOCK MOVEMENT (History)
        StockMovement::create([
            'product_id' => $validated['product_id'],
            'type'       => 'in',
            'quantity'   => $validated['quantity'],
            'location'   => $validated['location'],
            'user_id'    => auth()->id()
        ]);

        // 3. CATEGORIZE BASED ON ITEM TYPE
        if ($type === 'baked') {
            // Add to Production (Baked Products)
            Production::create([
                'product_id' => $validated['product_id'],
                'quantity'   => $validated['quantity'],
                'location'   => $validated['location']
            ]);

            // Notify shop managers
            SendNotificationJob::dispatch(
                'shop_manager_' . $validated['location'],
                "New baked items added: {$product->name} x{$validated['quantity']}"
            );
        } 
        elseif ($type === 'cake') {
            // Create cake order request
            CakeOrder::create([
                'customer_name' => 'Store Item',
                'phone'         => 'N/A',
                'cake_type'     => $product->name,
                'quantity'      => $validated['quantity'],
                'price'         => $product->price,
                'location'      => $validated['location'],
                'delivery_date' => now()->addDays(1),
                'status'        => 'pending'
            ]);

            // Notify store keeper about cake request
            SendNotificationJob::dispatch(
                'store_keeper',
                "New cake item request: {$product->name} x{$validated['quantity']}"
            );
        }

        // 4. LOW STOCK ALERT
        if ($stock->quantity < 10) {
            SendNotificationJob::dispatch(
                'operations_manager',
                "⚠️ Low stock alert: {$product->name} ({$stock->quantity} remaining)"
            );
        }

        return response()->json([
            'status'   => 'success',
            'message'  => "Added {$validated['quantity']} {$product->name} to stock",
            'data'     => $stock,
            'type'     => $type,
            'location' => $validated['location']
        ], 201);
    }

    /**
     * Reduce stock
     */
    public function reduceStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'location'   => 'required|in:kabuga,masaka'
        ]);

        $stock = Stock::where('product_id', $validated['product_id'])
            ->where('location', $validated['location'])
            ->firstOrFail();

        if ($stock->quantity < $validated['quantity']) {
            return response()->json(['error' => 'Not enough stock'], 400);
        }

        $stock->decrement('quantity', $validated['quantity']);

        // Log the movement
        StockMovement::create([
            'product_id' => $validated['product_id'],
            'type'       => 'out',
            'quantity'   => $validated['quantity'],
            'location'   => $validated['location'],
            'user_id'    => auth()->id()
        ]);

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Get stock by location
     */
    public function byLocation($location)
    {
        return Stock::with('product')
            ->where('location', $location)
            ->get();
    }

    /**
     * Get factory stock (baked items)
     */
    public function factoryStock()
    {
        return Stock::with('product')
            ->whereHas('product', function ($q) {
                $q->where('type', 'baked');
            })
            ->get();
    }

    /**
     * Get stock history/movement log
     * 
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getHistory(Request $request)
    {
        $query = StockMovement::with('product', 'user')->latest();

        // Filter by location if provided
        if ($request->has('location')) {
            $query->where('location', $request->location);
        }

        // Filter by product if provided
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Limit results
        $limit = (int) $request->query('limit', 100);

        return $query->take($limit)->get()->map(function ($movement) {
            return [
                'id'          => $movement->id,
                'product'     => optional($movement->product)->name,
                'type'        => $movement->type, // 'in' or 'out'
                'quantity'    => $movement->quantity,
                'location'    => $movement->location,
                'user'        => optional($movement->user)->name,
                'timestamp'   => $movement->created_at->format('Y-m-d H:i:s'),
                'date'        => $movement->created_at->toDateString(),
                'time'        => $movement->created_at->format('H:i A'),
            ];
        });
    }
}