'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import React, { useEffect, useState } from 'react';
import Form from '@/app/admin/tags/form';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TagCategories } from '@/core/model/tag';
import api from '@/lib/api';
import axios from 'axios';

type FormValues = {
    name: string;
    tag_category_id: number;
};

const formSchema = z.object({
    name: z.string().nonempty('Name is required'),
    tag_category_id: z.number().int('Tag category is required'),
});

export default function TagsNewPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [tagCategories, setTagCategories] = useState<TagCategories[]>([]);
    const { toast } = useToast();
    const { replace } = useRouter();
    const pathname = usePathname();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getFromServerAxios({
                    endpoint: '/tag-categories',
                });

                if (res.status === 200) {
                    setTagCategories(res.data.data);
                }
            } catch (err) {}
        };

        fetchData();
    }, []);
    const onSubmit = async (data: FormValues) => {
        if (!isValid) return;
        setIsLoading(true);
        try {
            const res = await api.postToServerAxios({
                endpoint: '/tags',
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
            <h1 className='text-2xl font-semibold'>New Tag</h1>
            <Form
                title='Create Tag'
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                errors={errors}
                register={register}
                isLoading={isLoading}
                tagCategories={tagCategories}
                setValue={setValue}
                getValues={getValues}
            />
        </>
    );
}