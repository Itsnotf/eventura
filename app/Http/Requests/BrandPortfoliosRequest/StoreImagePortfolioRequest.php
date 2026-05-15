<?php

namespace App\Http\Requests\BrandPortfoliosRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreImagePortfolioRequest extends FormRequest
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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Image file is required',
            'image.image' => 'File must be an image',
            'image.mimes' => 'Image must be a file of type: jpeg, png, jpg, gif',
            'image.max' => 'Image file must not exceed 5MB',
        ];
    }
}
