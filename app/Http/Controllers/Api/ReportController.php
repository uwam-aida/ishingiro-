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
use App\Models\ShopClosingRecord;
use App\Models\Stock;
use App\Models\Product;
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
    // Damages now include reported_by (the user who recorded the damage)
    public function detailed(Request $request)
    {
        $branch = $request->query('branch');

        $productionsQ = Production::with('product');
        $damagesQ     = Damage::with('product', 'user');  // load user for reported_by
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

        $bakedQty     = $productions->sum('quantity');
        $damagedQty   = $damages->sum('quantity');
        $deliveredQty = $delivered->sum('quantity');

        $shopStockQ = Stock::with('product');
        if ($branch) {
            $shopStockQ->where('location', $branch);
        }
        $shopStock = $shopStockQ->get();

        // Map damages to include reported_by
        $damagesMapped = $damages->map(fn($d) => [
            'id'          => $d->id,
            'product_id'  => $d->product_id,
            'product'     => optional($d->product)->name,
            'quantity'    => $d->quantity,
            'reason'      => $d->reason,
            'location'    => $d->location,
            'reported_by' => optional($d->user)->name ?? 'Unknown',
            'created_at'  => $d->created_at,
            'updated_at'  => $d->updated_at,
        ]);

        return [
            'productions'   => $productions,
            'damages'       => $damagesMapped,
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

    /**
     * GET /api/reports/close-day?date=YYYY-MM-DD&branch=kabuga|masaka
     *
     * Returns for each product: delivered_qty, remaining_qty, damaged_qty,
     * expired_qty, distributed_qty, unit_price, sold_qty, revenue.
     * Damages include reported_by.
     */
    public function closeDayReport(Request $request)
    {
        $date   = $request->query('date');
        $branch = $request->query('branch');

        if (!$date || !$branch) {
            return response()->json([
                'error' => 'Missing required parameters: date and branch are required',
            ], 422);
        }

        if (!in_array($branch, ['kabuga', 'masaka'])) {
            return response()->json([
                'error' => 'Invalid branch. Must be kabuga or masaka',
            ], 422);
        }

        $startOfDay = date('Y-m-d 00:00:00', strtotime($date));
        $endOfDay   = date('Y-m-d 23:59:59', strtotime($date));

        $products = Product::where('type', 'baked')->get();

        $deliveries = Delivery::with('product')
            ->where('to_location', $branch)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        $closingRecord = ShopClosingRecord::where('location', $branch)
            ->where('closing_date', $date)
            ->first();

        // Load user on damages so we can include reported_by
        $damages = Damage::with('product', 'user')
            ->where('location', $branch)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        $distributions = Distribution::with('product')
            ->where('location', $branch)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        // Build lookup arrays
        $deliveredByProduct = [];
        foreach ($deliveries as $delivery) {
            $pid = $delivery->product_id;
            $deliveredByProduct[$pid] = ($deliveredByProduct[$pid] ?? 0) + $delivery->quantity;
        }

        $damagedByProduct    = [];
        $damageDetailsByProduct = [];
        foreach ($damages as $damage) {
            $pid = $damage->product_id;
            $damagedByProduct[$pid] = ($damagedByProduct[$pid] ?? 0) + $damage->quantity;
            // Collect individual damage entries with reporter
            $damageDetailsByProduct[$pid][] = [
                'quantity'    => $damage->quantity,
                'reason'      => $damage->reason,
                'reported_by' => optional($damage->user)->name ?? 'Unknown',
                'created_at'  => $damage->created_at,
            ];
        }

        $distributedByProduct = [];
        foreach ($distributions as $distribution) {
            $pid = $distribution->product_id;
            $distributedByProduct[$pid] = ($distributedByProduct[$pid] ?? 0) + $distribution->quantity;
        }

        $remainingByProduct = [];
        $expiredByProduct   = [];
        if ($closingRecord && $closingRecord->products) {
            foreach ($closingRecord->products as $productData) {
                $pid = $productData['product_id'];
                $remainingByProduct[$pid] = $productData['remaining'] ?? 0;
                $expiredByProduct[$pid]   = $productData['expired'] ?? 0;
            }
        }

        $result     = [];
        $grandTotal = 0;

        foreach ($products as $product) {
            $pid              = $product->id;
            $deliveredQty     = $deliveredByProduct[$pid] ?? 0;
            $remainingQty     = $remainingByProduct[$pid] ?? 0;
            $damagedQty       = $damagedByProduct[$pid] ?? 0;
            $expiredQty       = $expiredByProduct[$pid] ?? 0;
            $distributedQty   = $distributedByProduct[$pid] ?? 0;
            $unitPrice        = $product->price;

            $soldQty = max(0, $deliveredQty - ($remainingQty + $damagedQty + $expiredQty + $distributedQty));
            $revenue = $soldQty * $unitPrice;
            $grandTotal += $revenue;

            $result[] = [
                'product_name'    => $product->name,
                'product_id'      => $pid,
                'delivered_qty'   => $deliveredQty,
                'remaining_qty'   => $remainingQty,
                'damaged_qty'     => $damagedQty,
                'expired_qty'     => $expiredQty,
                'distributed_qty' => $distributedQty,
                'unit_price'      => $unitPrice,
                'sold_qty'        => $soldQty,
                'revenue'         => $revenue,
                // Damage breakdown with reported_by per entry
                'damage_details'  => $damageDetailsByProduct[$pid] ?? [],
            ];
        }

        // Filter out products with all zeros
        $result = array_values(array_filter($result, function ($item) {
            return $item['delivered_qty'] > 0
                || $item['remaining_qty'] > 0
                || $item['damaged_qty'] > 0
                || $item['distributed_qty'] > 0
                || $item['sold_qty'] > 0;
        }));

        return response()->json([
            'date'        => $date,
            'branch'      => $branch,
            'grand_total' => $grandTotal,
            'products'    => $result,
        ]);
    }
}