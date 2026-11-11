<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update Sheep Table
        Schema::table('sheep', function (Blueprint $table) {
            if (!Schema::hasColumn('sheep', 'gender')) {
                $table->enum('gender', ['Jantan', 'Betina'])->default('Betina')->after('type');
            }
        });

        // Create Breeding Records Table
        Schema::create('breeding_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('male_id')->constrained('sheep')->onDelete('cascade');
            $table->foreignId('female_id')->constrained('sheep')->onDelete('cascade');
            $table->date('mating_date');
            $table->enum('status', ['Waiting', 'Pregnant', 'Success', 'Failed'])->default('Waiting');
            $table->date('est_birth_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('breeding_records');
        Schema::table('sheep', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};
