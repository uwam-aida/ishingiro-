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

    // RECORD REVENUE MANUALLY
    public function store(Request $request)
    {
        $request->validate([
            'amount'   => 'required|numeric|min:0',
            'source'   => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        return Revenue::create($request->all());
    }

    // DAILY REVENUE CHART
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
        return Damage::with('product')
            ->latest()
            ->get()
            ->map(fn($d) => [
                'id'         => $d->id,
                'product'    => optional($d->product)->name,
                'quantity'   => $d->quantity,
                'reason'     => $d->reason,
                'location'   => $d->location,
                'date'       => $d->created_at->toDateString(),
                'created_at' => $d->created_at->toISOString(),
            ]);
    }

    // SALES VS DAMAGE PER PRODUCT
    // Supports: ?start_date=  ?end_date=  ?branch=
    public function measuredProducts(Request $request)
    {
        $start  = $request->query('start_date');
        $end    = $request->query('end_date');
        $branch = $request->query('branch');

        return Product::all()->map(function ($product) use ($start, $end, $branch) {
            $soldQuery   = OrderItem::where('product_id', $product->id);
            $damageQuery = Damage::where('product_id', $product->id);
            $bakedQuery  = Production::where('product_id', $product->id);

            if ($branch) {
                $soldQuery->whereHas('order', fn($q) => $q->where('location', $branch));
                $damageQuery->where('location', $branch);
                $bakedQuery->where('location', $branch);
            }

            if ($start) {
                $soldQuery->whereDate('created_at', '>=', $start);
                $damageQuery->whereDate('created_at', '>=', $start);
                $bakedQuery->whereDate('created_at', '>=', $start);
            }

            if ($end) {
                $soldQuery->whereDate('created_at', '<=', $end);
                $damageQuery->whereDate('created_at', '<=', $end);
                $bakedQuery->whereDate('created_at', '<=', $end);
            }

            $sold       = $soldQuery->sum('quantity');
            $damaged    = $damageQuery->sum('quantity');
            $bakedQty   = $bakedQuery->sum('quantity');
            $damageCost = $damaged * ($product->cost ?? 0);

            return [
                'id'             => $product->id,
                'name'           => $product->name,
                'unit'           => $product->unit ?? 'Piece',
                'price'          => $product->price,
                'cost'           => $product->cost,
                'sold'           => $sold,
                'damaged'        => $damaged,
                'baked_quantity' => $bakedQty,
                'damage_cost'    => $damageCost,
                'branch'         => $branch ?? 'all',
            ];
        });
    }

    // INVENTORY — RAW INGREDIENTS
    public function inventoryMeasured()
    {
        return Ingredient::all()->map(fn($ingredient) => [
            'id'     => $ingredient->id,
            'name'   => $ingredient->name,
            'stock'  => $ingredient->quantity . ' ' . $ingredient->unit,
            'status' => $ingredient->quantity > 50 ? 'Healthy' : 'Low',
            'branch' => 'All',
            'value'  => $ingredient->quantity * 1000,
        ]);
    }

    // INVENTORY — BAKED GOODS
    public function inventoryBaked()
    {
        return Product::where('type', 'baked')->get()->map(fn($product) => [
            'id'     => $product->id,
            'name'   => $product->name,
            'daily'  => Production::where('product_id', $product->id)->sum('quantity') . ' pcs',
            'sold'   => (string) OrderItem::where('product_id', $product->id)->sum('quantity'),
            'loss'   => (string) Damage::where('product_id', $product->id)->sum('quantity'),
            'branch' => 'All',
        ]);
    }

    // ANALYTICS — KPI CARDS
    public function analyticsSummary()
    {
        return [
            'sales'      => ['value' => Revenue::sum('amount'),     'trend' => '+12%'],
            'production' => ['value' => Production::sum('quantity'), 'trend' => 'Stable'],
            'inventory'  => ['value' => Stock::sum('quantity'),      'trend' => '+50'],
            'damage'     => ['value' => Damage::sum('quantity'),     'trend' => '+2'],
        ];
    }

    // ANALYTICS — PRODUCT PERFORMANCE + RECOMMENDATIONS
    public function analyticsPerformance()
    {
        return Product::all()->map(function ($product) {
            $totalSold = OrderItem::where('product_id', $product->id)->sum('quantity');
            $stock     = Stock::where('product_id', $product->id)->sum('quantity');
            $damaged   = Damage::where('product_id', $product->id)->sum('quantity');

            $total      = $totalSold + $stock + $damaged;
            $popularity = $total > 0 ? round(($totalSold / $total) * 100) : 0;

            $trend = $totalSold > 200 ? 'Increasing' : ($totalSold > 50 ? 'Stable' : 'Decreasing');

            $recommendation = match (true) {
                $popularity >= 80     => 'Increase production',
                $popularity >= 50     => 'Maintain current levels',
                $damaged > $totalSold => 'Review quality control',
                default               => 'Consider reducing production',
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

    // ANALYTICS — REAL-TIME ACTIVITY LOG
    // Supports: ?limit=
    public function analyticsActivities(Request $request)
    {
        $limit = (int) $request->query('limit', 100);

        $productions = Production::with(['product', 'user'])->latest()->take($limit)->get()
            ->map(fn($p) => [
                'id'       => $p->id,
                'user'     => optional($p->user)->name ?? 'Baker Assistant',
                'role'     => 'Baker Assistant',
                'category' => 'production',
                'action'   => 'Baked products',
                'item'     => optional($p->product)->name,
                'quantity' => $p->quantity,
                'time'     => $p->created_at->format('g:i A, M j'),
            ]);

        $damages = Damage::with(['product', 'user'])->latest()->take($limit)->get()
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

        return $productions->concat($damages)
            ->sortByDesc('time')
            ->values()
            ->take($limit);
    }
}