import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react';

type CardProps = {
    label: string;
    icon: LucideIcon;
    amount: string;
};

export default function CardSumary(props: CardProps) {
    return (
        <CardContent>
            <section className='flex justify-between gap-2'>
                <p className='text-sm'>{props.label}</p>
                <props.icon className='h-4 w-4' />
            </section>
            <section className='flex flex-col gap-1'>
                <p className='text-2xl font-semibold'>{props.amount}</p>
            </section>
        </CardContent>
    );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={cn(
                'flex w-full flex-col gap-3 rounded-sm border bg-white p-4 shadow dark:border-[#383d48] dark:bg-[#1e2128] dark:text-white',
                props.className
            )}
        />
    );
}