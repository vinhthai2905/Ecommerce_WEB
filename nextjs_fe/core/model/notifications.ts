import { User } from '@/core/model/user';

export interface Notifications {
    id: number;
    data: string;
    source?: string;
    read_at: boolean;
    user: User;
    created_at: null;
    updated_at: null;
}