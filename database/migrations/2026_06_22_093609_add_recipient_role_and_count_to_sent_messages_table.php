<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Bring the sent_messages table to the schema expected by the
     * application without altering the original migration.
     */
    public function up(): void
    {
        // Add missing columns
        Schema::table('sent_messages', function (Blueprint $table) {
            if (! Schema::hasColumn('sent_messages', 'recipient_role')) {
                $table->string('recipient_role')->nullable()->after('sender_id');
            }

            if (! Schema::hasColumn('sent_messages', 'recipient_count')) {
                $table->integer('recipient_count')->default(0)->after('message');
            }
        });

        // Copy legacy data
        if (
            Schema::hasColumn('sent_messages', 'recipient_roles') &&
            Schema::hasColumn('sent_messages', 'recipient_role')
        ) {
            DB::table('sent_messages')
                ->whereNull('recipient_role')
                ->update([
                    'recipient_role' => DB::raw('recipient_roles')
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('sent_messages', function (Blueprint $table) {
            if (Schema::hasColumn('sent_messages', 'recipient_role')) {
                $table->dropColumn('recipient_role');
            }

            if (Schema::hasColumn('sent_messages', 'recipient_count')) {
                $table->dropColumn('recipient_count');
            }
        });
    }
};