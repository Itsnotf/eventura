<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_plan_items', function (Blueprint $table) {
            // MySQL memakai composite unique index ini sebagai index untuk FK event_plan_id.
            // Tambahkan index biasa pada event_plan_id terlebih dahulu agar FK tetap punya index,
            // baru composite unique-nya aman di-drop.
            $table->index('event_plan_id', 'event_plan_items_event_plan_id_idx');
            $table->dropUnique(['event_plan_id', 'service_category_id']);
        });
    }

    public function down(): void
    {
        Schema::table('event_plan_items', function (Blueprint $table) {
            // CATATAN: rollback bisa GAGAL jika sudah ada data duplikat kategori
            // dalam satu rencana. Bersihkan duplikat dulu bila perlu.
            $table->unique(['event_plan_id', 'service_category_id']);
            $table->dropIndex('event_plan_items_event_plan_id_idx');
        });
    }
};
