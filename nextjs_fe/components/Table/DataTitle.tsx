'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/debounce';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
    defaultSearch?: string;
    isShowAdd?: boolean;
    className?: string;
};

export default function DataTitle({
                                      defaultSearch = '',
                                      isShowAdd = true,
                                      className,
                                  }: Props) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(defaultSearch);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (search === '') {
            params.delete('q');
        } else {
            params.set('q', search);
        }
        // replace the search query
        replace(`${pathname}?${params}`);
    }, [debouncedSearch]);

    return (
        <>
            <div className='rounded-lg border bg-white p-4 pr-4 font-bold capitalize shadow dark:border-[#383d48] dark:bg-[#1e2128] dark:text-white'>
                {pathname.split('/').pop()?.replaceAll('-', ' ')}
            </div>
            <h1
                className={cn(
                    'flex items-center justify-between gap-2 p-1',
                    className
                )}
            >
                {/* Search */}
                <div className='w-full max-w-md'>
                    <div className='relative '>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Search'
                            className='pl-8'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {/* Add */}
                {isShowAdd && (
                    <Button
                        onClick={() => {
                            replace(`${pathname}/new`);
                        }}
                    >
                        Add new
                    </Button>
                )}
            </h1>
        </>
    );
}