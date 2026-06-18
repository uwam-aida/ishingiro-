<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            if (!Schema::hasColumn('cake_orders', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            if (Schema::hasColumn('cake_orders', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });
    }
};