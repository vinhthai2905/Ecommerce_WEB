'use client';

import InfiniteScrolling from '@/components/InfiniteScrolling';
import { SkeletonCardPosts } from '@/components/Skeletons/card';
import { APIResponse } from '@/core/model/api';
import { Pagination } from '@/core/model/pagination';
import { Posts } from '@/core/model/posts';
import api from '@/lib/api';
import { initPosts } from '@/lib/features/posts';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BookMarks() {
    const [pagination, setPagination] = useState<Pagination>();
    const dispatch = useAppDispatch();
    const dataPosts = useAppSelector((state) => state.posts.data);
    const [loading, setLoading] = useState(true);

    const fetchData = async (isLoadMore: boolean = false) => {
        try {
            const res = await api.getFromServerAxios({
                endpoint: '/bookmarks',
                params: {
                    page: pagination ? pagination.current_page + 1 : 1,
                },
            });
            const posts: APIResponse<Posts[]> = res.data;

            if (!isLoadMore) {
                dispatch(initPosts(posts.data));
            } else {
                dispatch(initPosts([...dataPosts, ...posts.data]));
            }

            setPagination(posts.pagination);
            setLoading(false);
        } catch (error) {}
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
                <>
                    {dataPosts.length > 0 ? (
                        <InfiniteScrolling
                            fetchData={fetchData}
                            data={dataPosts}
                            pagination={pagination}
                        />
                    ) : (
                        <div className='flex h-full w-full flex-col text-center text-2xl'>
                            <Bookmark className='mx-auto h-40 w-40 text-gray-500 lg:h-80 lg:w-80' />
                            <div className='mb-4 text-2xl font-bold text-gray-500 lg:text-4xl'>
                                Your bookmark list is empty.
                            </div>
                            <span className='text-sm text-gray-600'>
                                Go back to your feed and bookmark posts you’d
                                like to keep or read later. Each post you
                                bookmark will be stored here.
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}