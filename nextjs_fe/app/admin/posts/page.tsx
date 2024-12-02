'use client';

import { DataTable } from '@/components/Table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import DataTitle from '@/components/Table/DataTitle';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { APIResponse } from '@/core/model/api';
import { Posts } from '@/core/model/posts';
import DataPagination from '@/components/Table/DataPagination';
import { Pagination } from '@/core/model/pagination';
import { DataLoading } from '@/components/Table/DataLoading';

const columns: ColumnDef<Posts>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'content',
        header: 'Content',
        cell: ({ row }: { row: any }) => {
            return <div>{row.getValue('content').slice(0, 100) + '...'}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            return (
                <>
                    {new Date(row.getValue('created_at')).toLocaleTimeString()}{' '}
                    {new Date(row.getValue('created_at')).toLocaleDateString()}
                </>
            );
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: ({ row }) => {
            return (
                <>
                    {new Date(row.getValue('updated_at')).toLocaleTimeString()}{' '}
                    {new Date(row.getValue('updated_at')).toLocaleDateString()}
                </>
            );
        },
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
            return <div>{(row.getValue('tags') as string[]).join(', ')}</div>;
        },
    },
    {
        accessorKey: 'comments',
        header: 'Comments',
        cell: ({ row }) => {
            return <div>{(row.getValue('comments') as string[]).length}</div>;
        },
    },
];

export default function PostsPage() {
    const [data, setData] = useState<Posts[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const posts: APIResponse<Posts[]> =
                await api.fetchDataSearchAndPagination({
                    q: searchParams.get('q'),
                    page: searchParams.get('page'),
                    endpoint: '/posts',
                });
            setData(posts.data);
            setPagination(posts.pagination);
            setIsLoading(false);
        };

        fetchData();
    }, [searchParams]);

    return (
        <div className='flex w-full flex-col  gap-5'>
            <DataTitle />
            {isLoading ? (
                <DataLoading columns={columns} />
            ) : (
                <DataTable columns={columns} data={data} />
            )}
            {pagination && (
                <DataPagination
                    defaultPage={parseInt(searchParams.get('page') || '1')}
                    pagination={pagination}
                />
            )}
        </div>
    );
}