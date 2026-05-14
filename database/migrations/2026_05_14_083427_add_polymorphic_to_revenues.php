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
        Schema::table('revenues', function (Blueprint $table) {
            if (!Schema::hasColumn('revenues', 'reference_type')) {
                $table->string('reference_type')->nullable()->after('source');
            }
            if (!Schema::hasColumn('revenues', 'reference_id')) {
                $table->unsignedBigInteger('reference_id')->nullable()->after('reference_type');
            }
            
            // Add indexes for polymorphic queries
            $table->index(['reference_type', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revenues', function (Blueprint $table) {
            $table->dropIndex(['reference_type', 'reference_id']);
            $table->dropColumn(['reference_type', 'reference_id']);
        });
    }
};
