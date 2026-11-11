<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SupabaseStorageService
{
    private string $baseUrl;
    private string $bucket;
    private string $serviceKey;
    private string $publicUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.supabase.url') ?: env('SUPABASE_URL', ''), '/');
        $this->bucket = env('SUPABASE_BUCKET', 'sheep-image');
        $this->serviceKey = env('SUPABASE_SECRET', '');
        $this->publicUrl = config('services.supabase.storage_url') ?: env('SUPABASE_STORAGE_URL', '');
    }

    /**
     * Upload an image to Supabase storage via REST API.
     */
    public function uploadImage($file, $folder, $filenamePrefix)
    {
        $filename = $filenamePrefix . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $folder . '/' . $filename;
        $url = "{$this->baseUrl}/storage/v1/object/{$this->bucket}/{$path}";

        \Log::debug("Supabase Upload Attempt", [
            'url' => $url,
            'bucket' => $this->bucket,
            'content_type' => $file->getMimeType(),
            'file_size' => $file->getSize()
        ]);

        $response = Http::timeout(30)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $this->serviceKey,
                'Content-Type' => $file->getMimeType(),
                'x-upsert' => 'true',
            ])
            ->withBody(
                file_get_contents($file->getRealPath()),
                $file->getMimeType()
            )
            ->post($url);

        if ($response->successful()) {
            $publicUrl = $this->publicUrl . $path;
            \Log::info("Supabase upload success: {$publicUrl}");
            return $publicUrl;
        }

        $error = $response->json('message') ?? $response->body();
        \Log::error("Supabase upload failed", [
            'status' => $response->status(),
            'error' => $error,
            'response' => $response->json()
        ]);
        throw new \RuntimeException("Upload gagal: {$error}");
    }

    /**
     * Delete an image from Supabase storage via REST API.
     */
    public function deleteImage($imageUrl)
    {
        if (!$imageUrl || !$this->publicUrl) {
            return false;
        }

        if (!str_starts_with($imageUrl, $this->publicUrl)) {
            return false;
        }

        $path = str_replace($this->publicUrl, '', $imageUrl);

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->serviceKey,
                ])
                ->delete("{$this->baseUrl}/storage/v1/object/{$this->bucket}/{$path}");

            return $response->successful();
        } catch (\Exception $e) {
            \Log::warning("Supabase delete failed: " . $e->getMessage());
            return false;
        }
    }
}
