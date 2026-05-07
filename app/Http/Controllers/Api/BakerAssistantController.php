<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Damage;
use App\Models\Ingredient;
use App\Models\Production;
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

        SendNotificationJob::dispatch('shop_manager_kabuga', 'New baked products available');
        SendNotificationJob::dispatch('shop_manager_masaka', 'New baked products available');

        return $production;
    }

    // DAMAGE HISTORY
    public function damageHistory()
    {
        return Damage::with('product')->latest()->get();
    }

    // RECORD DAMAGE
    public function storeDamage(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'nullable|string',
            'location'   => 'nullable|string',
        ]);

        return Damage::create($request->all());
    }
}