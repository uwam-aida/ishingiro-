<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Console\Command;

class InitializeStock extends Command
{
    protected $signature = 'stock:init';
    protected $description = 'Initialize stock for all products at factory location';

    public function handle()
    {
        $products = Product::all();
        $created = 0;
        $skipped = 0;

        foreach ($products as $product) {
            $stock = Stock::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'location' => 'factory',
                ],
                [
                    'quantity' => 0,
                    'unit' => $product->type === 'unbaked' ? 'kg' : 'pcs',
                    'description' => 'Auto-initialized stock',
                ]
            );
            
            if ($stock->wasRecentlyCreated) {
                $created++;
                $this->info("✓ Created stock for: {$product->name}");
            } else {
                $skipped++;
            }
        }

        $this->info("\n==========================================");
        $this->info("Stock Initialization Complete!");
        $this->info("Created: {$created} new stock records");
        $this->info("Skipped: {$skipped} existing stock records");
        $this->info("==========================================");
    }
}