<?php

namespace App\Http\Requests\BrandsRequest;

use Illuminate\Foundation\Http\FormRequest;

class CreateBrandRequest extends FormRequest
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
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:brands,slug',
            'category' => 'required|array|min:1',
            'category.*' => 'in:EO,WO',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'whatsapp_number' => 'nullable|string|max:20',
            'instagram' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'is_active' => 'nullable|in:0,1',
        ];
    }
}
