<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            if (!Schema::hasColumn('cake_orders', 'type')) {
                $table->enum('type', ['order', 'request'])->default('order')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            if (Schema::hasColumn('cake_orders', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};