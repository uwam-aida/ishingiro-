<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationJob;
use App\Models\CakeOrder;
use App\Models\Damage;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\Production;
use App\Models\Stock;
use Illuminate\Http\Request;

class StoreKeeperController extends Controller
{
    // VIEW ALL STOCK
    public function index()
    {
        return Stock::with('product')->get();
    }

    // ADD / INCREMENT STOCK
    public function store(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'location'    => 'required|in:kabuga,masaka',
            'description' => 'nullable|string',
            'unit'        => 'nullable|string',
        ]);

        $stock = Stock::firstOrCreate([
            'product_id' => $request->product_id,
            'location'   => $request->location,
        ]);

        $stock->increment('quantity', $request->quantity);

        $stock->update(array_filter([
            'description' => $request->description,
            'unit'        => $request->unit,
        ], fn($v) => !is_null($v)));

        return $stock->fresh();
    }

    // UPDATE STOCK COUNT DIRECTLY
    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->update($request->only(['quantity', 'description', 'unit']));

        return $stock;
    }

    // INCOMING PRODUCT REQUESTS (pending orders from shop managers)
    // Now includes created_at and formatted time field
    public function requests()
    {
        return Order::with('items.product')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($order) => array_merge($order->toArray(), [
                'time' => $order->created_at->format('h:i A'),
                'date' => $order->created_at->toDateString(),
            ]));
    }

    // RECORD A DELIVERY
    public function storeDelivery(Request $request)
    {
        $request->validate([
            'product_id'    => 'required|exists:products,id',
            'quantity'      => 'required|integer|min:1',
            'from_location' => 'nullable|string',
            'to_location'   => 'nullable|string',
        ]);

        return Delivery::create($request->all());
    }

    // DELIVERY HISTORY — includes time field
    public function deliveryHistory()
    {
        return Delivery::with('product')
            ->latest()
            ->get()
            ->map(fn($d) => array_merge($d->toArray(), [
                'time' => $d->created_at->format('h:i A'),
                'date' => $d->created_at->toDateString(),
            ]));
    }

    // RECORD DAMAGE
    public function storeDamage(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'quantity'    => 'required|integer|min:1',
            'location'    => 'required|string',
            'reason'      => 'nullable|string',
            'description' => 'nullable|string',
            'unit'        => 'nullable|string',
        ]);

        $damage = Damage::create($request->all());

        if ($damage->quantity > 20) {
            SendNotificationJob::dispatch('operations_manager', 'High damage detected');
            SendNotificationJob::dispatch('marketing_manager', 'Critical damage alert');
        }

        return $damage;
    }

    // GET DAMAGE LOG — includes time field
    public function damages()
    {
        return Damage::with('product')
            ->latest()
            ->get()
            ->map(fn($d) => array_merge($d->toArray(), [
                'time' => $d->created_at->format('h:i A'),
                'date' => $d->created_at->toDateString(),
            ]));
    }

    // GET PRODUCTION LOG (baker output visible to store keeper) — includes time field
    public function productionLog()
    {
        return Production::with('product')
            ->latest()
            ->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                'time' => $p->created_at->format('h:i A'),
                'date' => $p->created_at->toDateString(),
            ]));
    }

    // ALL CAKE ORDERS (cake management tab) — includes time field
    public function cakeOrders()
    {
        return CakeOrder::latest()
            ->get()
            ->map(fn($c) => array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]));
    }

    // PENDING CAKE REQUESTS only — includes time field
    public function cakeRequests()
    {
        return CakeOrder::where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn($c) => array_merge($c->toArray(), [
                'time' => $c->created_at->format('h:i A'),
                'date' => $c->created_at->toDateString(),
            ]));
    }
}