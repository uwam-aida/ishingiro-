<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Production;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    // ADD STOCK
    // - type = baked  → also creates Production record
    // - Always logs StockMovement (in)
    // - Low-stock alert if qty < 10
    public function addStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'location'   => 'required|in:kabuga,masaka,factory',
            'type'       => 'nullable|in:baked,regular',
        ]);

        $product = \App\Models\Product::findOrFail($validated['product_id']);
        $type    = $validated['type'] ?? $product->type ?? 'regular';

        $stock = DB::transaction(function () use ($validated, $type) {
            $stock = Stock::firstOrCreate([
                'product_id' => $validated['product_id'],
                'location'   => $validated['location'],
            ]);

            $stock->increment('quantity', $validated['quantity']);

            StockMovement::create([
                'product_id' => $validated['product_id'],
                'type'       => 'in',
                'quantity'   => $validated['quantity'],
                'location'   => $validated['location'],
                'user_id'    => auth()->id(),
            ]);

            if ($type === 'baked') {
                Production::create([
                    'product_id' => $validated['product_id'],
                    'quantity'   => $validated['quantity'],
                    'location'   => $validated['location'],
                ]);
            }

            return $stock;
        });

        if ($stock->quantity < 10) {
            SendNotificationJob::dispatch(
                'operations_manager',
                "Low stock: {$product->name} ({$stock->quantity} units at {$validated['location']})"
            );
        }

        return response()->json([
            'status'   => 'success',
            'message'  => "Added {$validated['quantity']} {$product->name} to {$validated['location']}",
            'data'     => $stock->load('product'),
            'type'     => $type,
        ], 201);
    }

    // REDUCE STOCK
    // - Validates sufficient quantity
    // - Logs StockMovement (out)
    public function reduceStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'location'   => 'required|in:kabuga,masaka,factory',
        ]);

        $stock = Stock::where('product_id', $validated['product_id'])
            ->where('location', $validated['location'])
            ->firstOrFail();

        if ($stock->quantity < $validated['quantity']) {
            return response()->json(['error' => 'Not enough stock'], 400);
        }

        DB::transaction(function () use ($validated, $stock) {
            $stock->decrement('quantity', $validated['quantity']);

            StockMovement::create([
                'product_id' => $validated['product_id'],
                'type'       => 'out',
                'quantity'   => $validated['quantity'],
                'location'   => $validated['location'],
                'user_id'    => auth()->id(),
            ]);
        });

        return response()->json(['status' => 'success']);
    }

    // GET STOCK BY LOCATION
    public function byLocation($location)
    {
        return Stock::with('product')
            ->where('location', $location)
            ->get();
    }

    // GET FACTORY STOCK (baked products only)
    public function factoryStock()
    {
        return Stock::with('product')
            ->whereHas('product', fn($q) => $q->where('type', 'baked'))
            ->get();
    }

    // GET STOCK MOVEMENT HISTORY
    // Supports: ?location=  ?product_id=  ?type=in|out  ?limit=
    public function getHistory(Request $request)
    {
        $query = StockMovement::with('product', 'user')->latest();

        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $limit = (int) $request->query('limit', 100);

        return $query->take($limit)->get()->map(fn($m) => [
            'id'        => $m->id,
            'product'   => optional($m->product)->name,
            'type'      => $m->type,
            'quantity'  => $m->quantity,
            'location'  => $m->location,
            'user'      => optional($m->user)->name,
            'date'      => $m->created_at->toDateString(),
            'time'      => $m->created_at->format('h:i A'),
            'timestamp' => $m->created_at->format('Y-m-d H:i:s'),
        ]);
    }
}