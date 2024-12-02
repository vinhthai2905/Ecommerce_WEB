
import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import PostsFooter from '@/components/Posts/PostsFooter';
import { Posts } from '@/core/model/posts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CommentsList from '@/components/Comments/Comment';

type Props = {
    data: Posts;
};

export default function PostsDetail({ data }: Props) {
    return (
        <div className='relative flex flex-1 flex-col  border-x p-4 dark:border-gray-600 lg:w-1/2'>
            <div className='flex h-max justify-between '>
                <div className='flex items-center gap-2'>
                    <Image
                        src={'/images/default.jpg'}
                        alt='profile image'
                        className='rounded-md'
                        width={40}
                        height={40}
                    />
                    <div>
                        <span className='text-sm font-semibold'>Admin</span>
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
                </div>
                <div className='flex items-center gap-2'>
                    <Badge className='h-10 w-24 truncate rounded-full text-center'>
                        <span className='w-full'>{data.level}</span>
                    </Badge>
                    <Button
                        variant={`link`}
                        className='h-10 truncate rounded-full'
                    >
                        <a href={`${data.source}`}>Source</a>
                    </Button>
                </div>
            </div>
            <div></div>
            <h1 className='py-2 font-bold'>{data.title}</h1>

            <div className='mb-4 space-y-2 border-l-2 border-purple-500 pl-4'>
                <ReactMarkdown>
                    {data.content.replace(/\\n/g, '  \n')}
                </ReactMarkdown>
            </div>

            <div className='flex w-full flex-wrap gap-2 pb-4'>
                {data.tags.map((tag, index) => (
                    <Badge className='w-max' key={index}>
                        <Link
                            href={`/tags/${tag}`}
                            className='w-max'
                            key={index}
                        >
                            # {tag}
                        </Link>
                    </Badge>
                ))}
            </div>

            <div className='rounded-md border-x border-b dark:border-gray-600'>
                <PostsFooter data={data} className='rounded-md' />
            </div>
            <div className='px-2 py-5'>
                <CommentsList comments={data.comments} />
            </div>
        </div>
    );
}
