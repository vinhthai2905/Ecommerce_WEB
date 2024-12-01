import { Pagination } from '@/core/model/pagination';

export interface APIResponse<T> {
    success: boolean;
    data: T;
    status_code: number;
    message: string;
    errors: null;
    pagination?: Pagination;
}