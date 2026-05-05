<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Production;
use App\Models\Stock;
use Illuminate\Http\Request;

class OperationsController extends Controller
{
    // DASHBOARD SUMMARY — all 6 category counts
    public function summary()
    {
        return [
            'measured'     => Ingredient::count(),
            'baked'        => Production::sum('quantity'),
            'distribution' => Delivery::count(),
            'delivered'    => Delivery::sum('quantity'),
            'orders'       => Order::count(),
            'damaged'      => Damage::sum('quantity'),
        ];
    }

    // DASHBOARD DETAILS — actual list data for all 6 tables
    public function details()
    {
        return [
            'measured'     => Ingredient::all(),
            'baked'        => Production::with('product')->latest()->get(),
            'distribution' => Delivery::with('product')->latest()->get(),
            'delivered'    => Delivery::with('product')->whereNotNull('to_location')->latest()->get(),
            'orders'       => Order::with('items.product')->latest()->get(),
            'damaged'      => Damage::with('product')->latest()->get(),
        ];
    }

    // UPDATE STOCK
    public function updateStock(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->all());

        return $stock;
    }

    // DELETE STOCK
    public function deleteStock($id)
    {
        Stock::findOrFail($id)->delete();

        return response()->noContent();
    }

    // UPDATE PRODUCTION
    public function updateProduction(Request $request, $id)
    {
        $production = Production::findOrFail($id);
        $production->update($request->all());

        return $production;
    }

    // DELETE PRODUCTION
    public function deleteProduction($id)
    {
        Production::findOrFail($id)->delete();

        return response()->noContent();
    }

    // DELETE DAMAGE
    public function deleteDamage($id)
    {
        Damage::findOrFail($id)->delete();

        return response()->noContent();
    }
}