'use client';

import { DataTable } from '@/components/Table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import DataTitle from '@/components/Table/DataTitle';
import api from '@/lib/api';
import { User } from '@/core/model/user';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { APIResponse } from '@/core/model/api';
import { useSearchParams } from 'next/navigation';
import { DataLoading } from '@/components/Table/DataLoading';
import { Pagination } from '@/core/model/pagination';
import DataPagination from '@/components/Table/DataPagination';
import { Badge } from '@/components/ui/badge';

const columns: ColumnDef<User>[] = [
    {
        header: 'Name',
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2'>
                    <img
                        className='h-10 w-10 rounded-md'
                        src={row.original.avatar}
                        alt='user-image'
                    />
                    <p>
                        {row.original.first_name} {row.original.last_name}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'username',
        header: 'Username',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'verified',
        header: 'Verified',
        cell: ({ row }) => {
            return row.getValue('verified') ? <Check /> : <X />;
        },
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            return (
                <Badge>
                    {row.getValue('role') === 'admin' ? 'Admin' : 'Member'}
                </Badge>
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
                    {new Date(row.getValue('created_at')).toLocaleTimeString()}{' '}
                    {new Date(row.getValue('created_at')).toLocaleDateString()}
                </>
            );
        },
    },
];

export default function UsersPage() {
    const [data, setData] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const users: APIResponse<User[]> =
                await api.fetchDataSearchAndPagination({
                    q: searchParams.get('q'),
                    page: searchParams.get('page'),
                    endpoint: '/users',
                });
            setData(users.data);
            setPagination(users.pagination);
            setIsLoading(false);
        };
        fetchData();
    }, [searchParams]);

    return (
        <div className='flex w-full flex-col  gap-5'>
            <DataTitle defaultSearch={searchParams.get('q') || ''} />
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