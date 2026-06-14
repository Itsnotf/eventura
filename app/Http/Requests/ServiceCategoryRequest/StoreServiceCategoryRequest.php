<?php

namespace App\Http\Requests\ServiceCategoryRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', 'unique:service_categories,name'],
            'slug' => ['required', 'string', 'max:120', 'unique:service_categories,slug'],
            'icon' => ['nullable', 'string', 'max:50'],
        ];
    }
}
