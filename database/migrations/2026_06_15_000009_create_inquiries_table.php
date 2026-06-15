<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->foreignId('event_plan_id')->nullable()->constrained('event_plans')->nullOnDelete();
            $table->string('event_type');
            $table->date('event_date')->nullable();
            $table->text('message');
            $table->enum('status', ['pending', 'read', 'responded', 'closed'])->default('pending');
            $table->text('vendor_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
