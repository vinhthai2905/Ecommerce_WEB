'use client';
import React from 'react';
import Login from '@/app/(auth)/login/Login';

export default function Page() {
    return (
        <div className='flex h-full w-full items-center justify-center'>
            <div className='h-max'>
                <Login />
            </div>
        </div>
    );
}