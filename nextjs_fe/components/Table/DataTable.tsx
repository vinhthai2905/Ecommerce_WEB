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
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isDelete?: boolean;
    onDelete?: (id: string) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             isDelete,
                                             onDelete,
                                         }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    const { replace } = useRouter();
    const pathname = usePathname();

    return (
        <div>
            <div className='rounded-md border dark:border-[#383d48]'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className='font-bold'
                                        >
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
                                    <div className='flex justify-center gap-2 font-bold'>
                                        Actions
                                    </div>
                                </TableHead>
                            </TableRow>
                        ))}
                        {/* button actions view */}
                        <TableRow></TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className='dark:border-[#383d48]'
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <div className='flex justify-center gap-2'>
                                            <Button
                                                variant={
                                                    isDelete
                                                        ? 'destructive'
                                                        : 'default'
                                                }
                                                className='w-20'
                                                onClick={() => {
                                                    if (isDelete) {
                                                        onDelete &&
                                                        onDelete(
                                                            (
                                                                row.original as {
                                                                    id: string;
                                                                }
                                                            ).id
                                                        );
                                                    } else {
                                                        replace(
                                                            `${pathname}/${
                                                                (
                                                                    row.original as {
                                                                        id: string;
                                                                    }
                                                                ).id
                                                            }`
                                                        );
                                                    }
                                                }}
                                            >
                                                {isDelete ? 'Delete' : 'View'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}