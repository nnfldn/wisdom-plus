<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Sheep;
use App\Models\BreedingRecord;
use App\Models\MedicalRecord;
use App\Models\Testimonial;
use App\Models\Post;
use App\Models\ActivityLog;
use App\Models\ChatLog;
use App\Services\SupabaseStorageService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ClearDummyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-dummy-data {--force : Force the operation without confirmation}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Clean all pre-production dummy data (Sheep, Breedings, Medical, Testimonials, Posts, and Logs) from database and storage';

    /**
     * Execute the console command.
     */
    public function handle(SupabaseStorageService $storage)
    {
        if (!$this->option('force') && !$this->confirm('Apakah Anda yakin ingin menghapus seluruh data dummy operasional (Domba, Breeding, Medis, Post, Testimonial, dan Log)? Tindakan ini tidak dapat dibatalkan!')) {
            $this->info('Operasi dibatalkan.');
            return Command::SUCCESS;
        }

        $this->warn('Memulai pembersihan data...');

        // 1. Delete Breeding Records & Medical Records first to respect foreign keys
        $this->info('Menghapus data rekam medis...');
        DB::table('medical_records')->delete();

        $this->info('Menghapus data perkawinan (breeding)...');
        DB::table('breeding_records')->delete();

        // 2. Delete Sheep using Eloquent each() to trigger image cleanup in Supabase Storage
        $sheepCount = Sheep::count();
        $this->info("Menghapus {$sheepCount} data domba secara aman (dan membersihkan foto di Supabase)...");
        Sheep::all()->each(function ($sheep) use ($storage) {
            if ($sheep->img_url) {
                try {
                    $storage->deleteImage($sheep->img_url);
                } catch (\Throwable $e) {
                    $this->warn("Gagal menghapus gambar domba {$sheep->tag} di Supabase Storage.");
                }
            }
            $sheep->delete();
        });

        // 3. Clear Testimonials & Posts
        $this->info('Menghapus data testimoni...');
        DB::table('testimonials')->delete();

        $postCount = Post::count();
        $this->info("Menghapus {$postCount} data postingan (posts) dan membersihkan foto...");
        Post::all()->each(function ($post) use ($storage) {
            if ($post->image_url) {
                try {
                    $storage->deleteImage($post->image_url);
                } catch (\Throwable $e) {
                    $this->warn("Gagal menghapus gambar postingan #{$post->id} di Supabase Storage.");
                }
            }
            $post->delete();
        });

        // 4. Clear Logs
        $this->info('Menghapus log aktivitas...');
        DB::table('activity_logs')->delete();
        
        if (Schema::hasTable('chat_logs')) {
            $this->info('Menghapus log percakapan chatbot...');
            DB::table('chat_logs')->delete();
        }

        $this->info('Membersihkan cache aplikasi...');
        $this->call('cache:clear');

        $this->info('Semua data dummy berhasil dibersihkan! Database siap untuk data produksi.');

        return Command::SUCCESS;
    }
}
