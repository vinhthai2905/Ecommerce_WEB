'use client';

import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function SearchOptions({ textSearch }: { textSearch: string }) {
    const { replace } = useRouter();
    const textEncoded = encodeURIComponent(textSearch);

    const handleSearch = () => {
        replace(`search?q=${textEncoded}`);
    };

    const handleAsk = () => {
        // text to HTML URL Encoding Reference
        replace(`search?provider=ask&text=${textEncoded}`);
    };
    return (
        <div>
            <div className='absolute flex w-full flex-col items-center rounded-b-[12px] border-0 bg-[#f5f8fc] px-3 py-2 dark:border-[#383d48] dark:bg-[#1c1f26] lg:h-auto lg:border-x lg:border-b'>
                <a
                    onClick={handleSearch}
                    className='flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-[12px] p-2 hover:bg-[#272B33]'
                >
                    {textSearch}{' '}
                    <span className='text-gray-500'>Search jobs</span>
                </a>
                <a
                    onClick={handleAsk}
                    className='flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-[12px] p-2 text-purple-500 hover:bg-[#272B33]'
                >
                    <Sparkles />
                    <span>{textSearch}</span>
                    <span className='text-gray-500'>
                        Ask a question with AI
                    </span>
                </a>
                <Separator className='my-4' />
                <div
                    onClick={() => {
                        console.log('clicked');
                    }}
                >
                    Posts on daily.zlynx.dev
                </div>
            </div>
        </div>
    );
}