'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import axios from 'axios';
import { APIResponse } from '@/core/model/api';
import { Tags } from '@/core/model/tag';
import Form from '@/app/admin/posts/form';

type FormValues = {
    title: string;
    content: string;
    source?: string;
    tags: number[];
    slug?: string;
    level: string;
};

const formSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
        })
        .min(5, 'Title too short'),
    content: z
        .string({
            required_error: 'Content is required',
        })
        .min(10, 'Content too short'),
    // source is link to the original post
    source: z.string(),
    tags: z.array(z.number()),
    slug: z.string().optional(),
    level: z.string(),
});

export default function PostsNewPage() {
    const [tags, setTags] = useState<Tags[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { replace } = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log(data);
        if (!isValid) return;
        setIsLoading(true);

        try {
            const res = await api.postToServerAxios({
                endpoint: '/posts',
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

    useEffect(() => {
        const fetchTags = async () => {
            const tags: APIResponse<Tags[]> = await api.fetchAllData({
                endpoint: '/tags',
            });

            setTags(tags.data);
        };
        fetchTags();
    }, []);

    return (
        <>
            <CrudTitle />
            <h1 className='text-2xl font-semibold'>New Post</h1>
            <Form
                title='Create Post'
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                errors={errors}
                register={register}
                setValue={setValue}
                tags={tags}
                pickedTags={[]}
                trigger={trigger}
                isLoading={isLoading}
            />
        </>
    );
}