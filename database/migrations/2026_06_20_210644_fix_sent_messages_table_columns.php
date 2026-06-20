<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * BUG: an earlier migration (filename ends in ".php.php") already created
     * the `sent_messages` table with a `recipient_roles` (plural) column and
     * no `recipient_count`. The later migration meant to add the correct
     * columns just checks `Schema::hasTable('sent_messages')` and silently
     * returns early since the table already existed — so it never ran.
     *
     * SalesController::sendMessage() and the SentMessage model both write to
     * `recipient_role` (singular) and `recipient_count`, neither of which
     * exist on the real table. Every insert failed with "Unknown column
     * 'recipient_role'", which is the 500 error the sales coordinator hit
     * when sending a message.
     */
    public function up(): void
    {
        Schema::table('sent_messages', function (Blueprint $table) {
            if (Schema::hasColumn('sent_messages', 'recipient_roles') && !Schema::hasColumn('sent_messages', 'recipient_role')) {
                $table->renameColumn('recipient_roles', 'recipient_role');
            }

            if (!Schema::hasColumn('sent_messages', 'recipient_role')) {
                $table->string('recipient_role')->after('sender_id');
            }

            if (!Schema::hasColumn('sent_messages', 'recipient_count')) {
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