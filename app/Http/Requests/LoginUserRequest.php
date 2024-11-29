<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' =>['required', 'string', 'email'],
            'password'=>['required', 'string','min:6'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
