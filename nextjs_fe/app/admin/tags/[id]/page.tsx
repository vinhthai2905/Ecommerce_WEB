'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import { APIResponse } from '@/core/model/api';
import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { TagCategories, Tags } from '@/core/model/tag';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/app/admin/tags/form';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

type Props = {
    params: {
        id: string;
    };
};

type FormValues = {
    name: string;
    tag_category_id: number;
};

const formSchema = z.object({
    name: z.string().nonempty('Name is required'),
    tag_category_id: z.number().int('Tag category is required'),
});

export default function Page({ params }: Props) {
    const { id } = params;

    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState<Tags | null>(null);
    const [tagCategories, setTagCategories] = useState<TagCategories[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const { replace } = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

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

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!isValid) return;
        setIsLoading(true);

        try {
            const res = await api.putToServerAxios({
                endpoint: `/tags/${id}`,
                data: data,
            });
            if (res.status === 200) {
                replace(pathname.replace(`/${id}`, ''));
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

    const onDelete = async () => {
        try {
            const res = await api.deleteToServerAxios({
                endpoint: `/tags/${id}`,
            });
            if (res.status === 200) {
                replace(pathname.replace(`/${id}`, ''));
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
    };

    useEffect(() => {
        const fetchTags = async () => {
            // Fetch post by id
            try {
                const response = await api.getFromServerAxios({
                    endpoint: `/tags/${id}`,
                });
                const tags: APIResponse<Tags> = response.data;
                setTags(tags.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
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

        fetchTags();
        fetchData();
    }, []);

    useEffect(() => {
        if (tags == null) return;
        setValue('name', tags.name);
        setValue('tag_category_id', tags.tag_category_id);
    }, [tags]);

    return (
        <>
            {!loading && tags && (
                <>
                    <CrudTitle isEditing={true} onDelete={onDelete} />
                    <Form
                        title='Edit Tag'
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
            )}
        </>
    );
}