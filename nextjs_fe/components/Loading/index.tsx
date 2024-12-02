import React from 'react';
import { Loader2 } from 'lucide-react';

export default function index() {
    return (
        <div className='flex h-full w-full items-center justify-center'>
            <Loader2 className='h-10 w-10 animate-spin' />
        </div>
    );
}