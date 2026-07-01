<?php

namespace App\Http\Requests\BrandPortfoliosRequest;

use Illuminate\Foundation\Http\FormRequest;

class CreatePortfoliosRequest extends FormRequest
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
            'brand_id' => 'required|exists:brands,id',
            'deskripsi' => 'required|string',
            'title' => 'required|string',
            'event_type' => 'required|string',
            'event_date' => 'required|date',
            'video' => 'nullable|file|mimes:mp4,mov,webm|max:30720',
        ];
    }

    public function messages(): array
    {
        return [
            'video.mimes' => 'Video portfolio harus berformat MP4, MOV, atau WebM.',
            'video.max'   => 'Ukuran video portfolio maksimal 30MB.',
        ];
    }
}
