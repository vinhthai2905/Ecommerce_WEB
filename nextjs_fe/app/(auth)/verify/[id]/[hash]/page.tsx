'use client';

import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

type Props = {
    params: {
        id: string;
        hash: string;
    };
};
export default function Verifyed({ params }: Props) {
    const { id, hash } = params;
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const verified = async () => {
            try {
                const res = await api.getFromServerAxios({
                    endpoint: `/email/verify/${id}/${hash}?expires=${searchParams.get('expires')}&signature=${searchParams.get('signature')}`,
                });

                if (res.status === 200) {
                    toast({
                        title: 'Success',
                        description: res.data.message,
                    });
                    router.push('/onboarding');
                }
            } catch (e) {}
        };
        verified();
    }, []);

    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='text-center'>
                <h1 className='text-2xl font-bold'>Verifying...</h1>
            </div>
        </div>
    );
}