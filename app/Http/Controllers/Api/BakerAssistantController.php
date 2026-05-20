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
    // - Creates Production record
    // - Adds to factory Stock (location = factory)
    // - Logs StockMovement (type = in)
    // - Notifies both shop managers
    public function storeProduction(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'location'   => 'required|in:kabuga,masaka',
        ]);

        $production = Production::create($validated);

        // Add baked goods to factory stock so StoreKeeper can dispatch them
        $stock = Stock::firstOrCreate([
            'product_id' => $validated['product_id'],
            'location'   => 'factory',
        ]);
        $stock->increment('quantity', $validated['quantity']);

        // Log the movement
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

    // DAMAGE HISTORY
    public function damageHistory()
    {
        return Damage::with('product')->latest()->get();
    }

    // RECORD DAMAGE
    // - Creates Damage record
    // - Decrements factory stock (baked goods lost before dispatch)
    // - Logs StockMovement (type = out)
    public function storeDamage(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'nullable|string',
            'location'   => 'nullable|string',
        ]);

        $damage = Damage::create($request->all());

        // Decrement stock at the location where damage occurred
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

        // Alert on high damage
        if ($damage->quantity > 20) {
            SendNotificationJob::dispatch('operations_manager', 'High damage reported by baker');
            SendNotificationJob::dispatch('marketing_manager', 'Critical damage alert from production');
        }

        return $damage->load('product');
    }
}