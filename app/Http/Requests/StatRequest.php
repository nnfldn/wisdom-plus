<?php

namespace App\Http\Requests;

use App\Models\Stat;
use Illuminate\Foundation\Http\FormRequest;

class StatRequest extends FormRequest
{
    public function authorize(): bool
    {
        $id = $this->route('id');

        if ($id) {
            $stat = Stat::find($id);

            return $stat
                ? ($this->user()?->can('update', $stat) ?? false)
                : ($this->user()?->can('update', Stat::class) ?? false);
        }

        return $this->user()?->can('create', Stat::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'value' => ['required', 'string', 'max:20'],
            'label' => ['required', 'string', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
