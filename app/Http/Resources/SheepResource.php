<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SheepResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $baseUrl = config('app.url');
        $ktpUrl = "{$baseUrl}/ktp/{$this->tag}";

        return [
            'id' => $this->id,
            'tag' => $this->tag,
            'type' => $this->type,
            'gender' => $this->gender,
            'weight' => (float) $this->weight,
            'status' => $this->status,
            'pricePerKg' => (int) $this->price_per_kg,
            'age' => $this->age_display,
            'block' => $this->block,
            'health' => $this->health,
            'birthDate' => $this->birth_date,
            'img' => $this->img_url ?: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80',
            'ktpLink' => $ktpUrl,
            'parentMale' => $this->parent_male,
            'parentFemale' => $this->parent_female,
            'created_at' => $this->created_at,
        ];
    }
}
