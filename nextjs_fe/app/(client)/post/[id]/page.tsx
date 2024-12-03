'use client';

import { APIResponse } from '@/core/model/api';
import api from '@/lib/api';
import React, { useEffect } from 'react';
import { Posts } from '@/core/model/posts';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import PostsDetail from '@/components/Posts/PostsDetail';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { initPosts } from '@/lib/features/posts';

type Props = {
    params: {
        id: string;
    };
};

export default function PostsPage({ params }: Props) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const dataPosts = useAppSelector((state) => state.posts.data);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.getFromServerAxios({
                    endpoint: `/posts/${id}`,
                });
                if (res.status === 200) {
                    const data: APIResponse<Posts> = res.data;
                    dispatch(initPosts([data.data]));
                }
            } catch (error) {
                router.push('/not-found');
            }
        };

        fetchPost();
    }, []);

    return (
        <div
            className={cn('flex w-full flex-col items-center justify-center')}
            style={{
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            {dataPosts.length > 0 && <PostsDetail data={dataPosts[0]} />}
        </div>
    );
}