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
            'category'       => ['required', 'string', 'in:EO,WO,Catering,Dekorasi,Dokumentasi,Rias & Busana,Sound System & Lighting,Venue,MC & Hiburan,Undangan & Souvenir,Lainnya'],
            'message'        => ['nullable', 'string', 'max:2000'],
            'document'       => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
