<?php

namespace App\Console\Commands;

use App\Models\DeliveryNote;
use Illuminate\Console\Command;

class FixDeliveryNotes extends Command
{
    protected $signature = 'fix:delivery-notes';
    protected $description = 'Fix missing product names in delivery notes';

    public function handle()
    {
        $notes = DeliveryNote::all();
        $fixed = 0;

        if ($notes->count() === 0) {
            $this->info('No delivery notes found to fix.');
            return;
        }

        foreach ($notes as $note) {
            $items = $note->items;
            $updated = false;

            foreach ($items as &$item) {
                // Determine the product name from any available key
                $productName = $item['product_name'] ?? $item['name'] ?? $item['item'] ?? null;
                
                if ($productName) {
                    if (!isset($item['name'])) {
                        $item['name'] = $productName;
                        $updated = true;
                    }
                    if (!isset($item['product_name'])) {
                        $item['product_name'] = $productName;
                        $updated = true;
                    }
                } else {
                    // If no product name found, set a default
                    if (!isset($item['name'])) {
                        $item['name'] = 'Product';
                        $updated = true;
                    }
                    if (!isset($item['product_name'])) {
                        $item['product_name'] = 'Product';
                        $updated = true;
                    }
                }
                
                // Ensure qty keys exist
                if (isset($item['quantity']) && !isset($item['qty'])) {
                    $item['qty'] = $item['quantity'];
                    $updated = true;
                }
                if (isset($item['qty']) && !isset($item['quantity'])) {
                    $item['quantity'] = $item['qty'];
                    $updated = true;
                }
                
                // Ensure price keys exist
                if (isset($item['unit_price']) && !isset($item['price'])) {
                    $item['price'] = $item['unit_price'];
                    $updated = true;
                }
                if (isset($item['price']) && !isset($item['unit_price'])) {
                    $item['unit_price'] = $item['price'];
                    $updated = true;
                }
                
                // Ensure total exists
                if (!isset($item['total']) && isset($item['qty']) && isset($item['unit_price'])) {
                    $item['total'] = $item['qty'] * $item['unit_price'];
                    $updated = true;
                }
            }

            if ($updated) {
                $note->items = $items;
                $note->save();
                $fixed++;
                $this->info("Fixed delivery note #{$note->id}");
            }
        }

        $this->info("Fixed {$fixed} delivery notes");
    }
}