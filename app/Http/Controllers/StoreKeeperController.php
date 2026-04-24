<?php

namespace App\Http\Controllers;

use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Stock;
use Illuminate\Http\Request;

class StoreKeeperController extends Controller
{
    // ADD STOCK
    public function store(Request $request)
    {
        $stock = Stock::firstOrCreate([
            'product_id' => $request->product_id,
            'location' => $request->location
        ]);

        $stock->increment('quantity', $request->quantity);

        return $stock;
    }

    // UPDATE STOCK COUNT
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update(['quantity' => $request->quantity]);

        return $stock;
    }

    // DELIVERY
    public function storeDelivery(Request $request)
    {
        return Delivery::create($request->all());
    }

    // DAMAGE
    public function storeDamage(Request $request)
    {
        return Damage::create($request->all());
    }

    // VIEW STOCK
    public function index()
    {
        return Stock::with('product')->get();
    }
}
