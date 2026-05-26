<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            // Add inspo_image if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'inspo_image')) {
                $table->string('inspo_image')->nullable();
            }
            
            // Add inspo_image_path if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'inspo_image_path')) {
                $table->string('inspo_image_path')->nullable();
            }
            
            // Add advance_payment if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'advance_payment')) {
                $table->decimal('advance_payment', 10, 2)->default(0);
            }
            
            // Add remaining_payment if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'remaining_payment')) {
                $table->decimal('remaining_payment', 10, 2)->default(0);
            }
            
            // Add total_paid if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'total_paid')) {
                $table->decimal('total_paid', 10, 2)->default(0);
            }
            
            // Add payment_method if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'payment_method')) {
                $table->string('payment_method')->nullable();
            }
            
            // Add payer_name if it doesn't exist
            if (!Schema::hasColumn('cake_orders', 'payer_name')) {
                $table->string('payer_name')->nullable();
            }
            
            // Add type column for distinguishing orders vs requests
            if (!Schema::hasColumn('cake_orders', 'type')) {
                $table->enum('type', ['order', 'request'])->default('order')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            $columns = [
                'inspo_image', 'inspo_image_path', 'advance_payment', 
                'remaining_payment', 'total_paid', 'payment_method', 
                'payer_name', 'type'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('cake_orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};