<?php

namespace App\Http\Requests;

use App\Models\AboutSection;
use Illuminate\Foundation\Http\FormRequest;

class AboutSectionUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $section = AboutSection::find($this->route('id'));

        return $section
            ? ($this->user()?->can('update', $section) ?? false)
            : ($this->user()?->can('update', AboutSection::class) ?? false);
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:500'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable'],
            'is_active' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer', 'min:0'],
            'imageFile' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
