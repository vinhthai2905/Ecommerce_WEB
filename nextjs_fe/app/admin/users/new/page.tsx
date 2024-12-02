'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import React, { useState } from 'react';
import Form from '@/app/admin/users/form';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

type FormValues = {
    first_name: string;
    last_name: string;
    bio?: string;
    username: string;
    email: string;
    password: string;
    avatar: FileList;
};

const formSchema = z.object({
    first_name: z.string().nonempty('First name is required'),
    last_name: z.string().nonempty('Last name is required'),
    bio: z.string().optional(),
    username: z.string().nonempty('Username is required'),
    email: z.string().email('Email is not valid'),
    password: z.string().nonempty('Password is required'),
    avatar: z.any().optional(),
});

export default function UsersNewPage() {
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

        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);

        if (data.bio) {
            formData.append('bio', data.bio);
        }
        console.log('avatar', data.avatar[0]);
        if (data.avatar.length > 0) {
            formData.append('avatar', data.avatar[0]);
        }

        try {
            const res = await api.postToServerAxios({
                endpoint: '/users',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
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
            <h1 className='text-2xl font-semibold'>New User</h1>
            <Form
                title='Create User'
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </>
    );
}