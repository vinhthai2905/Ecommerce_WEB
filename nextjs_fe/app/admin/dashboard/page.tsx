import CardSumary, { CardContent } from '@/components/Card/CardSumary';
import BarChart from '@/components/Chart/BarChart';
import { APIResponse } from '@/core/model/api';
import api from '@/lib/api';
import { Library, Tag, Users } from 'lucide-react';
import { cookies } from 'next/headers';
import React from 'react';

async function getDashBoard() {
    const res = await api.getFromServer({
        endpoint: '/dashboard',
        headers: {
            Authorization: `Bearer ${cookies().get('token')?.value}`,
        },
        params: {
            cache: 'no-store',
        },
    });
    return res.json();
}

function mapIcon(icon: string) {
    switch (icon) {
        case 'Library':
            return Library;
        case 'Tag':
            return Tag;
        case 'Users':
            return Users;
        default:
            return Users;
    }
}

type CardResponse = {
    label: string;
    icon: string;
    amount: string;
};
type Data = {
    card: CardResponse[];
    crawler: {
        time: string;
        total: string;
    }[];
};
export default async function page() {
    const res = await getDashBoard();
    const response: APIResponse<Data> = res;

    console.log(response.data.crawler);
    return (
        <div className='flex h-full w-full flex-col  gap-5'>
            <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
                {response.data.card.map((d, i) => (
                    <CardSumary
                        key={i}
                        amount={d.amount}
                        icon={mapIcon(d.icon)}
                        label={d.label}
                    />
                ))}
            </section>
            <section className='grid h-full  grid-cols-1 gap-4 transition-all'>
                <CardContent>
                    <p className='p-4 font-semibold'>
                        Overview of crawled data
                    </p>
                    <BarChart data={response.data.crawler} />
                </CardContent>
            </section>
        </div>
    );
}