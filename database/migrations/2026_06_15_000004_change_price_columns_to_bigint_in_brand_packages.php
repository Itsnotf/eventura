<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill: cast any non-numeric strings to 0 to avoid conversion errors
        DB::statement("UPDATE brand_packages SET price_start = REGEXP_REPLACE(price_start, '[^0-9]', '') WHERE price_start REGEXP '[^0-9]'");
        DB::statement("UPDATE brand_packages SET price_end   = REGEXP_REPLACE(price_end,   '[^0-9]', '') WHERE price_end   REGEXP '[^0-9]'");
        DB::statement("UPDATE brand_packages SET price_start = 0 WHERE price_start = '' OR price_start IS NULL");
        DB::statement("UPDATE brand_packages SET price_end   = 0 WHERE price_end   = '' OR price_end   IS NULL");

        Schema::table('brand_packages', function (Blueprint $table) {
            $table->unsignedBigInteger('price_start')->default(0)->change();
            $table->unsignedBigInteger('price_end')->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('brand_packages', function (Blueprint $table) {
            $table->string('price_start')->change();
            $table->string('price_end')->change();
        });
    }
};
