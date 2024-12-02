'use client';
import { DataLoading } from '@/components/Table/DataLoading';
import { DataTable } from '@/components/Table/DataTable';
import DataTitle from '@/components/Table/DataTitle';
import { useToast } from '@/hooks/use-toast';
import { APIResponse } from '@/core/model/api';
import { Comment } from '@/core/model/comment';
import api from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const columns: ColumnDef<Comment>[] = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'comment',
        header: 'Comment',
    },
    {
        accessorKey: 'parent_id',
        header: 'Parent Id',
    },
    {
        accessorKey: 'depth',
        header: 'Depth',
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

type Props = {
    params: {
        id: string;
    };
};
export default function Comments({ params }: Props) {
    const { id } = params;

    const [data, setData] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const posts: APIResponse<Comment[]> =
                await api.fetchDataSearchAndPagination({
                    q: searchParams.get('q'),
                    page: searchParams.get('page'),
                    endpoint: '/posts/' + id + '/comments',
                });
            setData(posts.data);
            setIsLoading(false);
        };

        fetchData();
    }, [searchParams]);

    const onDelete = async (commentId: string) => {
        try {
            const res = await api.deleteToServerAxios({
                endpoint: `posts/${id}/comments/${commentId}`,
            });

            if (res.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Comment deleted',
                });
                const newData = data.filter(
                    (item) => item.id !== Number(commentId)
                );
                setData(newData);
            }
        } catch (error) {}
    };

    return (
        <div className='flex w-full flex-col  gap-5'>
            <DataTitle isShowAdd={false} />
            {isLoading ? (
                <DataLoading columns={columns} />
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    isDelete={true}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}