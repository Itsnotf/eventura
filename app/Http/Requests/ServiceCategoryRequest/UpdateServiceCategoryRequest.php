<?php

namespace App\Http\Requests\ServiceCategoryRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('service_categories', 'name')->ignore($this->route('service_category'))],
            'slug' => ['required', 'string', 'max:120', Rule::unique('service_categories', 'slug')->ignore($this->route('service_category'))],
            'icon' => ['nullable', 'string', 'max:50'],
        ];
    }
}
