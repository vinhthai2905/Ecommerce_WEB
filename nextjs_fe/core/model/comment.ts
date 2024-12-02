import { User } from '@/core/model/user';

export interface Comment {
    id: number;
    parent_id: number | null;
    depth: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
    user: User;
}

export interface CommentWithReplies extends Comment {
    replies: CommentWithReplies[];
}

export const buildCommentTree = (comments: Comment[]): CommentWithReplies[] => {
    const commentMap: { [key: number]: CommentWithReplies } = {};
    const roots: CommentWithReplies[] = [];

    comments.forEach((comment) => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
        if (comment.parent_id === null) {
            roots.push(commentMap[comment.id]);
        } else if (commentMap[comment.parent_id]) {
            commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
        }
    });

    return roots;
};

// add a new comment to the comment tree
export const addCommentToTree = (
    comment: Comment,
    commentTree: CommentWithReplies[]
): CommentWithReplies[] => {
    if (!comment.parent_id) {
        // If it's a new comment, add it to the root level
        return [...commentTree, { ...comment, replies: [] }];
    }

    return commentTree.map((c) => {
        if (c.id === comment.parent_id) {
            return {
                ...c,
                replies: [...c.replies, { ...comment, replies: [] }],
            };
        }

        return {
            ...c,
            replies: addCommentToTree(comment, c.replies),
        };
    });
};