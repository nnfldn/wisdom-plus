<?php

namespace App\Http\Requests;

use App\Models\MedicalRecord;
use Illuminate\Foundation\Http\FormRequest;

class MedicalRecordStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MedicalRecord::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'sheep_id' => ['required', 'integer', 'exists:sheep,id'],
            'diagnosis' => ['required', 'string', 'max:255'],
            'treatment' => ['required', 'string', 'max:5000'],
            'handled_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'is_recovered' => ['nullable', 'boolean'],
        ];
    }
}
