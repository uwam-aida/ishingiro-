<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Production;
use App\Models\Revenue;
use App\Models\Stock;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // COMBINED SYSTEM-WIDE SUMMARY (6 cards + extra fields)
    public function combined()
    {
        return [
            'baked'             => Production::sum('quantity'),
            'damage'            => Damage::sum('quantity'),
            'delivered'         => Delivery::sum('quantity'),
            'rest_products'     => Production::sum('quantity') - Damage::sum('quantity') - Delivery::sum('quantity'),
            'orders'            => Order::count(),
            'shop_stock'        => Stock::sum('quantity'),
            'active_cake_orders'=> CakeOrder::where('status', 'pending')->count(),
        ];
    }

    // BRANCH-LEVEL SUMMARY
    public function byLocation($location)
    {
        return [
            'location'      => $location,
            'baked'         => Production::where('location', $location)->sum('quantity'),
            'damage'        => Damage::where('location', $location)->sum('quantity'),
            'delivered'     => Delivery::where('to_location', $location)->sum('quantity'),
            'rest_products' => Production::where('location', $location)->sum('quantity')
                             - Damage::where('location', $location)->sum('quantity')
                             - Delivery::where('to_location', $location)->sum('quantity'),
            'orders'        => Order::where('location', $location)->count(),
            'shop_stock'    => Stock::where('location', $location)->sum('quantity'),
            'active_cake_orders' => CakeOrder::where('location', $location)->where('status', 'pending')->count(),
        ];
    }

    // FULL RAW DATA EXPORT
    public function detailed()
    {
        return [
            'productions' => Production::with('product')->get(),
            'damages'     => Damage::with('product')->get(),
            'deliveries'  => Delivery::with('product')->get(),
            'orders'      => Order::with('items.product')->get(),
        ];
    }

    // GROUPED REVENUE REPORT (DB-side math, supports ?date= and ?branch= filters)
    public function revenue(Request $request)
    {
        $date   = $request->query('date');
        $branch = $request->query('branch', 'all');

        $query = Revenue::query();

        if ($date) {
            $query->whereDate('created_at', $date);
        }

        if ($branch !== 'all') {
            $query->where('location', $branch);
        }

        $revenues   = $query->get();
        $grandTotal = $revenues->sum('amount');

        // Group by product category using the product relationship via source field
        // Adjust grouping logic to match your Revenue model's structure
        $categories = $revenues->groupBy('source')->map(function ($items, $source) {
            return $items->map(fn($r) => [
                'item'  => $r->source,
                'total' => $r->amount,
            ])->values();
        });

        return [
            'date'        => $date ?? 'all',
            'branch'      => $branch,
            'grand_total' => $grandTotal,
            'categories'  => $categories,
        ];
    }
}