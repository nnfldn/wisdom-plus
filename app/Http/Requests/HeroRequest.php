<?php

namespace App\Http\Requests;

use App\Models\Hero;
use Illuminate\Foundation\Http\FormRequest;

class HeroRequest extends FormRequest
{
    public function authorize(): bool
    {
        $id = $this->route('id');

        if ($id) {
            $hero = Hero::find($id);

            return $hero
                ? ($this->user()?->can('update', $hero) ?? false)
                : ($this->user()?->can('update', Hero::class) ?? false);
        }

        return $this->user()?->can('create', Hero::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'title_main' => ['required', 'string', 'max:255'],
            'title_accent' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
            'button_text' => ['nullable', 'string', 'max:64'],
            'button_link' => ['nullable', 'string', 'max:512'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'show_scanner' => ['nullable', 'boolean'],
            'imageFile' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'image_url' => ['nullable', 'string', 'max:1024'],
        ];
    }
}
