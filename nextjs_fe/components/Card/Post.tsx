'use client';

import ReactMarkdown from 'react-markdown';
import { Posts } from '@/core/model/posts';
import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import PostsFooter from '@/components/Posts/PostsFooter';

export default function PostCard({ data }: { data: Posts }) {
    const contentWithLineBreaks =
        data.content.replace(/\\n/g, '  \n').slice(0, 150) + ' .....';

    return (
        <div className='flex h-[392px] flex-col rounded-sm border shadow-lg dark:border-gray-600 md:w-[318px] lg:w-full'>
            <main className='relative flex-1 truncate'>
                {/* Link overider all this div */}
                <Link
                    href={`/post/${data.slug}`}
                    className='absolute h-full w-full'
                ></Link>
                <section className='flex h-full flex-col gap-2 p-4 pb-4'>
                    <div className='flex justify-between'>
                        <Image
                            src={'/images/default.jpg'}
                            alt={data.title}
                            className='rounded-full'
                            width={40}
                            height={40}
                        />
                        <Badge className='h-10 w-16 truncate rounded-full text-center'>
                            <span className='w-full'>{data.level}</span>
                        </Badge>
                    </div>
                    <h1 className='truncate text-lg font-semibold'>
                        {data.title}
                    </h1>
                    <div className='flex gap-2'>
                        {/* if tags > 2 */}
                        {data.tags.length > 2 ? (
                            <>
                                <Badge className='w-max' key={data.tags[0]}>
                                    <span className='w-max' key={data.tags[0]}>
                                        # {data.tags[0]}
                                    </span>
                                </Badge>
                                <Badge className='w-max'>
                                    <span className='w-max'>
                                        + {data.tags.length} Other
                                    </span>
                                </Badge>
                            </>
                        ) : (
                            <>
                                {data.tags.map((tag, index) => (
                                    <Badge className='w-max' key={index}>
                                        <span className='w-max' key={index}>
                                            # {tag}
                                        </span>
                                    </Badge>
                                ))}{' '}
                            </>
                        )}
                    </div>
                    <div>
                        <p className='text-sm text-gray-500 dark:text-gray-300'>
                            {new Date(data.created_at).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: '2-digit',
                                }
                            )}
                            <span> • </span>
                            {new Date(
                                new Date().getTime() -
                                new Date(data.created_at).getTime()
                            ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <div className='w-full space-y-2 truncate'>
                        <ReactMarkdown className={`text-ellipsis`}>
                            {contentWithLineBreaks}
                        </ReactMarkdown>
                    </div>
                </section>
            </main>
            <PostsFooter data={data} />
        </div>
    );
}