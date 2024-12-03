'use client';

import InfiniteScrolling from '@/components/InfiniteScrolling';
import { SkeletonCardPosts } from '@/components/Skeletons/card';
import { APIResponse } from '@/core/model/api';
import { Pagination } from '@/core/model/pagination';
import { Posts } from '@/core/model/posts';
import api from '@/lib/api';
import { initPosts } from '@/lib/features/posts';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';

export default function Popular() {
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const dataPosts = useAppSelector((state) => state.posts.data);

    const fetchData = async (isLoadMore: boolean = false) => {
        if (!isLoadMore) {
            setLoading(true);
        }
        try {
            const res = await api.getFromServerAxios({
                endpoint: '/posts',
                params: {
                    page: pagination ? pagination.current_page + 1 : 1,
                    popular: true,
                },
            });
            const posts: APIResponse<Posts[]> = res.data;

            if (!isLoadMore) {
                dispatch(initPosts(posts.data));
            } else {
                dispatch(initPosts([...dataPosts, ...posts.data]));
            }

            setPagination(posts.pagination);
        } catch (error) {}
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='py-4'>
            {loading ? (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-8 3xl:grid-cols-5 4xl:grid-cols-6'>
                    <SkeletonCardPosts />
                    <SkeletonCardPosts />
                    <SkeletonCardPosts />
                    <SkeletonCardPosts />
                </div>
            ) : (
                <InfiniteScrolling
                    fetchData={fetchData}
                    data={dataPosts}
                    pagination={pagination}
                />
            )}
        </div>
    );
}