<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Distribution;
use App\Models\Order;
use App\Models\Production;
use App\Models\Revenue;
use App\Models\Stock;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // ── HELPERS ───────────────────────────────────────────────────────────────

    private function applyDateFilters($query, Request $request, string $column = 'created_at')
    {
        if ($start = $request->query('start_date')) {
            $query->whereDate($column, '>=', $start);
        }
        if ($end = $request->query('end_date')) {
            $query->whereDate($column, '<=', $end);
        }

        return $query;
    }

    // ── COMBINED SYSTEM-WIDE SUMMARY ──────────────────────────────────────────
    // Supports: ?start_date=  ?end_date=
    public function combined(Request $request)
    {
        $baked     = $this->applyDateFilters(Production::query(), $request)->sum('quantity');
        $damage    = $this->applyDateFilters(Damage::query(), $request)->sum('quantity');
        $delivered = $this->applyDateFilters(Delivery::query(), $request)->sum('quantity');

        return [
            'baked'              => $baked,
            'damage'             => $damage,
            'delivered'          => $delivered,
            'rest_products'      => $baked - $damage - $delivered,
            'orders'             => $this->applyDateFilters(Order::query(), $request)->count(),
            'shop_stock'         => Stock::sum('quantity'),
            'active_cake_orders' => CakeOrder::where('status', 'pending')->count(),
        ];
    }

    // ── BRANCH-LEVEL SUMMARY ──────────────────────────────────────────────────
    // Supports: ?start_date=  ?end_date=
    public function byLocation(Request $request, $location)
    {
        $baked     = $this->applyDateFilters(Production::where('location', $location), $request)->sum('quantity');
        $damage    = $this->applyDateFilters(Damage::where('location', $location), $request)->sum('quantity');
        $delivered = $this->applyDateFilters(Delivery::where('to_location', $location), $request)->sum('quantity');

        return [
            'location'           => $location,
            'baked'              => $baked,
            'damage'             => $damage,
            'delivered'          => $delivered,
            'rest_products'      => $baked - $damage - $delivered,
            'orders'             => $this->applyDateFilters(Order::where('location', $location), $request)->count(),
            'shop_stock'         => Stock::where('location', $location)->sum('quantity'),
            'active_cake_orders' => CakeOrder::where('location', $location)->where('status', 'pending')->count(),
        ];
    }

    // ── DETAILED RAW REPORT ───────────────────────────────────────────────────
    // Supports: ?start_date=  ?end_date=  ?branch=
    // Includes product names via eager loading, plus shop_stock & rest_products arrays
    public function detailed(Request $request)
    {
        $branch = $request->query('branch');

        $productionsQ = Production::with('product');
        $damagesQ     = Damage::with('product');
        $deliveriesQ  = Delivery::with('product');
        $ordersQ      = Order::with('items.product');

        if ($branch) {
            $productionsQ->where('location', $branch);
            $damagesQ->where('location', $branch);
            $deliveriesQ->where('to_location', $branch);
            $ordersQ->where('location', $branch);
        }

        $this->applyDateFilters($productionsQ, $request);
        $this->applyDateFilters($damagesQ, $request);
        $this->applyDateFilters($deliveriesQ, $request);
        $this->applyDateFilters($ordersQ, $request);

        $productions = $productionsQ->get();
        $damages     = $damagesQ->get();
        $delivered   = $deliveriesQ->get();

        // rest_products per item: baked - damaged - delivered
        $bakedQty     = $productions->sum('quantity');
        $damagedQty   = $damages->sum('quantity');
        $deliveredQty = $delivered->sum('quantity');

        $shopStockQ = Stock::with('product');
        if ($branch) {
            $shopStockQ->where('location', $branch);
        }
        $shopStock = $shopStockQ->get();

        return [
            'productions'   => $productions,
            'damages'       => $damages,
            'deliveries'    => $delivered,
            'orders'        => $ordersQ->get(),
            'shop_stock'    => $shopStock,
            'rest_products' => [
                'baked'     => $bakedQty,
                'damaged'   => $damagedQty,
                'delivered' => $deliveredQty,
                'remaining' => $bakedQty - $damagedQty - $deliveredQty,
            ],
        ];
    }

    // ── GROUPED REVENUE REPORT ────────────────────────────────────────────────
    // Supports: ?date=  ?branch=  ?start_date=  ?end_date=
    public function revenue(Request $request)
    {
        $date   = $request->query('date');
        $branch = $request->query('branch', 'all');

        $query = Revenue::query();

        if ($date) {
            $query->whereDate('created_at', $date);
        }

        $this->applyDateFilters($query, $request);

        if ($branch !== 'all') {
            $query->where('location', $branch);
        }

        $revenues   = $query->get();
        $grandTotal = $revenues->sum('amount');

        $categories = $revenues->groupBy('source')->map(function ($items) {
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