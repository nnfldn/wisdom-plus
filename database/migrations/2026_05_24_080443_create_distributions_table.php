<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->date('delivery_date')->nullable();
            $table->string('driver_name')->nullable();
            $table->string('vehicle_plate')->nullable();
            $table->string('delivery_status')->default('Persiapan'); // Persiapan, Di Jalan, Terkirim
            $table->string('proof_image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distributions');
    }
};
