<?php

namespace App\Http\Requests;

use App\Models\Testimonial;
use Illuminate\Foundation\Http\FormRequest;

class TestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        $id = $this->route('id');

        if ($id) {
            $testi = Testimonial::find($id);

            return $testi
                ? ($this->user()?->can('update', $testi) ?? false)
                : ($this->user()?->can('update', Testimonial::class) ?? false);
        }

        return $this->user()?->can('create', Testimonial::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'text' => ['required', 'string', 'max:5000'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
