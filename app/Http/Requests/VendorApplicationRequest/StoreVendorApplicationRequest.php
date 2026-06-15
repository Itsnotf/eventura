<?php

namespace App\Http\Requests\VendorApplicationRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'applicant_name' => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255'],
            'phone'          => ['required', 'string', 'max:20'],
            'brand_name'     => ['required', 'string', 'max:255'],
            'category'       => ['required', 'array', 'min:1'],
            'category.*'     => ['in:EO,WO'],
            'message'        => ['nullable', 'string', 'max:2000'],
            'document'       => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
