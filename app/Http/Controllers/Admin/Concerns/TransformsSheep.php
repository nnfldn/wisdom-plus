<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\Sheep;

/**
 * Bentuk payload Sheep yang konsisten untuk halaman admin (Inertia).
 * Versi public-API memakai App\Http\Resources\SheepResource.
 */
trait TransformsSheep
{
    protected function transformSheep(Sheep $s): array
    {
        $baseUrl = config('app.url');
        $ktpUrl = "{$baseUrl}/ktp/{$s->tag}";
        $qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' . urlencode($ktpUrl);

        return [
            'id' => $s->id,
            'tag' => $s->tag,
            'type' => $s->type,
            'gender' => $s->gender,
            'weight' => (float) $s->weight,
            'status' => $s->status,
            'pricePerKg' => (int) $s->price_per_kg,
            'age' => $s->age_display,
            'block' => $s->block,
            'health' => $s->health,
            'birthDate' => $s->birth_date,
            'img' => $s->img_url ?: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80',
            'qrUrl' => $qrApiUrl,
            'ktpLink' => $ktpUrl,
            'parentMale' => $s->parent_male,
            'parentFemale' => $s->parent_female,
        ];
    }
}
