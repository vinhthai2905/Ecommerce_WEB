'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import React, { useState } from 'react';
import Form from '@/app/admin/tag-categories/form';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

type FormValues = {
    name: string;
};

const formSchema = z.object({
    name: z.string().nonempty('Name is required'),
});

export default function TagCategoriesNewPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { replace } = useRouter();
    const pathname = usePathname();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        if (!isValid) return;
        setIsLoading(true);

        try {
            const res = await api.postToServerAxios({
                endpoint: '/tag-categories',
                data: data,
            });
            if (res.status === 201) {
                replace(pathname.replace('/new', `/`));
                toast({
                    title: 'Success',
                    description: res.data.message,
                });
            }
        } catch (err) {
            if (err instanceof axios.AxiosError) {
                toast({
                    title: 'Error',
                    description: err.response?.data.message,
                });
            }
        }
        setIsLoading(false);
    };

    return (
        <>
            <CrudTitle />
            <h1 className='text-2xl font-semibold'>New Tag Category</h1>
            <Form
                title='Create Tag Category'
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </>
    );
}