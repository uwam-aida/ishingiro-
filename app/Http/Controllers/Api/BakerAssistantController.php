<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\Damage;
use App\Models\Ingredient;
use App\Models\Production;
use App\Services\NotificationService;
use Illuminate\Http\Request;


class BakerAssistantController extends Controller
{
    // RECORD INGREDIENT USAGE
    public function storeIngredient(Request $request)
    {
        return Ingredient::create($request->all());
    }

    // RECORD PRODUCTION
    public function storeProduction(Request $request)
    {
        $validated = $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'location' => 'required|in:kabuga,masaka'
    ]);

        $production = Production::create($validated);
        

        // Use job queue
        SendNotificationJob::dispatch('shop_manager_kabuga', "New baked products available");
        SendNotificationJob::dispatch('shop_manager_masaka', "New baked products available");

        return $production;

    }

    // DAMAGE
    public function storeDamage(Request $request)
    {
        return Damage::create($request->all());
    }

    // CHECK STOCK (READ)
    public function index()
    {
        return Ingredient::all();
    }
}
