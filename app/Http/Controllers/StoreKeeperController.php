<?php

namespace App\Http\Controllers;

use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Stock;
use App\Services\NotificationService;
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
    public function storeDamage(Request $request, NotificationService $notify)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1',
            'location' => 'required|string'
        ]);
        $damage = Damage::create($request->all());
        if ($damage->quantity > 20) {
            $notify->sendToRole('operations_manager', "High damage detected");
            $notify->sendToRole('marketing_manager', "Critical damage alert");
        }
        return $damage;
    }

    // VIEW STOCK
    public function index()
    {
        return Stock::with('product')->get();
    }
}
