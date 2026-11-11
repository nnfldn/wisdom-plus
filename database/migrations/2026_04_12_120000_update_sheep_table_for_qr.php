<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sheep', function (Blueprint $table) {
            if (!Schema::hasColumn('sheep', 'qr_url')) {
                $table->string('qr_url')->nullable()->after('img_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sheep', function (Blueprint $table) {
            $table->dropColumn('qr_url');
        });
    }
};
