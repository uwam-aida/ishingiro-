<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string',
            'price'    => 'required|numeric',
            'cost'     => 'nullable|numeric',
            'category' => 'nullable|string',
            'type'     => 'required|in:baked,unbaked',
        ]);

        // `stock` is NOT NULL in the DB but managed via Productions/StockMovements,
        // not set on creation. Default to 0 so the insert never fails.
        $validated['stock'] = 0;

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'     => 'sometimes|string',
            'price'    => 'sometimes|numeric',
            'cost'     => 'nullable|numeric',
            'category' => 'nullable|string',
            'type'     => 'sometimes|in:baked,unbaked',
        ]);

        $product->update($validated);
        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}