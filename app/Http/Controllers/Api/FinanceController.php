<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Damage;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Production;
use App\Models\Revenue;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    // GRAND TOTAL SUMMARY
    public function index()
    {
        return [
            'revenue' => Revenue::sum('amount'),
            'orders'  => Order::count(),
        ];
    }

    // RECORD REVENUE
    public function store(Request $request)
    {
        $request->validate([
            'amount'   => 'required|numeric|min:0',
            'source'   => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        return Revenue::create($request->all());
    }

    // DAILY REVENUE CHART (Mon–Sun bar chart)
    public function chart()
    {
        return Revenue::selectRaw('DATE(created_at) as day, SUM(amount) as total')
            ->groupBy('day')
            ->orderBy('day')
            ->get();
    }

    // DAMAGE AUDIT LOG
    public function ledger()
    {
        return Damage::with('product')->latest()->get();
    }

    // SALES VS DAMAGE PER PRODUCT (grouped on DB side)
    public function measuredProducts()
    {
        return Product::with(['damages'])
            ->get()
            ->map(function ($product) {
                return [
                    'id'      => $product->id,
                    'name'    => $product->name,
                    'price'   => $product->price,
                    'sold'    => OrderItem::where('product_id', $product->id)->sum('quantity'),
                    'damaged' => $product->damages->sum('quantity'),
                    'branch'  => 'all',
                ];
            });
    }

    // INVENTORY — RAW INGREDIENTS (with financial valuation)
    public function inventoryMeasured()
    {
        return Ingredient::all()->map(function ($ingredient) {
            $value = $ingredient->quantity * 1000; // adjust unit cost as needed

            return [
                'id'     => $ingredient->id,
                'name'   => $ingredient->name,
                'stock'  => $ingredient->quantity . ' ' . $ingredient->unit,
                'status' => $ingredient->quantity > 50 ? 'Healthy' : 'Low',
                'branch' => 'All',
                'value'  => $value,
            ];
        });
    }

    // INVENTORY — BAKED GOODS (daily performance per branch)
    public function inventoryBaked()
    {
        return Product::where('type', 'baked')->get()->map(function ($product) {
            $daily  = Production::where('product_id', $product->id)->sum('quantity');
            $sold   = OrderItem::where('product_id', $product->id)->sum('quantity');
            $loss   = Damage::where('product_id', $product->id)->sum('quantity');

            return [
                'id'     => $product->id,
                'name'   => $product->name,
                'daily'  => $daily . ' pcs',
                'sold'   => (string) $sold,
                'loss'   => (string) $loss,
                'branch' => 'All',
            ];
        });
    }

    // ANALYTICS — TOP KPI CARDS
    public function analyticsSummary()
    {
        $currentRevenue  = Revenue::sum('amount');
        $currentDamage   = Damage::sum('quantity');
        $currentStock    = Stock::sum('quantity');
        $currentProduced = Production::sum('quantity');

        return [
            'sales'      => ['value' => $currentRevenue,  'trend' => '+12%'],
            'production' => ['value' => $currentProduced, 'trend' => 'Stable'],
            'inventory'  => ['value' => $currentStock,    'trend' => '+50'],
            'damage'     => ['value' => $currentDamage,   'trend' => '+2'],
        ];
    }

    // ANALYTICS — PRODUCT PERFORMANCE + RECOMMENDATIONS
    public function analyticsPerformance()
    {
        return Product::all()->map(function ($product) {
            $totalSold  = OrderItem::where('product_id', $product->id)->sum('quantity');
            $stock      = Stock::where('product_id', $product->id)->sum('quantity');
            $damaged    = Damage::where('product_id', $product->id)->sum('quantity');

            // Popularity: ratio of sold to (sold + stock + damaged), scaled 0–100
            $total      = $totalSold + $stock + $damaged;
            $popularity = $total > 0 ? round(($totalSold / $total) * 100) : 0;

            $trend          = $totalSold > 200 ? 'Increasing' : ($totalSold > 50 ? 'Stable' : 'Decreasing');
            $recommendation = match (true) {
                $popularity >= 80  => 'Increase production',
                $popularity >= 50  => 'Maintain current levels',
                $damaged > $totalSold => 'Review quality control',
                default            => 'Consider reducing production',
            };

            return [
                'id'             => $product->id,
                'name'           => $product->name,
                'totalSold'      => $totalSold,
                'stock'          => $stock,
                'damaged'        => $damaged,
                'popularity'     => $popularity,
                'trend'          => $trend,
                'recommendation' => $recommendation,
            ];
        });
    }

    // ANALYTICS — REAL-TIME ACTIVITY LOG (audit trail)
    public function analyticsActivities()
    {
        // Collect production events
        $productions = Production::with(['product', 'user'])->latest()->take(50)->get()
            ->map(fn($p) => [
                'id'       => $p->id,
                'user'     => optional($p->user)->name ?? 'Baker Assistant',
                'role'     => 'Production',
                'category' => 'production',
                'action'   => 'Baked products',
                'item'     => optional($p->product)->name,
                'quantity' => $p->quantity,
                'time'     => $p->created_at->format('g:i A, M j'),
            ]);

        // Collect damage events
        $damages = Damage::with(['product', 'user'])->latest()->take(50)->get()
            ->map(fn($d) => [
                'id'       => $d->id,
                'user'     => optional($d->user)->name ?? 'Staff',
                'role'     => 'Operations',
                'category' => 'damage',
                'action'   => 'Reported damage',
                'item'     => optional($d->product)->name,
                'quantity' => $d->quantity,
                'time'     => $d->created_at->format('g:i A, M j'),
            ]);

        // Merge, sort by time desc, return latest 100
        return $productions->concat($damages)
            ->sortByDesc('time')
            ->values()
            ->take(100);
    }
}