<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('cost')->nullable()->after('price');       // production cost
            $table->string('unit')->nullable()->after('cost');         // e.g. Piece, Kg
            $table->string('type')->default('baked')->after('unit');   // baked or unbaked
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['cost', 'unit', 'type']);
        });
    }
};