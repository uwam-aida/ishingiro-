<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // ── BREAD (Baked) ─────────────────────────────────────────────
            ['name' => 'Big Milk',            'price' => 1300, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Small Milk',          'price' => 600,  'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'PCPN',                'price' => 1100, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Sen',                 'price' => 1000, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Salted Bread',        'price' => 1100, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Baguette',            'price' => 500,  'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Milk Slice Bread',    'price' => 200,  'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Crubes',              'price' => 1300, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Sen Pieces',          'price' => 100,  'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Brown Sandwich',      'price' => 250,  'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Mult Graine',         'price' => 1300, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Milk Mult Graine',    'price' => 1000, 'category' => 'BREAD',     'type' => 'baked'],
            ['name' => 'Brown Bread',         'price' => 800,  'category' => 'BREAD',     'type' => 'baked'],

            // ── CAKES (Baked) ─────────────────────────────────────────────
            ['name' => 'Tea Cake',            'price' => 1000, 'category' => 'CAKES',     'type' => 'baked'],
            ['name' => 'Marble Cake',         'price' => 1200, 'category' => 'CAKES',     'type' => 'baked'],
            ['name' => 'Brown Cake',          'price' => 250,  'category' => 'CAKES',     'type' => 'baked'],
            ['name' => 'Oliver Corn Cake',    'price' => 350,  'category' => 'CAKES',     'type' => 'baked'],
            ['name' => 'Muffin Cake',         'price' => 170,  'category' => 'CAKES',     'type' => 'baked'],

            // ── AMANDAZI (Baked) ──────────────────────────────────────────
            ['name' => 'Ishingiro',           'price' => 150,  'category' => 'AMANDAZI',  'type' => 'baked'],
            ['name' => 'S.Begne',             'price' => 70,   'category' => 'AMANDAZI',  'type' => 'baked'],
            ['name' => 'Dark Donut',          'price' => 450,  'category' => 'AMANDAZI',  'type' => 'baked'],
            ['name' => 'Choc Donuts',         'price' => 450,  'category' => 'AMANDAZI',  'type' => 'baked'],
            ['name' => 'KK Donuts',           'price' => 250,  'category' => 'AMANDAZI',  'type' => 'baked'],
            ['name' => 'Triangle',            'price' => 150,  'category' => 'AMANDAZI',  'type' => 'baked'],

            // ── OTHERS — Baked ────────────────────────────────────────────
            ['name' => 'Meat Samosa',         'price' => 450,  'category' => 'OTHERS',    'type' => 'baked'],
            ['name' => 'Biscuits',            'price' => 85,   'category' => 'OTHERS',    'type' => 'baked'],
            ['name' => 'ISH.Milk Cookie',     'price' => 130,  'category' => 'OTHERS',    'type' => 'baked'],
            ['name' => 'Butter Biscuits',     'price' => 130,  'category' => 'OTHERS',    'type' => 'baked'],
            ['name' => 'Chocolate Biscuits',  'price' => 140,  'category' => 'OTHERS',    'type' => 'baked'],
            ['name' => 'Ubunyobwa',           'price' => 1800, 'category' => 'OTHERS',    'type' => 'unbaked'],

            // ── OTHERS — Unbaked ──────────────────────────────────────────
            ['name' => 'Ikinyuranyo 1kg',     'price' => 1600, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Ikinyuranyo 3kg',     'price' => 4500, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Ikinyuranyo 5kg',     'price' => 7500, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Ikinyuranyo 0.5kg',   'price' => 1200, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Yellow C Flour 1kg',  'price' => 1700, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Yellow C Flour 3kg',  'price' => 4800, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Cashew Nuts',         'price' => 5500, 'category' => 'OTHERS',    'type' => 'unbaked'],
            ['name' => 'Cornfresh Cream',     'price' => 500,  'category' => 'OTHERS',    'type' => 'unbaked'],

            // ── BIG CAKES (Baked) ─────────────────────────────────────────
            ['name' => 'Cake 38000',          'price' => 38000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 20000',          'price' => 20000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 24000',          'price' => 24000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 19000',          'price' => 19000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 18000',          'price' => 18000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 15000',          'price' => 15000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 14000',          'price' => 14000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 13000',          'price' => 13000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 12000',          'price' => 12000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 10000',          'price' => 10000, 'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 9000',           'price' => 9000,  'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 8000',           'price' => 8000,  'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 7000',           'price' => 7000,  'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 6000',           'price' => 6000,  'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Cake 5000',           'price' => 5000,  'category' => 'BIG CAKES', 'type' => 'baked'],
            ['name' => 'Add Cake',            'price' => 2000,  'category' => 'BIG CAKES', 'type' => 'baked'],
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
