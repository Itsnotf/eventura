<?php

namespace App\Http\Requests\BrandPackagesRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandPackagesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'brand_id'            => 'required|integer|exists:brands,id',
            'service_category_id' => 'required|integer|exists:service_categories,id',
            'name'                => 'required|string|max:255',
            'price_start'         => 'required|integer|min:0',
            'price_end'           => 'required|integer|min:0|gte:price_start',
            'description'         => 'nullable|string',
            'cover_image'         => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_featured'         => 'nullable|boolean',
        ];
    }
}
