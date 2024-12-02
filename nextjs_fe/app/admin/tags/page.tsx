/* eslint-disable no-empty-pattern */

'use client';

import { DataTable } from '@/components/Table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import DataTitle from '@/components/Table/DataTitle';
import api from '@/lib/api';
import { Tags } from '@/core/model/tag';
import { APIResponse } from '@/core/model/api';
import { Pagination } from '@/core/model/pagination';
import { useSearchParams } from 'next/navigation';
import DataPagination from '@/components/Table/DataPagination';
import { DataLoading } from '@/components/Table/DataLoading';

type Props = {};

const columns: ColumnDef<Tags>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'tag_category_id',
        header: 'Tag Category ID',
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

export default function TagsPage({}: Props) {
    const [data, setData] = useState<Tags[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const res: APIResponse<Tags[]> =
                await api.fetchDataSearchAndPagination({
                    q: searchParams.get('q'),
                    page: searchParams.get('page'),
                    endpoint: '/tags',
                });
            setData(res.data);
            setPagination(res.pagination);
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