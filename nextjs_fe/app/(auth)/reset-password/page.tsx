'use client';

import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export interface FormValues {
    password: string;
}

const formSchema = zfd.formData({
    password: zfd.text(
        z
            .string({
                required_error: 'Password is required',
            })
            .min(8, 'Password too short')
    ),
});

export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!isValid) return;
        setIsLoading(true);
        handleResetPassword(data.password);
        setIsLoading(false);
    };

    const handleResetPassword = async (password: string) => {
        try {
            const res = await api.postToServerAxios({
                endpoint: 'reset-password',
                data: {
                    email: email,
                    token: token,
                    password: password,
                },
            });

            if (res.status === 200) {
                // redirect to login page
                router.push('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex h-full w-full items-center justify-center'>
            <div className='h-max'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className='md:w-96'>
                        <CardHeader className='space-y-1'>
                            <CardTitle className='text-2xl'>
                                Reset Password
                            </CardTitle>
                            <CardDescription>
                                Enter your new password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='grid gap-4'>
                            <div className='grid gap-2'>
                                <div className='relative'>
                                    <Label htmlFor='password'>
                                        New Password
                                    </Label>
                                    <Input
                                        id='password'
                                        type={
                                            isShowPassword ? 'text' : 'password'
                                        }
                                        placeholder='password'
                                        {...register('password')}
                                    />
                                    <a
                                        className='absolute right-2 top-[50%] cursor-pointer'
                                        onClick={() =>
                                            setIsShowPassword((prev) => !prev)
                                        }
                                    >
                                        {isShowPassword ? <Eye /> : <EyeOff />}
                                    </a>
                                </div>
                                {errors.password && (
                                    <Label
                                        htmlFor='password'
                                        className='text-sm font-medium text-destructive text-red-500'
                                    >
                                        {errors.password.message}
                                    </Label>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className='flex w-full flex-col gap-2'>
                                <Button className='w-full' disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className='h-4 w-4 animate-spin items-center' />
                                    ) : (
                                        <span>Reset Password</span>
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
}