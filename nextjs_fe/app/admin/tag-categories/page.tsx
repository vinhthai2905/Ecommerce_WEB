/* eslint-disable no-empty-pattern */

'use client';

import { DataTable } from '@/components/Table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import DataTitle from '@/components/Table/DataTitle';
import api from '@/lib/api';
import { TagCategories } from '@/core/model/tag';
import { APIResponse } from '@/core/model/api';
import { Pagination } from '@/core/model/pagination';
import { useSearchParams } from 'next/navigation';
import DataPagination from '@/components/Table/DataPagination';
import { DataLoading } from '@/components/Table/DataLoading';

type Props = {};

const columns: ColumnDef<TagCategories>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
            return <div>{(row.getValue('tags') as string[]).length}</div>;
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
];

export default function TagCategoriesPage({}: Props) {
    const [data, setData] = useState<TagCategories[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [isLoading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const res: APIResponse<TagCategories[]> =
                await api.fetchDataSearchAndPagination({
                    q: searchParams.get('q'),
                    page: searchParams.get('page'),
                    endpoint: '/tag-categories',
                });
            setData(res.data);
            setPagination(res.pagination);
            setLoading(false);
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