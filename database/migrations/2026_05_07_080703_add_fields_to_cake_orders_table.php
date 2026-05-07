<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            $table->string('cake_message')->nullable()->after('cake_type');
            $table->string('cake_size')->nullable()->after('cake_message');
            $table->string('frosting_cream')->nullable()->after('cake_size');
            $table->string('frosting_color')->nullable()->after('frosting_cream');
            $table->text('special_instructions')->nullable()->after('frosting_color');
            $table->string('reception_location')->nullable()->after('special_instructions');
            $table->boolean('needs_sample')->default(false)->after('reception_location');
        });
    }

    public function down(): void
    {
        Schema::table('cake_orders', function (Blueprint $table) {
            $table->dropColumn([
                'cake_message',
                'cake_size',
                'frosting_cream',
                'frosting_color',
                'special_instructions',
                'reception_location',
                'needs_sample',
            ]);
        });
    }
};