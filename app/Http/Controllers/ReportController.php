<?php

namespace App\Http\Controllers;

use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\Production;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return [
            'orders' => Order::count(),
            'stock' => Stock::sum('quantity'),
            'production' => Production::sum('quantity'),
            'damages' => Damage::sum('quantity'),
            'deliveries' => Delivery::count()
        ];
    }

    public function combined()
    {
        $baked = Production::sum('quantity');
        $damage = Damage::sum('quantity');
        $delivered = Delivery::sum('quantity');

        $rest = $baked - ($damage + $delivered);

        return response()->json([
            'baked' => $baked,
            'damage' => $damage,
            'delivered' => $delivered,
            'rest_products' => $rest,
            'orders' => Order::count()
        ]);
    }

    //report by location
    public function byLocation($location)
    {
        $baked = Production::where('location', $location)->sum('quantity');
        $damage = Damage::where('location', $location)->sum('quantity');
        $delivered = Delivery::where('to_location', $location)->sum('quantity');

        $rest = $baked - ($damage + $delivered);

        return response()->json([
            'location' => $location,
            'baked' => $baked,
            'damage' => $damage,
            'delivered' => $delivered,
            'rest_products' => $rest,
            'orders' => Order::where('location', $location)->count()
        ]);
    }

    //detailed report
    public function detailed()
    {
        return response()->json([
            'productions' => Production::all(),
            'damages' => Damage::all(),
            'deliveries' => Delivery::all(),
            'orders' => Order::with('items')->get()
        ]);
    }

    
}
