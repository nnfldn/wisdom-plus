<?php

namespace App\Http\Requests;

use App\Models\BreedingRecord;
use App\Models\Sheep;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class BreedingStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', BreedingRecord::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'male_id' => ['required', 'integer', 'exists:sheep,id'],
            'female_id' => ['required', 'integer', 'exists:sheep,id', 'different:male_id'],
            'mating_date' => ['required', 'date'],
            'status' => ['required', 'in:Waiting,Pregnant,Success,Failed'],
            'est_birth_date' => ['nullable', 'date', 'after_or_equal:mating_date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $male = Sheep::find($this->input('male_id'));
            $female = Sheep::find($this->input('female_id'));

            if ($male && $male->gender !== 'Jantan') {
                $validator->errors()->add('male_id', 'Pejantan harus berjenis kelamin Jantan.');
            }
            if ($female && $female->gender !== 'Betina') {
                $validator->errors()->add('female_id', 'Indukan harus berjenis kelamin Betina.');
            }
        });
    }
}
