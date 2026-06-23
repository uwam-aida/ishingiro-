<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The sent_messages table has a messy history:
     *   - Original migration created `recipient_roles` (plural), no `recipient_count`
     *   - A later migration tried to rename it but failed on deployments where
     *     `recipient_role` (singular) already existed → "duplicate column" crash
     *
     * This migration is safe to run in any state the table might be in.
     */
    public function up(): void
    {
        Schema::table('sent_messages', function (Blueprint $table) {
            $hasPlural   = Schema::hasColumn('sent_messages', 'recipient_roles');
            $hasSingular = Schema::hasColumn('sent_messages', 'recipient_role');

            // Case 1: only the old plural column exists → rename it
            if ($hasPlural && ! $hasSingular) {
                $table->renameColumn('recipient_roles', 'recipient_role');
            }

            // Case 2: neither exists → add the correct column fresh
            if (! $hasPlural && ! $hasSingular) {
                $table->string('recipient_role')->after('sender_id');
            }

            // Case 3: both exist → drop the old plural one, keep the correct one
            if ($hasPlural && $hasSingular) {
                $table->dropColumn('recipient_roles');
            }

            // Add recipient_count if it's still missing
            if (! Schema::hasColumn('sent_messages', 'recipient_count')) {
                $table->integer('recipient_count')->default(0)->after('message');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sent_messages', function (Blueprint $table) {
            if (Schema::hasColumn('sent_messages', 'recipient_count')) {
                $table->dropColumn('recipient_count');
            }
        });
    }
};