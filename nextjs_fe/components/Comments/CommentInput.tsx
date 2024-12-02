'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
    replyId?: number;
    replyText?: string;
    commentId?: number;
    type?: 'comment' | 'reply' | 'edit' | 'delete';

    onPress?: (comment: Comment) => void;
};

export default function CommentInput({
                                         replyId,
                                         replyText,
                                         commentId,
                                         type,
                                         onPress,
                                     }: Props) {
    const [comment, setComment] = React.useState(
        replyText ? replyText + ' ' : ''
    );

    const pathname = usePathname();

    const handleComment = async () => {
        const postId = pathname.split('/').pop();

        try {
            const res = await api.postToServerAxios({
                endpoint: `posts/${postId}/comments`,
                data: {
                    comment,
                    parent_id: replyId || null,
                },
            });

            if (res.status === 201) {
                setComment('');
                // run onPress
                onPress && onPress(res.data.data);
            }
        } catch (error) {}
    };

    const handleEdit = async () => {
        const postId = pathname.split('/').pop();

        try {
            const res = await api.putToServerAxios({
                endpoint: `posts/${postId}/comments/${commentId}`,
                data: {
                    comment,
                },
            });

            if (res.status === 200) {
                setComment('');
                // run onPress
                onPress && onPress(res.data.data);
            }
        } catch (error) {}
    };

    const handleDelete = async () => {
        const postId = pathname.split('/').pop();

        try {
            const res = await api.deleteToServerAxios({
                endpoint: `posts/${postId}/comments/${commentId}`,
            });

            if (res.status === 200) {
                // run onPress
                onPress && onPress(res.data.data);
            }
        } catch (error) {}
    };

    return (
        <div className='mb-4 flex h-full w-full gap-2 rounded-md border p-4 dark:border-gray-600'>
            <Input
                placeholder='Write a comment...'
                value={comment}
                onChange={(e) => {
                    // if is replying, cant remove the @username
                    if (
                        type === 'reply' &&
                        e.target.value.length < (replyText + ' ').length
                    ) {
                        return;
                    }
                    setComment(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleComment();
                    }
                }}
            />
            <div className='flex justify-end'>
                <Button
                    className='lg:w-36'
                    onClick={() => {
                        if (type === 'edit') {
                            handleEdit();
                        } else if (type === 'delete') {
                            handleDelete();
                        } else {
                            handleComment();
                        }
                    }}
                >
                    {
                        {
                            comment: 'Comment',
                            reply: 'Reply',
                            edit: 'Edit',
                            delete: 'Delete',
                        }[type || 'comment']
                    }
                </Button>
            </div>
        </div>
    );
}