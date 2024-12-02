import { Comment } from '@/core/model/comment';

export interface Posts {
    id: number;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    tags: string[];
    comments: Comment[];
    source: string;
    slug: string;
    level: string;
    up_votes: number;
}