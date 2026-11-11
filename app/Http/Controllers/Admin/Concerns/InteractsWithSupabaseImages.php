<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Services\SupabaseStorageService;
use Illuminate\Support\Facades\Log;

/**
 * Bungkus pemanggilan SupabaseStorageService agar exception upstream
 * tidak menggagalkan request user. Setiap controller resource cukup
 * memakai trait ini lewat property $storageService.
 */
trait InteractsWithSupabaseImages
{
    protected SupabaseStorageService $storageService;

    public function bootSupabaseStorage(SupabaseStorageService $service): void
    {
        $this->storageService = $service;
    }

    protected function safeUploadImage($file, string $folder, string $prefix): ?string
    {
        try {
            return $this->storageService->uploadImage($file, $folder, $prefix);
        } catch (\Throwable $e) {
            Log::error('Image upload failed', [
                'folder' => $folder,
                'prefix' => $prefix,
                'message' => $e->getMessage(),
            ]);
            session()->flash('warning', 'Gambar gagal diunggah, data tetap disimpan tanpa gambar baru.');

            return null;
        }
    }

    protected function safeDeleteImage(?string $url): void
    {
        if (! $url) {
            return;
        }

        try {
            $this->storageService->deleteImage($url);
        } catch (\Throwable $e) {
            Log::warning('Image delete failed', [
                'url' => $url,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
