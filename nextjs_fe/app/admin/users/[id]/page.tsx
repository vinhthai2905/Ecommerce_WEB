'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import { APIResponse } from '@/core/model/api';
import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/app/admin/users/form';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { User } from '@/core/model/user';

type Props = {
    params: {
        id: string;
    };
};

type FormValues = {
    first_name: string;
    last_name: string;
    bio?: string;
    username: string;
    email: string;
    avatar: FileList;
};

const formSchema = z.object({
    first_name: z.string().nonempty('First name is required'),
    last_name: z.string().nonempty('Last name is required'),
    bio: z.string().optional(),
    username: z.string().nonempty('Username is required'),
    email: z.string().email('Email is not valid'),
    avatar: z.any().optional(),
});

export default function Page({ params }: Props) {
    const { id } = params;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<User | null>(null);
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

        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('username', data.username);
        formData.append('email', data.email);

        if (data.bio) {
            formData.append('bio', data.bio);
        }
        console.log('avatar', data.avatar[0]);
        if (data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]);
        }

        try {
            const res = await api.postToServerAxios({
                endpoint: `/users/${id}?_method=PUT`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                endpoint: `/users/${id}`,
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
                    endpoint: `/users/${id}`,
                });
                const user: APIResponse<User> = response.data;
                setData(user.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data == null) return;
        setValue('first_name', data.first_name);
        setValue('last_name', data.last_name);
        setValue('bio', data.bio || '');
        setValue('username', data.username);
        setValue('email', data.email);
    }, [data]);

    return (
        <>
            {!loading && data && (
                <>
                    <CrudTitle isEditing={true} onDelete={onDelete} />
                    <Form
                        title='Edit User'
                        onSubmit={onSubmit}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        register={register}
                        isLoading={isLoading}
                        isEdit={true}
                        defaultSource={data.avatar}
                    />
                </>
            )}
        </>
    );
}