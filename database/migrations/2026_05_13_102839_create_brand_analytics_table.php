<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->string('type'); // profile_view | portfolio_view | whatsapp_click
            $table->unsignedBigInteger('subject_id')->nullable(); // portfolio_id for portfolio_view
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['brand_id', 'type', 'created_at']);
            $table->index(['brand_id', 'subject_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_analytics');
    }
};
