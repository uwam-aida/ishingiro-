<?php

namespace App\Http\Controllers;

use App\Models\CakeOrder;
use App\Models\Stock;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function storeCakeOrder(Request $request, NotificationService $notify)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'date' => 'required|date'
        ]);

        $order = CakeOrder::create($request->all());

        $notify->sendToRole('shop_manager_kabuga', "New cake order");
        $notify->sendToRole('shop_manager_masaka', "New cake order");

        return $order;
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
