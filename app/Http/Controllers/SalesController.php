<?php

namespace App\Http\Controllers;

use App\Models\CakeOrder;
use App\Models\Stock;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function storeCakeOrder(Request $request)
    {
        return CakeOrder::create($request->all());
    }

    public function index()
    {
        return [
            'cake_orders' => CakeOrder::count(),
            'stock' => Stock::sum('quantity')
        ];
    }

    public function updateTarget(Request $request)
    {
        // optional table: sales_targets
        return response()->json(['message' => 'Target saved']);
    }
}
