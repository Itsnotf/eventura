<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_plan_items', function (Blueprint $table) {
            $table->unsignedBigInteger('price_end_snapshot')->default(0)->after('price_snapshot');
            $table->renameColumn('price_snapshot', 'price_start_snapshot');
        });

        // Make brand_package_id nullable so nullOnDelete is valid, then re-add FK
        Schema::table('event_plan_items', function (Blueprint $table) {
            $table->dropForeign(['brand_package_id']);
            $table->unsignedBigInteger('brand_package_id')->nullable()->change();
            $table->foreign('brand_package_id')
                ->references('id')->on('brand_packages')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('event_plan_items', function (Blueprint $table) {
            $table->dropForeign(['brand_package_id']);
            $table->unsignedBigInteger('brand_package_id')->nullable(false)->change();
            $table->foreign('brand_package_id')
                ->references('id')->on('brand_packages')
                ->cascadeOnDelete();
        });

        Schema::table('event_plan_items', function (Blueprint $table) {
            $table->renameColumn('price_start_snapshot', 'price_snapshot');
            $table->dropColumn('price_end_snapshot');
        });
    }
};
