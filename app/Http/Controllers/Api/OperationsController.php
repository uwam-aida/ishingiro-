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
    // FIXED: Now includes proper damages with product names and reported_by,
    // and baked products with proper data
    public function details()
    {
        // ✅ Damages with product names and reported_by
        $damages = Damage::with(['product', 'user'])->latest()->get()->map(function ($d) {
            return [
                'id'          => $d->id,
                'product_id'  => $d->product_id,
                'product'     => optional($d->product)->name ?? 'Unknown Product',
                'quantity'    => $d->quantity,
                'reason'      => $d->reason,
                'location'    => $d->location,
                'reported_by' => optional($d->user)->name ?? 'Unknown',
                'created_at'  => $d->created_at,
                'updated_at'  => $d->updated_at,
            ];
        });

        // ✅ Baked products with proper data
        $baked = Production::with('product')
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id'          => $p->id,
                    'product_id'  => $p->product_id,
                    'product'     => optional($p->product)->name ?? 'Unknown Product',
                    'product_name'=> optional($p->product)->name ?? 'Unknown Product',
                    'quantity'    => $p->quantity,
                    'location'    => $p->location,
                    'created_at'  => $p->created_at,
                    'updated_at'  => $p->updated_at,
                ];
            });

        // ✅ Distribution with product names
        $distribution = Distribution::with('product')->latest()->get()->map(function ($d) {
            return [
                'id'          => $d->id,
                'product_id'  => $d->product_id,
                'product'     => optional($d->product)->name ?? 'Unknown Product',
                'product_name'=> optional($d->product)->name ?? 'Unknown Product',
                'quantity'    => $d->quantity,
                'category'    => $d->category,
                'location'    => $d->location,
                'notes'       => $d->notes,
                'created_at'  => $d->created_at,
            ];
        });

        // ✅ Delivery with product names
        $delivered = Delivery::with('product')->latest()->get()->map(function ($d) {
            return [
                'id'            => $d->id,
                'product_id'    => $d->product_id,
                'product'       => optional($d->product)->name ?? 'Unknown Product',
                'product_name'  => optional($d->product)->name ?? 'Unknown Product',
                'quantity'      => $d->quantity,
                'from_location' => $d->from_location,
                'to_location'   => $d->to_location,
                'created_at'    => $d->created_at,
            ];
        });

        // ✅ Orders with items and product names
        $orders = Order::with('items.product')->latest()->get()->map(function ($order) {
            return [
                'id'         => $order->id,
                'user_id'    => $order->user_id,
                'location'   => $order->location,
                'status'     => $order->status,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'items'      => $order->items->map(function ($item) {
                    return [
                        'id'           => $item->id,
                        'product_id'   => $item->product_id,
                        'product_name' => optional($item->product)->name ?? 'Unknown Product',
                        'quantity'     => $item->quantity,
                        'price'        => $item->price,
                        'total'        => $item->quantity * $item->price,
                    ];
                }),
                'total_amount' => $order->items->sum(function ($item) {
                    return $item->quantity * $item->price;
                }),
            ];
        });

        return [
            'measured'     => Ingredient::all(),
            'baked'        => $baked,
            'distribution' => $distribution,
            'delivered'    => $delivered,
            'orders'       => $orders,
            'damaged'      => $damages,
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
                $d->product_name = optional($d->product)->name ?? 'Unknown Product';
            });
    }

    public function updateDistribution(Request $request, $id)
    {
        $distribution = Distribution::findOrFail($id);
        $distribution->update($request->only(['quantity','category', 'location', 'notes']));

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