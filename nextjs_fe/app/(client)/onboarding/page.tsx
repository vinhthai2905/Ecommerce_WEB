'use client';

import { AuthContext } from '@/components/Providers/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APIResponse } from '@/core/model/api';
import { Tags } from '@/core/model/tag';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

export default function Onboarding() {
    const [tags, setTags] = useState<Tags[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDisabled, setDisabled] = useState<boolean>(false);
    const { zUser } = useContext(AuthContext);
    const router = useRouter();

    const handleTagClick = (tag: number) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleFinish = async () => {
        setDisabled(true);

        try {
            const res = await api.postToServerAxios({
                endpoint: '/user-tags',
                data: {
                    tags: selectedTags,
                },
            });

            if (res.status === 200) {
                if (zUser) {
                    zUser.user_tags = [...selectedTags];
                    localStorage.setItem('user', JSON.stringify(zUser));
                }
            }
            router.push('/');
        } catch (e) {}
        setDisabled(false);
    };

    useEffect(() => {
        const fetchTags = async () => {
            const tags: APIResponse<Tags[]> = await api.fetchAllData({
                endpoint: '/tags',
            });

            setTags(tags.data);
            setIsLoading(false);
        };

        if (zUser) {
            if (zUser.user_tags.length > 0) {
                router.push('/');
            } else {
                fetchTags();
            }
        }
    }, [zUser]);

    return (
        <div className='h-full w-full pb-10 lg:pl-4 xl:pb-14'>
            <div className='flex justify-end py-5'>
                <Button
                    className='w-36'
                    onClick={handleFinish}
                    disabled={isDisabled}
                >
                    Finish
                </Button>
            </div>
            <h1 className='text-center text-xl font-bold md:text-2xl lg:text-4xl xl:text-6xl'>
                Set up your preferences <span role='img'>🚀</span>
            </h1>
            <p className='flex flex-col items-center justify-center py-4 text-xl xl:flex-row'>
                Pick tags for your feed.{' '}
                <span className='text-center'>
                    We will show you job postings based on your preferences.{' '}
                </span>
                <span>You can change this later in settings.</span>
            </p>
            {isLoading ? (
                <div className='flex h-full w-full justify-center'>
                    <Loader2 className='animate-spin items-center' size={64} />
                </div>
            ) : (
                <>
                    <div className='mt-4 flex flex-wrap justify-center gap-2'>
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag.id)}
                            >
                                <Badge
                                    className={cn(
                                        'rounded-full px-4 py-1',
                                        selectedTags.includes(tag.id) &&
                                        'bg-purple-500 text-white'
                                    )}
                                >
                                    {tag.name}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}