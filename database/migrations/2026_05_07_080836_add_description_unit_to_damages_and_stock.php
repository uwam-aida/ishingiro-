<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('damages', function (Blueprint $table) {
            $table->string('description')->nullable()->after('reason');
            $table->string('unit')->nullable()->after('description'); // e.g. pieces, kg
        });

        Schema::table('stocks', function (Blueprint $table) {
            $table->string('description')->nullable()->after('quantity');
            $table->string('unit')->nullable()->after('description'); // e.g. pieces, kg
        });
    }

    public function down(): void
    {
        Schema::table('damages', function (Blueprint $table) {
            $table->dropColumn(['description', 'unit']);
        });

        Schema::table('stocks', function (Blueprint $table) {
            $table->dropColumn(['description', 'unit']);
        });
    }
};