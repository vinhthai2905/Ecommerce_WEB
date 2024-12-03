'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { decodeUrlEncodedString } from '@/core/helper';
import { User } from '@/core/model/user';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
    params: {
        id: string;
    };
};
export default function Profile({ params }: Props) {
    const [infoProfile, setInfoProfile] = useState<User>();
    const decodedId: string = decodeUrlEncodedString(params.id);
    const router = useRouter();
    useEffect(() => {
        const getInfoProfile = async () => {
            try {
                const res = await api.getFromServerAxios({
                    endpoint: `/profile/${decodedId}`,
                });

                if (res.data) {
                    setInfoProfile(res.data.data);
                } else {
                    router.push('/404');
                }
            } catch (error) {
                router.push('/404');
            }
        };

        getInfoProfile();
    }, []);
    return (
        <div
            className={cn('flex w-full flex-col items-center justify-center')}
            style={{
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <div className='relative flex w-full flex-1  flex-col border-x p-4 dark:border-gray-600 lg:w-1/2'>
                <div className='flex h-max justify-between'>
                    <div className='flex h-full w-full flex-col gap-2'>
                        <h1 className='text-xl font-semibold'>Profile</h1>
                        {infoProfile ? (
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-start justify-between gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <img
                                            className='h-10 w-10 rounded-full'
                                            src={infoProfile.avatar}
                                            alt={infoProfile.username}
                                        />
                                        <div className='flex flex-col'>
                                            <span className='font-semibold'>
                                                {infoProfile.first_name}{' '}
                                                {infoProfile.last_name}
                                            </span>
                                            <span className='text-gray-500'>
                                                @{infoProfile.username}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex items-start gap-2'>
                                        Created at:{' '}
                                        <span>
                                            {new Date(
                                                infoProfile.created_at
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                {/* Tag flower count */}
                                <div className='flex items-center'>
                                    <span>Flower tags:</span>
                                    <span>{infoProfile.user_tags.length}</span>
                                </div>

                                {/* Bio */}
                                <div className='rounded-md border p-4 dark:border-gray-600'>
                                    <p>
                                        Bio:
                                        <span className=''>
                                            <ReactMarkdown>
                                                {infoProfile.bio
                                                    ? infoProfile.bio.replace(
                                                        /\\n/g,
                                                        '  \n'
                                                    )
                                                    : ''}
                                            </ReactMarkdown>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-start justify-between gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <Skeleton className='h-10 w-10 rounded-full' />
                                        <div className='flex flex-col'>
                                            <span className='flex items-center gap-2 font-semibold'>
                                                <Skeleton className='h-4 w-20' />
                                                <Skeleton className='h-4 w-20' />
                                            </span>
                                            <span className='flex items-center text-gray-500'>
                                                @
                                                <Skeleton className='h-4 w-10' />
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        Created at:{' '}
                                        <span>
                                            <Skeleton className='h-4 w-16' />
                                        </span>
                                    </div>
                                </div>

                                <div className='rounded-md border p-4 dark:border-gray-600'>
                                    <div>
                                        Bio:
                                        <span className='flex flex-col gap-2 pl-2 font-semibold'>
                                            <Skeleton className='h-4 w-[100%]' />
                                            <Skeleton className='h-4 w-[100%]' />
                                            <Skeleton className='h-4 w-[80%]' />
                                            <Skeleton className='h-4 w-[80%]' />
                                            <Skeleton className='h-4 w-[60%]' />
                                            <Skeleton className='h-4 w-[10%]' />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}