<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Production;
use App\Models\Revenue;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        return Damage::with('product', 'user')
            ->latest()
            ->get()
            ->map(fn($d) => [
                'id'          => $d->id,
                'product'     => optional($d->product)->name,
                'quantity'    => $d->quantity,
                'reason'      => $d->reason,
                'location'    => $d->location,
                'reported_by' => optional($d->user)->name ?? 'Unknown',
                'date'        => $d->created_at->toDateString(),
                'created_at'  => $d->created_at->toISOString(),
            ]);
    }

    // SALES VS DAMAGE PER PRODUCT
    public function ingredientUsage()
    {
        $productions = Production::with('product')
            ->get();
        
        $usage = [
            'flour' => 0,
            'sugar' => 0,
            'butter' => 0,
            'yeast' => 0,
        ];
        
        foreach ($productions as $prod) {
            if ($prod->product && $prod->product->name === 'big milk') {
                $usage['flour'] += $prod->quantity * 0.5;
                $usage['sugar'] += $prod->quantity * 0.1;
            }
        }
        
        return response()->json($usage);
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

    /**
     * ANALYTICS — PRODUCT PERFORMANCE + RECOMMENDATIONS
     * ✅ FIXED: No N+1 queries - uses eager loading and single query for totals
     */
    public function analyticsPerformance()
    {
        // Get all products
        $products = Product::all();
        
        // Get all order item totals per product in ONE query
        $orderItemTotals = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->pluck('total_sold', 'product_id')
            ->toArray();
        
        // Get all stock totals per product in ONE query
        $stockTotals = Stock::select('product_id', DB::raw('SUM(quantity) as total_stock'))
            ->groupBy('product_id')
            ->pluck('total_stock', 'product_id')
            ->toArray();
        
        // Get all damage totals per product in ONE query
        $damageTotals = Damage::select('product_id', DB::raw('SUM(quantity) as total_damage'))
            ->groupBy('product_id')
            ->pluck('total_damage', 'product_id')
            ->toArray();

        return $products->map(function ($product) use ($orderItemTotals, $stockTotals, $damageTotals) {
            $totalSold = $orderItemTotals[$product->id] ?? 0;
            $stock     = $stockTotals[$product->id] ?? 0;
            $damaged   = $damageTotals[$product->id] ?? 0;

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

    /**
     * ANALYTICS — REAL-TIME ACTIVITY LOG
     * ✅ FIXED: Added 'user' relationship to Production model and eager loaded properly
     */
    public function analyticsActivities(Request $request)
    {
        $limit = (int) $request->query('limit', 100);

        // ✅ FIXED: eager load 'user' relationship (now defined in Production model)
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

    // ============================================
    // NEW APIs for Chief of Finance Dashboard
    // ============================================

    /**
     * Get financial dashboard summary with totals
     * GET /api/finance/dashboard/summary
     */
    public function dashboardSummary()
    {
        $totalRevenue = Revenue::sum('amount');
        $totalLoss = Damage::sum(DB::raw('quantity * cost'));
        $netProfit = $totalRevenue - $totalLoss - (Production::sum('quantity') * Product::avg('cost') ?? 0);
        
        // Get revenue by branch
        $revenueByBranch = [
            'kabuga' => Revenue::where('location', 'kabuga')->sum('amount'),
            'masaka' => Revenue::where('location', 'masaka')->sum('amount'),
            'factory' => Revenue::where('location', 'factory')->sum('amount'),
        ];
        
        // Get loss by branch
        $lossByBranch = [
            'kabuga' => Damage::where('location', 'kabuga')->sum(DB::raw('quantity * cost')),
            'masaka' => Damage::where('location', 'masaka')->sum(DB::raw('quantity * cost')),
            'factory' => Damage::where('location', 'factory')->sum(DB::raw('quantity * cost')),
        ];
        
        // Get order counts
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'delivered')->count();
        $totalOrders = Order::count();
        
        // Get cake order revenue
        $cakeOrderRevenue = CakeOrder::sum('total_paid');
        $pendingCakeOrders = CakeOrder::where('status', 'pending')->count();
        
        // Get stock value
        $stockValue = Stock::with('product')->get()->sum(function ($stock) {
            return $stock->quantity * ($stock->product->price ?? 0);
        });
        
        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_loss' => $totalLoss,
            'net_profit' => max(0, $netProfit),
            'revenue_by_branch' => $revenueByBranch,
            'loss_by_branch' => $lossByBranch,
            'pending_orders' => $pendingOrders,
            'completed_orders' => $completedOrders,
            'total_orders' => $totalOrders,
            'cake_order_revenue' => $cakeOrderRevenue,
            'pending_cake_orders' => $pendingCakeOrders,
            'stock_value' => $stockValue,
        ]);
    }

    /**
     * Get weekly revenue data for chart
     * GET /api/finance/weekly-revenue
     */
    public function weeklyRevenue()
    {
        $startDate = now()->subDays(6)->startOfDay();
        $endDate = now()->endOfDay();
        
        $revenues = Revenue::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Fill in missing days
        $dates = [];
        for ($i = 0; $i < 7; $i++) {
            $date = now()->subDays(6 - $i)->format('Y-m-d');
            $dates[$date] = 0;
        }
        
        foreach ($revenues as $revenue) {
            $dates[$revenue->date] = $revenue->total;
        }
        
        $result = [];
        foreach ($dates as $date => $total) {
            $result[] = [
                'day' => date('D', strtotime($date)),
                'date' => $date,
                'total' => $total,
            ];
        }
        
        return response()->json($result);
    }

    /**
     * Get monthly revenue data
     * GET /api/finance/monthly-revenue
     */
    public function monthlyRevenue()
    {
        $currentYear = now()->year;
        
        $revenues = Revenue::whereYear('created_at', $currentYear)
            ->selectRaw('MONTH(created_at) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        $months = [];
        for ($i = 1; $i <= 12; $i++) {
            $months[$i] = 0;
        }
        
        foreach ($revenues as $revenue) {
            $months[$revenue->month] = $revenue->total;
        }
        
        $result = [];
        foreach ($months as $month => $total) {
            $result[] = [
                'month' => date('M', mktime(0, 0, 0, $month, 1)),
                'month_num' => $month,
                'total' => $total,
            ];
        }
        
        return response()->json($result);
    }

    /**
     * Get top selling products
     * GET /api/finance/top-products
     */
    public function topProducts(Request $request)
    {
        $limit = (int) $request->query('limit', 10);
        
        $topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->with('product')
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'name' => $item->product->name ?? 'Unknown',
                    'total_sold' => $item->total_sold,
                    'revenue' => $item->total_sold * ($item->product->price ?? 0),
                ];
            });
        
        return response()->json($topProducts);
    }

    /**
     * Get recent transactions
     * GET /api/finance/recent-transactions
     */
    public function recentTransactions(Request $request)
    {
        $limit = (int) $request->query('limit', 20);
        
        $revenues = Revenue::latest()->limit($limit)->get()->map(function ($revenue) {
            return [
                'id' => $revenue->id,
                'amount' => $revenue->amount,
                'source' => $revenue->source,
                'location' => $revenue->location,
                'type' => 'revenue',
                'date' => $revenue->created_at->toDateString(),
                'time' => $revenue->created_at->format('h:i A'),
                'created_at' => $revenue->created_at,
            ];
        });
        
        $damages = Damage::with('product', 'user')->latest()->limit($limit)->get()->map(function ($damage) {
            return [
                'id' => $damage->id,
                'amount' => $damage->quantity * ($damage->product->cost ?? 0),
                'source' => 'damage_' . ($damage->product->name ?? 'unknown'),
                'location' => $damage->location,
                'type' => 'loss',
                'product' => $damage->product->name ?? 'Unknown',
                'quantity' => $damage->quantity,
                'reason' => $damage->reason,
                'reported_by' => optional($damage->user)->name ?? 'Unknown',
                'date' => $damage->created_at->toDateString(),
                'time' => $damage->created_at->format('h:i A'),
                'created_at' => $damage->created_at,
            ];
        });
        
        $transactions = $revenues->concat($damages)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values();
        
        return response()->json($transactions);
    }

    /**
     * Get profit margin by product
     * GET /api/finance/profit-margins
     */
    public function profitMargins()
    {
        $products = Product::all()->map(function ($product) {
            $totalSold = OrderItem::where('product_id', $product->id)->sum('quantity');
            $totalRevenue = $totalSold * $product->price;
            $totalCost = $totalSold * ($product->cost ?? 0);
            $profit = $totalRevenue - $totalCost;
            $margin = $totalRevenue > 0 ? round(($profit / $totalRevenue) * 100, 2) : 0;
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'total_sold' => $totalSold,
                'total_revenue' => $totalRevenue,
                'total_cost' => $totalCost,
                'profit' => $profit,
                'margin' => $margin,
            ];
        })->sortByDesc('profit')->values();
        
        return response()->json($products);
    }

    /**
     * Get branch performance comparison
     * GET /api/finance/branch-performance
     */
    public function branchPerformance()
    {
        $branches = ['kabuga', 'masaka', 'factory'];
        $performance = [];
        
        foreach ($branches as $branch) {
            $revenue = Revenue::where('location', $branch)->sum('amount');
            $loss = Damage::where('location', $branch)->sum(DB::raw('quantity * cost'));
            $orders = Order::where('location', $branch)->count();
            $cakeOrders = CakeOrder::where('location', $branch)->count();
            
            $performance[] = [
                'branch' => ucfirst($branch),
                'branch_key' => $branch,
                'revenue' => $revenue,
                'loss' => $loss,
                'net' => $revenue - $loss,
                'orders' => $orders,
                'cake_orders' => $cakeOrders,
            ];
        }
        
        return response()->json($performance);
    }

    /**
     * Get cash flow summary
     * GET /api/finance/cash-flow
     */
    public function cashFlow(Request $request)
    {
        $days = (int) $request->query('days', 30);
        $startDate = now()->subDays($days)->startOfDay();
        
        $incoming = Revenue::where('created_at', '>=', $startDate)->sum('amount');
        $outgoing = Damage::where('created_at', '>=', $startDate)->sum(DB::raw('quantity * cost'));
        
        // Add production costs as outgoing
        $productionCost = Production::where('created_at', '>=', $startDate)
            ->with('product')
            ->get()
            ->sum(function ($prod) {
                return $prod->quantity * ($prod->product->cost ?? 0);
            });
        
        $totalOutgoing = $outgoing + $productionCost;
        $netCashFlow = $incoming - $totalOutgoing;
        
        return response()->json([
            'period_days' => $days,
            'period_start' => $startDate->toDateString(),
            'period_end' => now()->toDateString(),
            'total_incoming' => $incoming,
            'total_outgoing' => $totalOutgoing,
            'damage_loss' => $outgoing,
            'production_cost' => $productionCost,
            'net_cash_flow' => $netCashFlow,
        ]);
    }
}