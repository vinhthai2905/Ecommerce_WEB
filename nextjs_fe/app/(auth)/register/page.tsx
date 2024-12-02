'use client';
import Register from '@/app/(auth)/register/Register';
import React from 'react';

export default function Page() {
    return (
        <div className='flex h-full w-full items-center justify-center'>
            <div className='h-max'>
                <Register />
            </div>
        </div>
    );
}