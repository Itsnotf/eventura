<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Migrate existing string values to JSON arrays before changing column type
        DB::table('vendor_applications')->orderBy('id')->each(function ($row) {
            $val = $row->category;
            // If already valid JSON array, leave it; otherwise wrap string as single-element array
            $decoded = json_decode($val, true);
            if (!is_array($decoded)) {
                // Keep only EO/WO values from old multi-category strings
                $keep = in_array($val, ['EO', 'WO']) ? [$val] : [];
                DB::table('vendor_applications')
                    ->where('id', $row->id)
                    ->update(['category' => json_encode($keep)]);
            }
        });

        Schema::table('vendor_applications', function (Blueprint $table) {
            $table->json('category')->change();
        });
    }

    public function down(): void
    {
        Schema::table('vendor_applications', function (Blueprint $table) {
            $table->string('category')->change();
        });
    }
};
