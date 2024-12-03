'use client';
import SearchMobile from '@/app/(client)/search/SearchMobile';
import { Sparkles } from 'lucide-react';
import React from 'react';

export default function SearchUI() {
    return (
        <>
            <div className=' justify-top mt-10 hidden h-full w-full flex-col items-center gap-2 lg:flex'>
                <Sparkles size={64} />
                <p className='text-2xl font-bold'>
                    Ready to find the job of your dreams?
                </p>
                <p className='text-lg text-slate-500'>
                    Enter a search term above to get started.
                </p>
            </div>
            <div className='block lg:hidden'>
                <SearchMobile />
            </div>
        </>
    );
}