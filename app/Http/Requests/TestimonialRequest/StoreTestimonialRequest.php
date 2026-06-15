<?php

namespace App\Http\Requests\TestimonialRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $brandId = $this->route('brand_id') ?? $this->input('brand_id');

        return [
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'rating'   => ['required', 'integer', 'min:1', 'max:5'],
            'body'     => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $brandId = $this->input('brand_id');
            $userId  = Auth::id();

            $exists = \App\Models\Testimonials::where('brand_id', $brandId)
                ->where('user_id', $userId)
                ->exists();

            if ($exists) {
                $v->errors()->add('body', 'Anda sudah menulis testimoni untuk brand ini.');
            }
        });
    }
}
