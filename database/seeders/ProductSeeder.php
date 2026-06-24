<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            // — BREAD (Baked)
            ['name' => 'big milk Bread', 'price' => 1300, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'small milk Bread', 'price' => 600, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'pcpn', 'price' => 1100, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'scn', 'price' => 1000, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'salted bread', 'price' => 1100, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'baguette', 'price' => 500, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'milk slice bread', 'price' => 200, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'crubes', 'price' => 1300, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'sen pieces', 'price' => 100, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'brown sanduich', 'price' => 250, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'mult graine', 'price' => 1300, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'milk mult graine', 'price' => 1000, 'category' => 'BREAD', 'type' => 'baked'],
            ['name' => 'brown bread', 'price' => 800, 'category' => 'BREAD', 'type' => 'baked'],

            // — CAKES (Baked)
            ['name' => 'tea cake', 'price' => 1000, 'category' => 'CAKES', 'type' => 'baked'],
            ['name' => 'marble cake', 'price' => 1200, 'category' => 'CAKES', 'type' => 'baked'],
            ['name' => 'brown cake', 'price' => 250, 'category' => 'CAKES', 'type' => 'baked'],
            ['name' => 'oliver corn cake', 'price' => 350, 'category' => 'CAKES', 'type' => 'baked'],
            ['name' => 'muffin cake', 'price' => 170, 'category' => 'CAKES', 'type' => 'baked'],

            // — AMANDAZI (Baked)
            ['name' => 'ishingiro', 'price' => 150, 'category' => 'AMANDAZI', 'type' => 'baked'],
            ['name' => 's.begne', 'price' => 70, 'category' => 'AMANDAZI', 'type' => 'baked'],
            ['name' => 'dark donut', 'price' => 450, 'category' => 'AMANDAZI', 'type' => 'baked'],
            ['name' => 'choc donuts', 'price' => 450, 'category' => 'AMANDAZI', 'type' => 'baked'],
            ['name' => 'kk donuts', 'price' => 250, 'category' => 'AMANDAZI', 'type' => 'baked'],
            ['name' => 'triangle', 'price' => 150, 'category' => 'AMANDAZI', 'type' => 'baked'],

            // — OTHERS (Baked)
            ['name' => 'meat samosa', 'price' => 450, 'category' => 'OTHERS', 'type' => 'baked'],
            ['name' => 'biscuits', 'price' => 85, 'category' => 'OTHERS', 'type' => 'baked'],
            ['name' => 'ISH.MILK Cookie', 'price' => 130, 'category' => 'OTHERS', 'type' => 'baked'],
            ['name' => 'butter biscuits', 'price' => 130, 'category' => 'OTHERS', 'type' => 'baked'],
            ['name' => 'chocolate biscuits', 'price' => 140, 'category' => 'OTHERS', 'type' => 'baked'],

            // — OTHERS (Unbaked)
            ['name' => 'ikinyuranyo 1kg', 'price' => 1600, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'ikinyuranyo 3kg', 'price' => 4500, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'ikinyuranyo 5kg', 'price' => 7500, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'ikinyuranyo (0.5)kg', 'price' => 1200, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'yellow c flour 1kg', 'price' => 1700, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'yellow c flour 3kg', 'price' => 4800, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'cashnewnuts', 'price' => 5500, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'cornfresh cream', 'price' => 500, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'ubunyobwa', 'price' => 1800, 'category' => 'OTHERS', 'type' => 'unbaked'],
            ['name' => 'ADDCAKE', 'price' => 2000, 'category' => 'BIG CAKES', 'type' => 'unbaked'],

            // — BIG CAKES (Baked)
            ['name' => 'cake 38000', 'price' => 38000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cake 20000', 'price' => 20000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 24000', 'price' => 24000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cake 19000', 'price' => 19000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cake18000', 'price' => 18000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 15000', 'price' => 15000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 14000', 'price' => 14000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 13000', 'price' => 13000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cake 12000', 'price' => 12000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 10000', 'price' => 10000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 9000', 'price' => 9000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 8000', 'price' => 8000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 7000', 'price' => 7000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cakes 6000', 'price' => 6000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'cake 5000', 'price' => 5000, 'category' => 'BIG CAKES', 'type' => 'baked'],

        ];

        $now = now();

        // Use upsert so running the seeder twice won't create duplicates
        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['name' => $product['name']],
                array_merge($product, [
                    'stock'      => 0,
                    'cost'       => null,
                    'unit'       => null,
                    'updated_at' => $now,
                    'created_at' => $now,
                ])
            );
        }

        $this->command->info('Seeded ' . count($products) . ' products.');
    }
}