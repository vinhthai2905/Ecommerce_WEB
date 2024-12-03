'use client';
import SearchUI from '@/app/(client)/search/SearchUI';
import PostCard from '@/components/Card/Post';
import { SkeletonCardPosts } from '@/components/Skeletons/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Posts } from '@/core/model/posts';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Search() {
    const searchParams = useSearchParams();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [progress, setProgress] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [prompt, setPrompt] = React.useState('');
    const [data, setData] = React.useState('');
    const [posts, setPosts] = React.useState<Posts[]>([]);

    useEffect(() => {
        // clear progress and set isLoaded to false search prompt
        setSearch('');
        setPrompt('');

        const q = searchParams.get('q');
        const provider = searchParams.get('provider');

        if (provider) {
            const text = searchParams.get('text');
            if (text) {
                setProgress(10);
                setPrompt(text);
                setIsLoaded(true);
            }
        } else if (q) {
            setSearch(q);
            setIsLoaded(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (search !== '') {
            const searchApi = async () => {
                const res = await api.getFromServerAxios({
                    endpoint: `/search?q=${search}`,
                });
                if (res.status === 200) {
                    setPosts(res.data.data);
                    setIsLoaded(false);
                }
            };
            searchApi();
        }

        if (prompt !== '') {
            const promptApi = async () => {
                const interval = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= 100) {
                            return 0;
                        }
                        // random progress 10-20
                        return prev + Math.floor(Math.random() * 10) + 10;
                    });
                }, 1500);

                // set isLoaded again
                const res = await api.getFromServerAxios({
                    endpoint: `/search?provider=ask&q=${prompt}`,
                });
                if (res.status === 200) {
                    setData(res.data.data);
                    setIsLoaded(false);
                    setProgress(100);
                    clearInterval(interval);
                }
            };
            promptApi();
        }
    }, [prompt, search]);

    return (
        <div className='h-full w-full pt-4'>
            {prompt !== '' ? (
                <div className='flex h-full w-full flex-col gap-4'>
                    <Progress value={progress} className='w-full lg:w-[60%]' />
                    <div className='flex h-max w-full flex-col gap-2 rounded-md border p-4'>
                        {isLoaded ? (
                            <>
                                <Skeleton className='h-[13px] w-full' />
                                <Skeleton className='h-[13px] w-full' />
                                <Skeleton className='h-[13px] w-full' />
                                <Skeleton className='h-[13px] w-full' />
                                <Skeleton className='h-[13px] w-[60%]' />
                                <Skeleton className='h-[13px] w-[60%]' />
                                <Skeleton className='h-[13px] w-[40%]' />
                            </>
                        ) : (
                            <div className='flex h-full flex-col gap-2'>
                                <div className='flex flex-col gap-2 lg:flex-row'>
                                    <img
                                        src='/images/default.jpg'
                                        className='h-10 w-10 rounded-sm'
                                    />
                                    {/* Data api out mdx */}
                                    <div className='h-max'>
                                        Source: <span>daily.zlynx.dev</span>
                                    </div>
                                </div>
                                <ReactMarkdown>{data}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {search === '' ? (
                        <SearchUI />
                    ) : (
                        <>
                            {isLoaded ? (
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-8 3xl:grid-cols-5 4xl:grid-cols-6'>
                                    <SkeletonCardPosts />
                                    <SkeletonCardPosts />
                                    <SkeletonCardPosts />
                                    <SkeletonCardPosts />
                                </div>
                            ) : (
                                <>
                                    {posts.length === 0 ? (
                                        <></>
                                    ) : (
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-8 3xl:grid-cols-5 4xl:grid-cols-6'>
                                            {posts.map((item, index) => (
                                                <PostCard
                                                    data={item}
                                                    key={index}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}