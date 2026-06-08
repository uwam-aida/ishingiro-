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
        Schema::create('shop_closing_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_manager_id')->constrained('users');
            $table->string('location'); // kabuga, masaka
            $table->date('closing_date');
            $table->json('products'); // Array of products with opening, remaining, damaged, expired, sold
            $table->json('summary'); // Total sold, damaged, expired, remaining
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_closing_records');
    }
};
