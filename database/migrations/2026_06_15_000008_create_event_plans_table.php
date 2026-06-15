<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->date('event_date')->nullable();
            $table->string('event_type')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('event_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_plan_id')->constrained('event_plans')->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->foreignId('brand_package_id')->constrained('brand_packages')->cascadeOnDelete();
            $table->foreignId('service_category_id')->nullable()->constrained('service_categories')->nullOnDelete();
            $table->unsignedBigInteger('price_snapshot');
            $table->string('package_name_snapshot');
            $table->string('brand_name_snapshot');
            $table->timestamps();

            // One package per category per plan
            $table->unique(['event_plan_id', 'service_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_plan_items');
        Schema::dropIfExists('event_plans');
    }
};
