<?php

namespace App\Http\Requests;

use App\Models\Feature;
use Illuminate\Foundation\Http\FormRequest;

class FeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        $id = $this->route('id');

        if ($id) {
            $feature = Feature::find($id);

            return $feature
                ? ($this->user()?->can('update', $feature) ?? false)
                : ($this->user()?->can('update', Feature::class) ?? false);
        }

        return $this->user()?->can('create', Feature::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'icon' => ['nullable', 'string', 'max:50'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'imageFile' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'image_url' => ['nullable', 'string', 'max:1024'],
        ];
    }
}
