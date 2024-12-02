/* eslint-disable no-empty-pattern */

'use client';

import  DataTable  from '@/components/Table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import DataTitle from '@/components/Table/DataTitle';
import api from '@/lib/api';
import { APIResponse } from '@/core/model/api';
import { Pagination } from '@/core/model/pagination';
import { useSearchParams } from 'next/navigation';
import DataPagination from '@/components/Table/DataPagination';
import { User, UserRoles } from '@/core/model/user';
import { DataLoading } from '@/components/Table/DataLoading';
import { Badge } from '@/components/ui/badge';

type Props = {};

const columns: ColumnDef<UserRoles>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'user',
        header: 'Full Name',
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2'>
                    <img
                        src={(row.getValue('user') as User).avatar}
                        alt='avatar'
                        className='h-8 w-8 rounded-sm'
                    />
                    {(row.getValue('user') as User).first_name}{' '}
                    {(row.getValue('user') as User).last_name}
                </div>
            );
        },
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            return (
                <Badge>{row.getValue('role') === 1 ? 'Admin' : 'Member'}</Badge>
            );
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

export default function UserRolesPage({}: Props) {
    const [data, setData] = useState<UserRoles[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const res: APIResponse<UserRoles[]> =
                await api.fetchDataSearchAndPagination({
                    q: searchParams.get('q'),
                    page: searchParams.get('page'),
                    endpoint: '/user-roles',
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