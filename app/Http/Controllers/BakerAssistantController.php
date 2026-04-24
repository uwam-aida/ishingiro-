<?php

namespace App\Http\Controllers;

use App\Models\Damage;
use App\Models\Ingredient;
use App\Models\Production;
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
        return Production::create($request->all());
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
