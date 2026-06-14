<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        // Add FK to brand_packages (nullable first for backfill)
        Schema::table('brand_packages', function (Blueprint $table) {
            $table->foreignId('service_category_id')
                ->nullable()
                ->after('brand_id')
                ->constrained('service_categories')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('brand_packages', function (Blueprint $table) {
            $table->dropForeign(['service_category_id']);
            $table->dropColumn('service_category_id');
        });

        Schema::dropIfExists('service_categories');
    }
};
