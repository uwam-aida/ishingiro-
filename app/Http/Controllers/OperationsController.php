<?php

namespace App\Http\Controllers;

use App\Models\Damage;
use App\Models\Production;
use App\Models\Stock;
use Illuminate\Http\Request;

class OperationsController extends Controller
{
    public function index()
    {
        return [
            'stock' => Stock::sum('quantity'),
            'production' => Production::sum('quantity'),
            'damages' => Damage::sum('quantity')
        ];
    }

    public function updateStock(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->all());

        return $stock;
    }

    public function updateProduction(Request $request, $id)
    {
        $production = Production::findOrFail($id);
        $production->update($request->all());

        return $production;
    }
}
