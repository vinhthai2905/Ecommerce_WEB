'use client';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/core/model/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function DataPagination({
                                           defaultPage,
                                           pagination,
                                       }: {
    defaultPage: number;
    pagination: Pagination;
}) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [page, setPage] = useState(defaultPage);

    // next page
    const nextPage = () => {
        const params = new URLSearchParams(searchParams);
        params.set('page', (page + 1).toString());
        setPage(page + 1);
        replace(`${pathname}?${params}`);
    };

    // previous page
    const prevPage = () => {
        const params = new URLSearchParams(searchParams);
        params.set('page', (page - 1).toString());
        setPage(page - 1);
        replace(`${pathname}?${params}`);
    };

    return (
        <div className='flex items-center justify-end space-x-2 py-4'>
            <Button
                variant='outline'
                size='sm'
                onClick={prevPage}
                disabled={pagination.current_page === 1}
            >
                Previous
            </Button>
            <Button
                variant='outline'
                size='sm'
                onClick={nextPage}
                disabled={pagination.last_page === defaultPage}
            >
                Next
            </Button>
        </div>
    );
}