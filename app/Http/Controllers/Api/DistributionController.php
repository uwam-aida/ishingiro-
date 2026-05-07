<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Distribution;
use Illuminate\Http\Request;

class DistributionController extends Controller
{
    // CREATE DISTRIBUTION RECORD
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'category'   => 'required|string', // e.g. Tiku, Events, Guests
            'location'   => 'nullable|string',
            'notes'      => 'nullable|string',
        ]);

        return Distribution::create([
            'product_id' => $request->product_id,
            'quantity'   => $request->quantity,
            'category'   => $request->category,
            'location'   => $request->location,
            'notes'      => $request->notes,
            'user_id'    => auth()->id(),
        ]);
    }

    // GET ALL DISTRIBUTIONS
    public function index()
    {
        return Distribution::with('product')->latest()->get();
    }

    // GET DISTINCT CATEGORIES USED
    public function categories()
    {
        return Distribution::distinct()
            ->orderBy('category')
            ->pluck('category');
    }
}