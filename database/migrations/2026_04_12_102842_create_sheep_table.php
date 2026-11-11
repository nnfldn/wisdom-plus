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
        Schema::create('sheep', function (Blueprint $table) {
            $table->id();
            $table->string('tag')->unique(); // ID Cloud Tag (e.g., QR-001)
            $table->string('type');          // Ras (e.g., Cross Texel)
            $table->decimal('weight', 8, 2); // Bobot aktual (kg)
            $table->string('status');        // Status (Siap Jual, Penggemukan, etc.)
            $table->integer('price_per_kg')->default(0);
            $table->string('age_string')->nullable(); // Readable age (e.g., 8 Bulan)
            $table->string('block');         // Lokasi Kandang (Blok Hamil, etc.)
            $table->string('health')->default('Sehat');
            $table->string('parent_male')->nullable();
            $table->string('parent_female')->nullable();
            $table->date('birth_date');
            $table->string('img_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sheep');
    }
};
