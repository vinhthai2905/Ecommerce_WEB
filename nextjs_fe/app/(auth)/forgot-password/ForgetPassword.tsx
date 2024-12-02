'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

export interface FormValues {
    email: string;
}

const formEmailSchema = zfd.formData({
    email: zfd.text(
        z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email')
    ),
});

export default function ForgetPassword() {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formEmailSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!isValid) return;
        setIsLoading(true);
        try {
            const res = await api.postToServerAxios({
                endpoint: '/forgot-password',
                data: data,
            });
            if (res.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Please check your email for the reset link',
                });

                router.push('/login');
            }
        } catch (err) {
            if (err instanceof axios.AxiosError) {
                toast({
                    title: 'Error',
                    description: err.response?.data.message,
                });
            }
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className='md:w-96'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl'>Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a link to
                        reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            placeholder='email'
                            {...register('email')}
                        />
                        {errors.email && (
                            <Label
                                htmlFor='email'
                                className='text-sm font-medium text-destructive text-red-500'
                            >
                                {errors.email.message}
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
                                <span>Send Reset Link</span>
                            )}
                        </Button>
                        <div className='flex w-full justify-between'>
                            <Link
                                href='/login'
                                className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md py-2 text-sm font-medium text-primary underline-offset-4 ring-offset-background transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            >
                                Login
                            </Link>
                            <Link
                                href='/register'
                                className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md py-2 text-sm font-medium text-primary underline underline-offset-4 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            >
                                Register a new account
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </form>
    );
}