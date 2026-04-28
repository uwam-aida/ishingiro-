<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Revenue;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    // RECORD REVENUE
    public function store(Request $request)
    {
        return Revenue::create($request->all());
    }

    // UPDATE PRODUCT PRICE
    public function updatePrice(Request $request, Product $product)
    {
        $product->update([
            'price' => $request->price
        ]);

        return $product;
    }

    // REPORT
    public function index()
    {
        return [
            'revenue' => Revenue::sum('amount'),
            'orders' => Order::count()
        ];
    }
}
