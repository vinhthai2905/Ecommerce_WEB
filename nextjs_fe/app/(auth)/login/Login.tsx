'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Icons } from '@/components/Icons';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { formLoginSchema } from '@/app/(auth)/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api';
import axios from 'axios';
import { APIResponse } from '@/core/model/api';
import { UserToken } from '@/core/model/user';
import { setCookie } from 'cookies-next';
import { TIMEOUT_TOKEN_30_DAYS } from '@/core/constants/token';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/Providers/AuthProvider';
import { loginWithGithub } from '@/app/(auth)/provider/github';
import { loginWithGoogle } from '@/app/(auth)/provider/google';

export interface FormValues {
    username: string;
    password: string;
}

export default function Login() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formLoginSchema),
    });

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== process.env.NEXT_PUBLIC_BACKEND_URL) {
                return;
            }

            const data: UserToken = event.data.response;
            console.log(data);

            localStorage.setItem('user', JSON.stringify(data.user));

            setCookie('token', data.token, {
                maxAge: TIMEOUT_TOKEN_30_DAYS,
            });

            router.push('/onboarding');

            authContext.setZToken(data.token);
            authContext.setZUser(data.user);

            toast({
                title: 'Success',
                description: 'Login successful',
            });
        };

        window.addEventListener('message', onMessage, false);

        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, []);

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!isValid) return;
        setIsLoading(true);
        try {
            const res = await api.postToServerAxios({
                endpoint: '/login',
                data: data,
            });
            if (res.status === 200) {
                const response: APIResponse<UserToken> = res.data;

                localStorage.setItem(
                    'user',
                    JSON.stringify(response.data.user)
                );

                setCookie('token', response.data.token, {
                    maxAge: TIMEOUT_TOKEN_30_DAYS,
                });

                toast({
                    title: 'Success',
                    description: 'Login successful',
                });

                authContext.setZToken(response.data.token);
                authContext.setZUser(response.data.user);

                if (!response.data.user.verified) {
                    router.push('/verify');
                } else if (response.data.user.user_tags.length === 0) {
                    router.push('/onboarding');
                } else {
                    router.push('/');
                }
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
                    <CardTitle className='text-2xl'>
                        Login to your account
                    </CardTitle>
                    <CardDescription>
                        Enter username and password to login
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid grid-cols-2 gap-6'>
                        <a
                            className='inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            onClick={loginWithGithub}
                        >
                            <Icons.gitHub className='mr-2 h-4 w-4' />
                            Github
                        </a>
                        <a
                            className='inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            onClick={loginWithGoogle}
                        >
                            <Icons.google className='mr-2 h-4 w-4' />
                            Google
                        </a>
                    </div>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-background px-2 text-muted-foreground'>
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='username'>Username</Label>
                        <Input
                            id='username'
                            type='username'
                            placeholder='username'
                            {...register('username')}
                        />
                        {errors.username && (
                            <Label
                                htmlFor='username'
                                className='text-sm font-medium text-destructive text-red-500'
                            >
                                {errors.username.message}
                            </Label>
                        )}
                    </div>
                    <div className=' grid gap-2'>
                        <div className='relative'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type={isShowPassword ? 'text' : 'password'}
                                placeholder={
                                    isShowPassword ? 'password' : '********'
                                }
                                {...register('password')}
                            />
                            <a
                                className='absolute right-2 top-[50%] cursor-pointer'
                                onClick={togglePassword}
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
                                <span>Login</span>
                            )}
                        </Button>
                        <div className='flex w-full justify-between'>
                            <Link
                                href='/register'
                                className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md py-2 text-sm font-medium text-primary underline-offset-4 ring-offset-background transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            >
                                Register a new account
                            </Link>
                            <Link
                                href='/forgot-password'
                                className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md py-2 text-sm font-medium text-primary underline underline-offset-4 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </form>
    );
}