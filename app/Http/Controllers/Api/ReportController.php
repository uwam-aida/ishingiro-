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

    /**
     * Get close day report for inventory-based revenue calculation
     * GET /api/reports/close-day?date=YYYY-MM-DD&branch=kabuga|masaka
     * 
     * Returns for each product: delivered_qty, remaining_qty, damaged_qty, 
     * expired_qty, distributed_qty, unit_price, sold_qty, revenue
     */
    public function closeDayReport(Request $request)
    {
        $date = $request->query('date');
        $branch = $request->query('branch');

        // Validate required parameters
        if (!$date || !$branch) {
            return response()->json([
                'error' => 'Missing required parameters: date and branch are required'
            ], 422);
        }

        if (!in_array($branch, ['kabuga', 'masaka'])) {
            return response()->json([
                'error' => 'Invalid branch. Must be kabuga or masaka'
            ], 422);
        }

        $startOfDay = date('Y-m-d 00:00:00', strtotime($date));
        $endOfDay = date('Y-m-d 23:59:59', strtotime($date));

        // Get all products that are baked (or all products as needed)
        $products = Product::where('type', 'baked')->get();

        // Get deliveries to this branch on the specified date
        $deliveries = Delivery::with('product')
            ->where('to_location', $branch)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        // Get closing record for this branch on this date (if exists)
        $closingRecord = ShopClosingRecord::where('location', $branch)
            ->where('closing_date', $date)
            ->first();

        // Get damages recorded on this date at this branch
        $damages = Damage::with('product')
            ->where('location', $branch)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        // Get distributions on this date from this branch
        $distributions = Distribution::with('product')
            ->where('location', $branch)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        // Build lookup arrays for quick access
        $deliveredByProduct = [];
        foreach ($deliveries as $delivery) {
            $productId = $delivery->product_id;
            $deliveredByProduct[$productId] = ($deliveredByProduct[$productId] ?? 0) + $delivery->quantity;
        }

        $damagedByProduct = [];
        foreach ($damages as $damage) {
            $productId = $damage->product_id;
            $damagedByProduct[$productId] = ($damagedByProduct[$productId] ?? 0) + $damage->quantity;
        }

        $distributedByProduct = [];
        foreach ($distributions as $distribution) {
            $productId = $distribution->product_id;
            $distributedByProduct[$productId] = ($distributedByProduct[$productId] ?? 0) + $distribution->quantity;
        }

        // Get remaining from closing record
        $remainingByProduct = [];
        $expiredByProduct = [];
        if ($closingRecord && $closingRecord->products) {
            foreach ($closingRecord->products as $productData) {
                $productId = $productData['product_id'];
                $remainingByProduct[$productId] = $productData['remaining'] ?? 0;
                $expiredByProduct[$productId] = ($productData['expired'] ?? 0);
            }
        }

        // Build response
        $result = [];
        $grandTotal = 0;

        foreach ($products as $product) {
            $productId = $product->id;
            
            $deliveredQty = $deliveredByProduct[$productId] ?? 0;
            $remainingQty = $remainingByProduct[$productId] ?? 0;
            $damagedQty = $damagedByProduct[$productId] ?? 0;
            $expiredQty = $expiredByProduct[$productId] ?? 0;
            $distributedQty = $distributedByProduct[$productId] ?? 0;
            $unitPrice = $product->price;

            // Formula: sold_qty = delivered_qty - (remaining_qty + damaged_qty + expired_qty + distributed_qty)
            $soldQty = $deliveredQty - ($remainingQty + $damagedQty + $expiredQty + $distributedQty);
            
            // Ensure sold_qty is not negative (can happen if data is inconsistent)
            $soldQty = max(0, $soldQty);
            
            $revenue = $soldQty * $unitPrice;
            $grandTotal += $revenue;

            $result[] = [
                'product_name'    => $product->name,
                'product_id'      => $productId,
                'delivered_qty'   => $deliveredQty,
                'remaining_qty'   => $remainingQty,
                'damaged_qty'     => $damagedQty,
                'expired_qty'     => $expiredQty,
                'distributed_qty' => $distributedQty,
                'unit_price'      => $unitPrice,
                'sold_qty'        => $soldQty,
                'revenue'         => $revenue,
            ];
        }

        // Filter out products with all zeros (optional)
        $result = array_filter($result, function($item) {
            return $item['delivered_qty'] > 0 || 
                   $item['remaining_qty'] > 0 || 
                   $item['damaged_qty'] > 0 || 
                   $item['distributed_qty'] > 0 ||
                   $item['sold_qty'] > 0;
        });

        // Re-index array
        $result = array_values($result);

        return response()->json([
            'date' => $date,
            'branch' => $branch,
            'grand_total' => $grandTotal,
            'products' => $result,
        ]);
    }
}