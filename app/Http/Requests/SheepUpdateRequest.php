<?php

namespace App\Http\Requests;

use App\Models\Sheep;
use Illuminate\Foundation\Http\FormRequest;

class SheepUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $sheep = Sheep::find($this->route('id'));

        return $sheep
            ? ($this->user()?->can('update', $sheep) ?? false)
            : ($this->user()?->can('update', Sheep::class) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'birth_date' => $this->input('birthDate'),
            'price_per_kg' => $this->input('pricePerKg'),
            'parent_male' => $this->input('parentMale'),
            'parent_female' => $this->input('parentFemale'),
        ], fn ($v) => $v !== null));
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'tag' => ['required', 'string', 'max:64', 'unique:sheep,tag,'.$id],
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
