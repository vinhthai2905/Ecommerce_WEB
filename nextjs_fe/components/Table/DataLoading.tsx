'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function DataLoading<TData, TValue>({
                                               columns,
                                           }: DataTableProps<TData, TValue>) {
    const data: TData[] = [];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <div className='rounded-md border dark:border-[#383d48]'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                                <TableHead colSpan={columns.length}>
                                    <div className='flex justify-center gap-2'>
                                        Actions
                                    </div>
                                </TableHead>
                            </TableRow>
                        ))}
                        {/* button actions view */}
                        <TableRow></TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className='dark:border-[#383d48]'>
                            {columns.map((column, index) => {
                                return (
                                    <TableCell
                                        className='h-24 text-center'
                                        key={index}
                                    >
                                        <Skeleton className='h-4 w-[80px]' />
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                <div className='flex justify-center gap-2'>
                                    <Skeleton className='h-10 w-20' />
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow className='dark:border-[#383d48]'>
                            {columns.map((column, index) => {
                                return (
                                    <TableCell
                                        className='h-24 text-center'
                                        key={index}
                                    >
                                        <Skeleton className='h-4 w-[80px]' />
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                <div className='flex justify-center gap-2'>
                                    <Skeleton className='h-10 w-20' />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}