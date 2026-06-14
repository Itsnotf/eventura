<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Rename existing 'user' role to 'vendor' (brand owners become vendors)
        DB::table('roles')->where('name', 'user')->update(['name' => 'vendor']);

        // Create new 'user' role for customers (if not exists)
        if (!DB::table('roles')->where('name', 'user')->exists()) {
            DB::table('roles')->insert([
                'name'       => 'user',
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('roles')->where('name', 'user')->delete();
        DB::table('roles')->where('name', 'vendor')->update(['name' => 'user']);
    }
};
