<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Distribution;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Production;
use App\Models\Stock;
use Illuminate\Http\Request;

class OperationsController extends Controller
{
    // DASHBOARD SUMMARY
    public function summary()
    {
        return [
            'measured'     => Ingredient::count(),
            'baked'        => Production::sum('quantity'),
            'distribution' => Distribution::count(),
            'delivered'    => Delivery::sum('quantity'),
            'orders'       => Order::count(),
            'damaged'      => Damage::sum('quantity'),
        ];
    }

    // DASHBOARD DETAILS
    public function details()
    {
        return [
            'measured'     => Ingredient::all(),
            'baked'        => Production::with('product')->latest()->get(),
            'distribution' => Distribution::with('product')->latest()->get(),
            'delivered'    => Delivery::with('product')->latest()->get(),
            'orders'       => Order::with('items.product')->latest()->get(),
            'damaged'      => Damage::with('product')->latest()->get(),
        ];
    }

    // STOCK
    public function updateStock(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->only(['quantity', 'description', 'unit']));

        return $stock;
    }

    public function deleteStock($id)
    {
        Stock::findOrFail($id)->delete();

        return response()->noContent();
    }

    // PRODUCTION
    public function updateProduction(Request $request, $id)
    {
        $production = Production::findOrFail($id);
        $production->update($request->only(['quantity', 'location']));

        return $production;
    }

    public function deleteProduction($id)
    {
        Production::findOrFail($id)->delete();

        return response()->noContent();
    }

    // DISTRIBUTION
    public function getDistribution()
    {
        return Distribution::with('product')
            ->latest()
            ->get()
            ->each(function ($d) {
                $d->time = $d->created_at->format('h:i A');
                $d->date = $d->created_at->toDateString();
            });
    }

    public function updateDistribution(Request $request, $id)
    {
        $distribution = Distribution::findOrFail($id);
        $distribution->update($request->only(['quantity', 'category', 'location', 'notes']));

        return $distribution;
    }

    public function deleteDistribution($id)
    {
        Distribution::findOrFail($id)->delete();

        return response()->noContent();
    }

    // DELIVERY
    public function updateDelivery(Request $request, $id)
    {
        $delivery = Delivery::findOrFail($id);
        $delivery->update($request->only(['quantity', 'from_location', 'to_location']));

        return $delivery;
    }

    public function deleteDelivery($id)
    {
        Delivery::findOrFail($id)->delete();

        return response()->noContent();
    }

    // ORDERS
    public function updateOrder(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->only(['status']));

        return $order;
    }

    public function deleteOrder($id)
    {
        Order::findOrFail($id)->delete();

        return response()->noContent();
    }

    // DAMAGE
    public function deleteDamage($id)
    {
        Damage::findOrFail($id)->delete();

        return response()->noContent();
    }
}