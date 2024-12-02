'use client';
/* eslint-disable no-empty-pattern */

import React from 'react';
import {
    BarChart as BarGraph,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Bar,
} from 'recharts';

type Props = {
    data: {
        time: string;
        total: string; // Update the type of 'total' to number
    }[];
};

export default function BarChart({ data }: Props) {
    const newData = data.map((d) => {
        return {
            ...d,
            total: parseInt(d.total),
        };
    });

    return (
        <ResponsiveContainer width={'100%'} height={500}>
            <BarGraph data={newData}>
                <XAxis
                    dataKey={'time'}
                    tickLine={false}
                    axisLine={false}
                    stroke='#888888'
                    fontSize={12}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke='#888888'
                    fontSize={12}
                    tickFormatter={(value) => `Post ${value}`}
                />
                <Bar dataKey={'total'} radius={[4, 4, 0, 0]} />
            </BarGraph>
        </ResponsiveContainer>
    );
}