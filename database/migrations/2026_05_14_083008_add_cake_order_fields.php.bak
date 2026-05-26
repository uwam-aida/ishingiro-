<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            // Existing fields check - add if missing
            if (!Schema::hasColumn('cake_orders', 'cake_message')) {
                $table->string('cake_message')->nullable();
            }
            if (!Schema::hasColumn('cake_orders', 'cake_size')) {
                $table->string('cake_size')->nullable();
            }
            if (!Schema::hasColumn('cake_orders', 'frosting_cream')) {
                $table->string('frosting_cream')->nullable();
            }
            if (!Schema::hasColumn('cake_orders', 'frosting_color')) {
                $table->string('frosting_color')->nullable();
            }
            if (!Schema::hasColumn('cake_orders', 'special_instructions')) {
                $table->text('special_instructions')->nullable();
            }
            if (!Schema::hasColumn('cake_orders', 'reception_location')) {
                $table->string('reception_location')->nullable();
            }
            if (!Schema::hasColumn('cake_orders', 'needs_sample')) {
                $table->boolean('needs_sample')->default(false);
            }
            
            // NEW FIELDS for image and payments
            if (!Schema::hasColumn('cake_orders', 'inspo_image_path')) {
                $table->string('inspo_image_path')->nullable()->after('inspo_image');
            }
            if (!Schema::hasColumn('cake_orders', 'advance_payment')) {
                $table->decimal('advance_payment', 10, 2)->default(0)->after('price');
            }
            if (!Schema::hasColumn('cake_orders', 'remaining_payment')) {
                $table->decimal('remaining_payment', 10, 2)->default(0)->after('advance_payment');
            }
            if (!Schema::hasColumn('cake_orders', 'total_paid')) {
                $table->decimal('total_paid', 10, 2)->default(0)->after('remaining_payment');
            }
            if (!Schema::hasColumn('cake_orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('total_paid');
            }
            if (!Schema::hasColumn('cake_orders', 'payer_name')) {
                $table->string('payer_name')->nullable()->after('payment_method');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            $columns = [
                'cake_message', 'cake_size', 'frosting_cream', 'frosting_color',
                'special_instructions', 'reception_location', 'needs_sample',
                'inspo_image_path', 'advance_payment', 'remaining_payment',
                'total_paid', 'payment_method', 'payer_name'
            ];
            
            foreach ($columns as $column) {
                if (Schema::hasColumn('cake_orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
