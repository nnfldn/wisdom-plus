<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SheepStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Sheep::class) ?? false;
    }

    /**
     * Map camelCase input from frontend to snake_case before validation/use.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'birth_date' => $this->input('birthDate'),
            'price_per_kg' => $this->input('pricePerKg'),
            'parent_male' => $this->input('parentMale'),
            'parent_female' => $this->input('parentFemale'),
        ], fn ($v) => $v !== null));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tag' => ['required', 'string', 'max:64', 'unique:sheep,tag'],
            'type' => ['required', 'string', 'max:64'],
            'gender' => ['required', 'in:Jantan,Betina'],
            'weight' => ['required', 'numeric', 'min:0', 'max:500'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'status' => ['required', 'in:Siap Jual,Anakan,Sakit,Hamil,Laktasi,Penggemukan,Sehat'],
            'block' => ['required', 'string', 'max:64'],
            'price_per_kg' => ['nullable', 'integer', 'min:0'],
            'parent_male' => ['nullable', 'string', 'max:64'],
            'parent_female' => ['nullable', 'string', 'max:64'],
            'age' => ['nullable', 'string', 'max:50'],
            'health' => ['nullable', 'string', 'max:255'],
            'imgFile' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
