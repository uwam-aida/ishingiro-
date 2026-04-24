<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function addStock(Request $request)
    {
        $stock = Stock::firstOrCreate([
            'product_id' => $request->product_id,
            'location' => $request->location
        ]);

        $stock->increment('quantity', $request->quantity);

        StockMovement::create([
            'product_id' => $request->product_id,
            'type' => 'in',
            'quantity' => $request->quantity,
            'location' => $request->location,
            'user_id' => auth()->id()
        ]);

    

        return $stock;
    }

    public function reduceStock($productId, $location, $quantity)
    {
        $stock = Stock::where('product_id', $productId)
            ->where('location', $location)
            ->first();

        if ($stock->quantity < $quantity) {
            throw new \Exception("Not enough stock");
        }

        $stock->decrement('quantity', $quantity);

        StockMovement::create([
            'product_id' => $productId,
            'type' => 'out',
            'quantity' => $quantity,
            'location' => $location,
            'user_id' => auth()->id()
        ]);
    }
}
