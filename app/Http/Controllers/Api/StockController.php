<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function addStock(Request $request)
    {
        $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'location' => 'required|in:kabuga,masaka'
    ]);
        $stock = Stock::firstOrCreate([
            'product_id' => $validated['product_id'],
            'location' => $validated['location']
        ]);

        $stock->increment('quantity', $validated['quantity']);

        StockMovement::create([
            'product_id' => $validated['product_id'],
            'type' => 'in',
            'quantity' => $validated['quantity'],
            'location' => $validated['location'],
            'user_id' => auth()->id()
        ]);

            // 🔔 LOW STOCK ALERT
        if ($stock->quantity < 10) {
            SendNotificationJob::dispatch('operations_manager', "Low stock alert");
        }
    

        return response()->json([
            'status' => 'success',
            'data' => $stock
        ]);
    }

    public function reduceStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'location' => 'required|in:kabuga,masaka'
        ]);

        $stock = Stock::where('product_id', $validated['product_id'])
            ->where('location', $validated['location'])
            ->firstOrFail();

        if ($stock->quantity < $validated['quantity']) {
            return response()->json(['error' => 'Not enough stock'], 400);
        }

        $stock->decrement('quantity', $validated['quantity']);
        StockMovement::create([
            'product_id' => $validated['product_id'],
            'type' => 'out',
            'quantity' => $validated['quantity'],
            'location' => $validated['location'],
            'user_id' => auth()->id()
        ]);

        return response()->json(['status' => 'success']);
    }
}
