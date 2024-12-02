'use client';

import CrudTitle from '@/components/Crud/CrudTitle';
import { APIResponse } from '@/core/model/api';
import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/app/admin/user-roles/form';
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
    user_id: number;
    role_id: number;
};

const formSchema = z.object({
    user_id: z.number(),
    role_id: z.number(),
});

export default function Page({ params }: Props) {
    const { id } = params;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<User | null>(null);
    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { replace } = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'all',
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        try {
            const res = await api.putToServerAxios({
                endpoint: `/user-roles/${id}`,
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

    useEffect(() => {
        const fetchData = async () => {
            // Fetch post by id
            try {
                const response = await api.getFromServerAxios({
                    endpoint: `/users/${id}`,
                });
                const users: APIResponse<User> = response.data;
                setData(users.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        const fetchUser = async () => {
            const res: APIResponse<User[]> = await api.fetchAllData({
                endpoint: '/users',
            });
            setUser(res.data);
        };

        fetchData();
        fetchUser();
    }, []);

    useEffect(() => {
        if (data == null) return;
        setValue('user_id', data.id);
        setValue('role_id', data.role === 'admin' ? 1 : 0);
    }, [data]);

    return (
        <>
            {!loading && data && (
                <>
                    <CrudTitle isEditing={true} isShowDelete={false} />
                    <Form
                        title='Edit User Role'
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
            )}
        </>
    );
}