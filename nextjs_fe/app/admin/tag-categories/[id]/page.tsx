'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import { APIResponse } from '@/core/model/api';
import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { TagCategories } from '@/core/model/tag';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/app/admin/tag-categories/form';
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
};

const formSchema = z.object({
    name: z.string().nonempty('Name is required'),
});

export default function Page({ params }: Props) {
    const { id } = params;

    const [isLoading, setIsLoading] = useState(false);
    const [tagCategories, setTagCategories] = useState<TagCategories | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const { replace } = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
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
                endpoint: `/tag-categories/${id}`,
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
                endpoint: `/tag-categories/${id}`,
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
        const fetchData = async () => {
            // Fetch post by id
            try {
                const response = await api.getFromServerAxios({
                    endpoint: `/tag-categories/${id}`,
                });
                const dataResponse: APIResponse<TagCategories> = response.data;
                setTagCategories(dataResponse.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (tagCategories == null) return;
        setValue('name', tagCategories.title);
    }, [tagCategories]);

    return (
        <>
            {!loading && tagCategories && (
                <>
                    <CrudTitle isEditing={true} onDelete={onDelete} />
                    <Form
                        title='Edit Tag Category'
                        onSubmit={onSubmit}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        register={register}
                        isLoading={isLoading}
                    />
                </>
            )}
        </>
    );
}