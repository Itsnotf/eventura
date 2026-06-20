<?php

namespace App\Http\Requests\BrandsRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
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
    protected function prepareForValidation(): void
    {
        $value = $this->input('address');
        if ($value && preg_match('/<iframe[^>]*\ssrc=["\']([^"\']+)["\']/i', $value, $m)) {
            $this->merge(['address' => $m[1]]);
        }
    }

    public function rules(): array
    {
        $brandId = $this->route('brand');

        return [
            'user_id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:brands,slug,' . $brandId,
            'category' => 'required|array|min:1',
            'category.*' => 'in:EO,WO,CC,Catering',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'address' => ['nullable', 'string', 'starts_with:https://www.google.com/maps/embed'],
            'whatsapp_number' => 'nullable|string|max:20',
            'instagram' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'is_active' => 'nullable|in:0,1',
        ];
    }
}
