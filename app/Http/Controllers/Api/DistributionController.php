<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Distribution;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DistributionController extends Controller
{
    // GET ALL DISTRIBUTIONS
    public function index()
    {
        return Distribution::with('product')->latest()->get();
    }

    // CREATE DISTRIBUTION RECORD
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'category'   => 'required|string',
            'location'   => 'nullable|string',
            'notes'      => 'nullable|string',
        ]);

        $distribution = null;

        DB::transaction(function () use ($request, &$distribution) {
            $distribution = Distribution::create([
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity,
                'category'   => $request->category,
                'location'   => $request->location,
                'notes'      => $request->notes,
                'user_id'    => auth()->id(),
            ]);

            if ($request->location) {
                $stock = Stock::where('product_id', $request->product_id)
                    ->where('location', $request->location)
                    ->first();

                if ($stock && $stock->quantity >= $request->quantity) {
                    $stock->decrement('quantity', $request->quantity);

                    StockMovement::create([
                        'product_id' => $request->product_id,
                        'type'       => 'out',
                        'quantity'   => $request->quantity,
                        'location'   => $request->location,
                        'user_id'    => auth()->id(),
                    ]);
                }
            }
        });

        return $distribution ? $distribution->load('product') : null;
    }

    // GET DISTINCT CATEGORIES
    public function categories()
    {
        // First, get existing categories from distributions
        $existingCategories = Distribution::distinct()
            ->orderBy('category')
            ->pluck('category')
            ->toArray();
        
        // Define default categories
        $defaultCategories = ['Tiku', 'Events', 'Guests', 'Clients', 'Ingaruka'];
        
        // If no categories exist in database, return defaults
        if (empty($existingCategories)) {
            return response()->json($defaultCategories);
        }
        
        // Merge existing with defaults (to ensure all 5 are shown)
        $allCategories = array_unique(array_merge($defaultCategories, $existingCategories));
        
        return response()->json(array_values($allCategories));
    }
}