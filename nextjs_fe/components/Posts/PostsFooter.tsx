'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, BookMarked, MessageCircle, Share2 } from 'lucide-react';
import { addBookMark, deleteBookMark } from '@/lib/features/bookmark';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/hooks';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Posts } from '@/core/model/posts';
import api from '@/lib/api';
import { initPosts } from '@/lib/features/posts';

type Props = {
    data: Posts;
    className?: string;
};

export default function PostsFooter({ data, className }: Props) {
    const bookmarks = useAppSelector((state) => state.bookmarks.data);
    const dataPosts = useAppSelector((state) => state.posts.data);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const router = useRouter();

    const onUpVote = async () => {
        // upvote

        try {
            const res = await api.postToServerAxios({
                endpoint: `/posts/${data.id}/upvote`,
            });

            if (res.status === 200) {
                toast({
                    title: 'Upvoted',
                    description: 'Post has been upvoted',
                });

                // update the upvotes in the post
                const index = dataPosts.findIndex(
                    (_data) => _data.id === data.id
                );
                dispatch(
                    initPosts([
                        ...dataPosts.slice(0, index),
                        {
                            ...data,
                            up_votes: data.up_votes + 1,
                        },
                        ...dataPosts.slice(index + 1),
                    ])
                );
            }
            if (res.status === 204) {
                toast({
                    title: 'Upvoted',
                    description: 'Post has been un upvoted',
                });

                // update the upvotes in the post
                const index = dataPosts.findIndex(
                    (_data) => _data.id === data.id
                );
                dispatch(
                    initPosts([
                        ...dataPosts.slice(0, index),
                        {
                            ...data,
                            up_votes: data.up_votes - 1,
                        },
                        ...dataPosts.slice(index + 1),
                    ])
                );
            }
        } catch (error) {}
    };

    const onComment = () => {
        router.push('/post/' + data.slug);
    };

    const onBookmark = async () => {
        // bookmark
        try {
            const res = await api.postToServerAxios({
                endpoint: `/posts/${data.id}/bookmark`,
            });

            if (res.status === 200) {
                toast({
                    title: 'Bookmarked',
                    description: 'Post has been bookmarked',
                });

                dispatch(addBookMark(data.id));
            }

            if (res.status === 204) {
                toast({
                    title: 'Bookmarked',
                    description: 'Post has been un bookmarked',
                });

                dispatch(deleteBookMark(data.id));
            }
        } catch (error) {}
    };

    const onShare = () => {
        // copy to clipboard
        navigator.clipboard.writeText(
            'https://daily.zlynx.dev/post/' + data.slug
        );

        toast({
            title: 'Copied to clipboard',
            description: 'Link copied to clipboard',
        });
    };

    return (
        <div className={cn('justify-end')}>
            <div
                className={cn(
                    'flex items-center justify-between border-t px-4 py-1 dark:border-gray-600',
                    className
                )}
            >
                <Button variant={'ghost'} onClick={onUpVote}>
                    <div className='flex gap-2'>
                        <ArrowUp size={20} />
                        <span>{data.up_votes}</span>
                    </div>
                </Button>
                <Button variant={'ghost'} onClick={onComment}>
                    <div className='flex gap-2'>
                        <MessageCircle size={20} />
                        <span>{data.comments.length}</span>
                    </div>
                </Button>
                <Button variant={'ghost'} onClick={onBookmark}>
                    <BookMarked
                        size={20}
                        className={cn(
                            bookmarks.some((_data) => _data === data.id) &&
                            'text-yellow-600'
                        )}
                    />
                </Button>
                <Button variant={'ghost'} onClick={onShare}>
                    <Share2 size={20} />
                </Button>
            </div>
        </div>
    );
}