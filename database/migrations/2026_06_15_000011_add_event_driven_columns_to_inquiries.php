<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->timestamp('read_at')->nullable()->after('vendor_note');
            $table->text('vendor_response')->nullable()->after('read_at');
            $table->timestamp('responded_at')->nullable()->after('vendor_response');
            $table->boolean('is_archived')->default(false)->after('responded_at');
            $table->timestamp('closed_at')->nullable()->after('is_archived');
        });
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn(['read_at', 'vendor_response', 'responded_at', 'is_archived', 'closed_at']);
        });
    }
};
