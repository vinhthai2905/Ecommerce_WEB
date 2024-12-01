export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    bio?: string;
    email: string;
    avatar: string;
    verified: boolean;
    role: string;
    bookmarks: number[];
    user_tags: number[];
    created_at: Date;
    updated_at: Date;
}

export interface UserUpdate {
    first_name?: string;
    last_name?: string;
    email?: string;
    bio?: string;
    avatar?: File;
}

export interface UserToken {
    user: User;
    token: string;
}

export interface UserRoles {
    id: number;
    role: number;
    user: User;
    created_at: Date;
    updated_at: Date;
}