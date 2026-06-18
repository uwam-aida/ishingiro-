<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Damage;
use App\Models\Ingredient;
use App\Models\Production;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class BakerAssistantController extends Controller
{
    // LIST ALL INGREDIENTS
    public function index()
    {
        return Ingredient::all();
    }

    // RECORD INGREDIENT USAGE
    public function storeIngredient(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'quantity' => 'required|integer|min:1',
            'unit'     => 'required|string',
        ]);

        return Ingredient::create($request->all());
    }

    // PRODUCTION HISTORY
    public function productionHistory()
    {
        return Production::with('product')->latest()->get();
    }

    // RECORD PRODUCTION BATCH
    public function storeProduction(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'location'   => 'required|in:kabuga,masaka',
        ]);

        $production = Production::create($validated);

        $stock = Stock::firstOrCreate([
            'product_id' => $validated['product_id'],
            'location'   => 'factory',
        ]);
        $stock->increment('quantity', $validated['quantity']);

        StockMovement::create([
            'product_id' => $validated['product_id'],
            'type'       => 'in',
            'quantity'   => $validated['quantity'],
            'location'   => 'factory',
            'user_id'    => auth()->id(),
        ]);

        SendNotificationJob::dispatch('shop_manager_kabuga', 'New baked products available');
        SendNotificationJob::dispatch('shop_manager_masaka', 'New baked products available');
        SendNotificationJob::dispatch('store_keeper', 'New production batch ready for dispatch');

        return $production->load('product');
    }

    // DAMAGE HISTORY - with reported_by
    public function damageHistory()
    {
        return Damage::with(['product', 'user'])
            ->latest()
            ->get()
            ->map(function ($damage) {
                return [
                    'id'          => $damage->id,
                    'product_id'  => $damage->product_id,
                    'product'     => optional($damage->product)->name,
                    'quantity'    => $damage->quantity,
                    'reason'      => $damage->reason,
                    'location'    => $damage->location,
                    'reported_by' => optional($damage->user)->name ?? 'Unknown',
                    'created_at'  => $damage->created_at,
                    'updated_at'  => $damage->updated_at,
                ];
            });
    }

    // RECORD DAMAGE - with user_id
    public function storeDamage(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'nullable|string',
            'location'   => 'nullable|string',
        ]);

        // ✅ Always save user_id so reported_by works
        $damage = Damage::create([
            'product_id' => $request->product_id,
            'quantity'   => $request->quantity,
            'reason'     => $request->reason,
            'location'   => $request->location ?? 'factory',
            'user_id'    => auth()->id(),  // ✅ THIS SAVES THE REPORTER
        ]);

        $location = $request->location ?? 'factory';
        $stock = Stock::where('product_id', $request->product_id)
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

        if ($damage->quantity > 20) {
            SendNotificationJob::dispatch('operations_manager', 'High damage reported by baker');
            SendNotificationJob::dispatch('marketing_manager', 'Critical damage alert from production');
        }

        // ✅ Return with reported_by
        return $damage->load(['product', 'user']);
    }
}