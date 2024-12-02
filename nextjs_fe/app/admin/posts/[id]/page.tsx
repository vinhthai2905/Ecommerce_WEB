'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import { APIResponse } from '@/core/model/api';
import { Posts } from '@/core/model/posts';
import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { Tags } from '@/core/model/tag';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/app/admin/posts/form';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Props = {
    params: {
        id: string;
    };
};
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

export default function Page({ params }: Props) {
    const { id } = params;

    const [isLoading] = useState(false);
    const [tags, setTags] = useState<Tags[]>([]);
    const [pickedTags, setPickedTags] = useState<Tags[]>([]);
    const [post, setPost] = useState<Posts | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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

        try {
            const response = await api.putToServerAxios({
                endpoint: `/posts/${id}`,
                data: {
                    title: data.title,
                    content: data.content,
                    source: data.source,
                    tags: data.tags,
                    slug: data.slug,
                    level: data.level,
                },
            });
            if (response.status === 200) {
                replace(pathname.replace(`/${id}`, ''));
                toast({
                    title: 'Success',
                    description: response.data.message,
                });
            }
        } catch (error) {
            if (error instanceof axios.AxiosError) {
                toast({
                    title: 'Error',
                    description: error.response?.data.message,
                });
            }
        }
    };

    const onDelete = async () => {
        try {
            const response = await api.deleteToServerAxios({
                endpoint: `/posts/${id}`,
            });
            if (response.status === 200) {
                replace(pathname.replace(`/${id}`, ''));
                toast({
                    title: 'Success',
                    description: response.data.message,
                });
            }
        } catch (error) {
            if (error instanceof axios.AxiosError) {
                toast({
                    title: 'Error',
                    description: error.response?.data.message,
                });
            }
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            // Fetch post by id
            try {
                const response = await api.getFromServerAxios({
                    endpoint: `/posts/${id}`,
                });
                const post: APIResponse<Posts> = response.data;
                setPost(post.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        const fetchTags = async () => {
            const tags: APIResponse<Tags[]> = await api.fetchAllData({
                endpoint: '/tags',
            });

            setTags(tags.data);
        };
        fetchPost();
        fetchTags();
    }, []);

    useEffect(() => {
        if (post == null) return;

        setValue('title', post.title);
        setValue('content', post.content);
        setValue('source', post.source);
        setValue('slug', post.slug);
        setValue('level', post.level);

        // mapping name tag in data.tags to id in tags
        for (let i = 0; i < post.tags.length; i++) {
            const tag = tags.find((tag) => tag.name === post.tags[i]);
            if (tag) {
                setPickedTags((prev) => [...prev, tag]);
            }
        }
    }, [post, tags]);

    useEffect(() => {
        if (post == null) return;
        setValue(
            'tags',
            pickedTags.map((tag) => tag.id)
        );
    }, [pickedTags]);
    return (
        <>
            {!loading && post && (
                <>
                    <CrudTitle
                        isEditing={true}
                        onDelete={onDelete}
                        isShowComments={true}
                    />
                    <Form
                        title='Edit Post'
                        onSubmit={onSubmit}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        tags={tags}
                        pickedTags={pickedTags}
                        trigger={trigger}
                        isLoading={isLoading}
                    />
                </>
            )}
        </>
    );
}