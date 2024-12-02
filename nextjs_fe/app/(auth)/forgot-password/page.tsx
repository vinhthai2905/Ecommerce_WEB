'use client';
import React, { useContext } from 'react';
import { AuthContext } from '@/components/Providers/AuthProvider';
import { useRouter } from 'next/navigation';
import ForgetPassword from '@/app/(auth)/forgot-password/ForgetPassword';

export default function Page() {
    const router = useRouter();
    const authContext = useContext(AuthContext);

    if (authContext.zToken) {
        router.push('/');
    }

    return (
        <div className='flex h-full w-full items-center justify-center'>
        <div className='h-max'>
            <ForgetPassword />
            </div>
            </div>
    );
}