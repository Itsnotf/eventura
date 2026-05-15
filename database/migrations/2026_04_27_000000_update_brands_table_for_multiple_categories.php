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
        Schema::table('brands', function (Blueprint $table) {
            // Remove email column if it exists
            if (Schema::hasColumn('brands', 'email')) {
                $table->dropColumn('email');
            }
            // Change category from enum to json to support multiple categories
            $table->json('category')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            // Revert back to enum
            $table->enum('category', ['EO', 'WO'])->change();
            // Add email column back
            $table->string('email')->unique()->after('name');
        });
    }
};
