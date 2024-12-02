import CommentInput from '@/components/Comments/CommentInput';
import { AuthContext } from '@/components/Providers/AuthProvider';
import {
    Comment,
    CommentWithReplies,
    addCommentToTree,
    buildCommentTree,
} from '@/core/model/comment';
import { cn } from '@/lib/utils';
import React, { useContext } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { usePathname } from 'next/navigation';

const CommentComponent: React.FC<{
    comment: CommentWithReplies;
    onUpdateCommentTree: (
        type: 'comment' | 'reply' | 'edit' | 'delete',
        comment: Comment
    ) => void;
}> = ({ comment, onUpdateCommentTree }) => {
    const pathname = usePathname();

    const [isReplying, setIsReplying] = React.useState(false);
    const [typeComment, setTypeComment] = React.useState<
        'comment' | 'reply' | 'edit' | 'delete'
    >('comment');

    const authUser = useContext(AuthContext).zUser;

    const handleReply = (comment: Comment) => {
        setTypeComment('comment');
        setIsReplying(false);
        // add comment to the comment tree
        onUpdateCommentTree(typeComment, comment);
    };

    const handleDelete = async (comment: Comment) => {
        const postId = pathname.split('/').pop();

        try {
            const res = await api.deleteToServerAxios({
                endpoint: `posts/${postId}/comments/${comment.id}`,
            });

            if (res.status === 200) {
                onUpdateCommentTree('delete', comment);
            }
        } catch (error) {}
    };

    return (
        <div
            key={comment.id}
            className={cn(
                `flex flex-col gap-2 rounded-md border p-4 dark:border-gray-600 ml-${comment.depth * 4}`
            )}
        >
            <div className='flex gap-2'>
                <img
                    src={comment.user.avatar}
                    alt='profile image'
                    className='h-10 w-10 rounded-md'
                />
                <div className='flex flex-col'>
                    <a
                        href={`/profile/@${comment.user.username}`}
                        className='text-sm font-semibold'
                    >
                        {comment.user.first_name} {comment.user.last_name}
                    </a>
                    <p className='text-xs text-gray-500 dark:text-gray-300'>
                        {new Date(comment.created_at).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: '2-digit' }
                        )}
                        <span> • </span>
                        {new Date(
                            new Date().getTime() -
                            new Date(comment.created_at).getTime()
                        ).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            </div>
            <div className='text-sm'>{comment.comment}</div>

            {/* button rep */}
            <div className='flex flex-col items-start gap-2 border-t pt-2 dark:border-t-gray-600'>
                <div className='flex gap-2'>
                    <Button
                        variant='ghost'
                        onClick={() => {
                            setIsReplying(!isReplying);
                            setTypeComment('reply');
                        }}
                    >
                        Reply
                    </Button>
                    {comment.user.id === authUser?.id && (
                        <>
                            <Button
                                variant='ghost'
                                onClick={() => {
                                    setIsReplying(!isReplying);
                                    setTypeComment('edit');
                                }}
                            >
                                Edit
                            </Button>
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant='destructive'>
                                        Delete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='sm:max-w-md'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Are you sure you want to delete this
                                            comment?
                                        </DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className='flex items-center justify-between'>
                                        <DialogClose asChild>
                                            <Button
                                                type='button'
                                                variant='secondary'
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button
                                                variant='destructive'
                                                onClick={() =>
                                                    handleDelete(comment)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
                {
                    // reply input
                    isReplying && (
                        <CommentInput
                            onPress={(e) =>
                                handleReply(e as unknown as Comment)
                            }
                            replyId={comment.id}
                            replyText={
                                typeComment === 'reply'
                                    ? `@${comment.user.username}`
                                    : typeComment === 'edit'
                                        ? comment.comment
                                        : ''
                            }
                            commentId={comment.id}
                            type={typeComment}
                        />
                    )
                }
            </div>

            {comment.replies.length > 0 && (
                <div className='mt-2 flex flex-col gap-2'>
                    {comment.replies.map((reply) => (
                        <CommentComponent
                            key={reply.id}
                            comment={reply}
                            onUpdateCommentTree={onUpdateCommentTree}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentsList: React.FC<{ comments: Comment[] }> = ({ comments }) => {
    const [commentTree, setCommentTree] = React.useState<CommentWithReplies[]>(
        buildCommentTree(comments)
    );

    console.log(commentTree);

    const handleAddComment = (
        type: 'comment' | 'reply' | 'edit' | 'delete',
        newComment: Comment
    ) => {
        if (!newComment.parent_id && type === 'comment') {
            // If it's a new comment, add it to the root level
            setCommentTree([...commentTree, { ...newComment, replies: [] }]);
        } else if (type === 'edit') {
            const newCommentTree = commentTree.map((c) => {
                if (c.id === newComment.id) {
                    return {
                        ...c,
                        comment: newComment.comment,
                    };
                }
                return c;
            });

            // filter in comment replies
            const filterReplies = (comment: CommentWithReplies) => {
                comment.replies = comment.replies.map((c) => {
                    if (c.id === newComment.id) {
                        return {
                            ...c,
                            comment: newComment.comment,
                        };
                    }
                    return c;
                });
                comment.replies.forEach(filterReplies);
            };

            newCommentTree.forEach(filterReplies);

            setCommentTree(newCommentTree);
        } else if (type === 'delete') {
            const newCommentTree = commentTree.filter(
                (c) => c.id !== newComment.id
            );
            // filter in comment replies
            const filterReplies = (comment: CommentWithReplies) => {
                comment.replies = comment.replies.filter(
                    (c) => c.id !== newComment.id
                );
                comment.replies.forEach(filterReplies);
            };

            newCommentTree.forEach(filterReplies);
            setCommentTree(newCommentTree);
        } else {
            const newCommentTree = addCommentToTree(newComment, commentTree);
            console.log(newCommentTree);
            setCommentTree(newCommentTree);
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            <CommentInput
                onPress={(e) =>
                    handleAddComment('comment', e as unknown as Comment)
                }
            />
            {commentTree.map((comment) => (
                <CommentComponent
                    key={comment.id}
                    comment={comment}
                    onUpdateCommentTree={(
                        type: 'comment' | 'reply' | 'edit' | 'delete',
                        e: Comment
                    ) => handleAddComment(type, e as unknown as Comment)}
                />
            ))}
        </div>
    );
};

export default CommentsList;