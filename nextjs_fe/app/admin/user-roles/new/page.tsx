'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import React, { useEffect, useState } from 'react';
import Form from '@/app/admin/user-roles/form';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import axios from 'axios';
import { User } from '@/core/model/user';
import { APIResponse } from '@/core/model/api';

type FormValues = {
    user_id: number;
    role_id: number;
};

const formSchema = z.object({
    user_id: z.number(),
    role_id: z.number(),
});

export default function UserRolesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User[]>([]);
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
        const fetchUser = async () => {
            const res: APIResponse<User[]> = await api.fetchAllData({
                endpoint: '/users',
            });
            setUser(res.data);
        };

        fetchUser();
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
            <h1 className='text-2xl font-semibold'>New User Role</h1>
            <Form
                title='Create User Role'
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                errors={errors}
                register={register}
                isLoading={isLoading}
                user={user}
                setValue={setValue}
                getValues={getValues}
            />
        </>
    );
}