import { zfd } from 'zod-form-data';
import { z } from 'zod';

export const formLoginSchema = zfd.formData({
    username: zfd.text(
        z
            .string({
                required_error: 'Username is required',
            })
            .regex(/^[a-zA-Z0-9_]*$/, 'Invalid username')
            .min(6, 'Username has to be at least 6 characters')
            .max(20, 'Username too long')
    ),
    password: zfd.text(
        z
            .string({
                required_error: 'Password is required',
            })
            .min(8, 'Password too short')
    ),
});

export const formRegisterSchema = zfd.formData({
    username: zfd.text(
        z
            .string({
                required_error: 'Username is required',
            })
            .min(6, 'Username has to be at least 6 characters')
            .regex(/^[a-zA-Z0-9_]*$/, 'Invalid username')
    ),
    email: zfd.text(
        z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email')
    ),
    first_name: zfd.text(
        z
            .string({
                required_error: 'First name is required',
            })
            .min(2, 'First name too short')
    ),
    last_name: zfd.text(
        z
            .string({
                required_error: 'Last name is required',
            })
            .min(2, 'Last name too short')
    ),
    password: zfd.text(
        z
            .string({
                required_error: 'Password is required',
            })
            .min(8, 'Password too short')
    ),
});