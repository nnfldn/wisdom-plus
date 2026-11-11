<?php

namespace App\Http\Requests;

use App\Models\BreedingRecord;
use Illuminate\Foundation\Http\FormRequest;

class BreedingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $record = BreedingRecord::find($this->route('id'));

        return $record
            ? ($this->user()?->can('update', $record) ?? false)
            : ($this->user()?->can('update', BreedingRecord::class) ?? false);
    }

    public function rules(): array
    {
        return [
            'male_id' => ['nullable', 'integer', 'exists:sheep,id'],
            'female_id' => ['nullable', 'integer', 'exists:sheep,id', 'different:male_id'],
            'mating_date' => ['nullable', 'date'],
            'status' => ['required', 'in:Waiting,Pregnant,Success,Failed'],
            'est_birth_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
