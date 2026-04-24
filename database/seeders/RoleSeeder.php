<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Role::insert([
            ['name' => 'marketing_manager'], 
            ['name' => 'shop_manager_kabuga'],
            ['name' => 'shop_manager_masaka'],
            ['name' => 'store_keeper'],
            ['name' => 'baker_assistant'],
            ['name' => 'operations_manager'],
            ['name' => 'sales_coordinator'],
            ['name' => 'cicm'],
            ['name' => 'finance_chief'],
        ]);
    }
}
