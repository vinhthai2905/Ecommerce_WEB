<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' =>['required', 'string', 'max:255'],
            'email' =>['required', 'string', 'max:255', 'unique:users'],
            'password' =>['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
