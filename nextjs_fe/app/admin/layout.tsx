'use client';

import Loading from '@/components/Loading';
import { AuthContext } from '@/components/Providers/AuthProvider';
import { UnAuthorized } from '@/components/UnAuthorized';
import { redirect } from 'next/navigation';
import React, { useContext } from 'react';

const ROLE_ADMIN = 'admin';

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode;
}>) {
    const authContext = useContext(AuthContext);

    if (authContext.zToken === null) {
        redirect('/login');
    } else if (authContext.zUser === null) {
        return <Loading />;
    } else if (authContext.zUser?.role !== ROLE_ADMIN) {
        return <UnAuthorized />;
    } else {
        return (
            <div className='flex h-full w-full flex-col gap-4 py-4'>
                {children}
            </div>
        );
    }
}