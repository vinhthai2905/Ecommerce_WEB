'use client';

import { AuthContext } from '@/components/Providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { UserUpdate } from '@/core/model/user';
import api from '@/lib/api';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import React, { useContext, useState } from 'react';

export default function Profile() {
    const auth = useContext(AuthContext);
    const user = auth.zUser;
    const { toast } = useToast();

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);

    const [dataPassword, setDataPassword] = useState<{
        current_password?: string;
        password?: string;
    }>({});

    const [dataUpdate, setDataUpdate] = useState<UserUpdate>({});

    const handleSubmit = async () => {
        // check avatar first_name last_name bio is not empty
        if (
            !dataUpdate.avatar &&
            !dataUpdate.first_name &&
            !dataUpdate.last_name &&
            !dataUpdate.bio
        ) {
            toast({
                title: 'Error',
                description: 'Please fill in the fields for update',
            });
            return;
        }

        const formData = new FormData();

        if (dataUpdate.avatar) {
            formData.append('avatar', dataUpdate.avatar);
        }

        if (dataUpdate.first_name) {
            formData.append('first_name', dataUpdate.first_name);
        }

        if (dataUpdate.last_name) {
            formData.append('last_name', dataUpdate.last_name);
        }

        if (dataUpdate.bio) {
            formData.append('bio', dataUpdate.bio);
        }

        try {
            const res = await api.postToServerAxios({
                endpoint: '/profile?_method=PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Profile updated successfully',
                });
                auth.setZUser(res.data.data);
            }
        } catch (e) {
            if (e instanceof axios.AxiosError) {
                toast({
                    title: 'Error',
                    description: e.response?.data.message,
                });
            }
        }
    };

    const handleChangePassword = async () => {
        if (!dataPassword.password || !dataPassword.current_password) {
            toast({
                title: 'Error',
                description: 'Please fill in the password fields',
            });
            return;
        }

        if (dataPassword.password.length < 8) {
            toast({
                title: 'Error',
                description: 'Password must be at least 8 characters',
            });
            return;
        }

        try {
            const res = await api.putToServerAxios({
                endpoint: '/password',
                data: dataPassword,
            });

            if (res.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Password updated successfully',
                });
            }
        } catch (e) {
            if (e instanceof axios.AxiosError) {
                toast({
                    title: 'Error',
                    description: e.response?.data.message,
                });
            }
        }
    };

    return (
        <div className='flex h-full flex-col items-center justify-center'>
            {!user ? (
                <Skeleton />
            ) : (
                <div className='h-full w-full lg:w-1/2'>
                    <div className='flex items-center justify-between text-lg font-bold'>
                        <span className='text-xl'>Profile</span>
                        <div className='flex w-full justify-end pb-4'>
                            <Button className='mt-4' onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                    <div className='text-sm text-gray-400'>
                        Upload a picture to make your profile stand out and let
                        people recognize your comments and contributions easily!
                    </div>
                    <div className='mt-4 flex items-center justify-center gap-2 rounded-md border border-gray-400 p-1'>
                        <img
                            src={
                                avatar
                                    ? URL.createObjectURL(avatar)
                                    : user.avatar
                            }
                            alt='avatar'
                            className='h-20 w-20 rounded-md'
                        />
                        <div className='w-full'>
                            <Label htmlFor='picture'>Picture</Label>
                            <Input
                                className='flex flex-grow'
                                type='file'
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setAvatar(e.target.files[0]);
                                        setDataUpdate({
                                            ...dataUpdate,
                                            avatar: e.target.files[0],
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='mt-4'></div>
                    <div className='text-lg font-bold'>Account Information</div>
                    <Label htmlFor='name'>First Name</Label>
                    <Input
                        id='name'
                        className='w-full'
                        value={user.first_name}
                        onChange={(e) => {
                            if (e.target.value) {
                                setDataUpdate({
                                    ...dataUpdate,
                                    first_name: e.target.value,
                                });
                            }
                        }}
                    />
                    <Label htmlFor='surname'>Last Name</Label>
                    <Input
                        id='surname'
                        className='w-full'
                        value={user.last_name}
                        onChange={(e) => {
                            if (e.target.value) {
                                setDataUpdate({
                                    ...dataUpdate,
                                    last_name: e.target.value,
                                });
                            }
                        }}
                    />

                    <Label htmlFor='username'>Username</Label>
                    <Input
                        id='username'
                        className='w-full'
                        value={user.username}
                        disabled
                    />
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        id='email'
                        className='w-full'
                        value={user.email}
                        disabled
                    />

                    <div className='mt-4'></div>
                    <div className='text-lg font-bold'>About Me</div>
                    <Label htmlFor='bio'>Bio</Label>
                    <Textarea
                        id='bio'
                        className='w-full'
                        onChange={(e) => {
                            if (e.target.value) {
                                setDataUpdate({
                                    ...dataUpdate,
                                    bio: e.target.value,
                                });
                            }
                        }}
                        value={
                            !dataUpdate.bio
                                ? user.bio
                                    ? user.bio
                                    : 'Tell us about yourself'
                                : dataUpdate.bio
                        }
                    />
                    <div className='mt-4'></div>
                    <div className='text-lg font-bold'>
                        Security Information
                    </div>
                    <div className='flex flex-col items-center gap-2 lg:flex-row'>
                        <div className='w-full'>
                            <Label htmlFor='password'>Old Password</Label>
                            <Input
                                id='password'
                                className='w-full'
                                type={isShowPassword ? 'text' : 'password'}
                                placeholder={isShowPassword ? '' : '********'}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setDataPassword({
                                            ...dataPassword,
                                            current_password: e.target.value,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className='relative w-full'>
                            <Label htmlFor='confirm-password'>
                                Confirm Password
                            </Label>
                            <Input
                                id='confirm-password'
                                className='w-full'
                                type={isShowPassword ? 'text' : 'password'}
                                placeholder={isShowPassword ? '' : '********'}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setDataPassword({
                                            ...dataPassword,
                                            password: e.target.value,
                                        });
                                    }
                                }}
                            />
                            <a
                                className='absolute right-2 top-[50%] cursor-pointer'
                                onClick={() =>
                                    setIsShowPassword(!isShowPassword)
                                }
                            >
                                {isShowPassword ? <Eye /> : <EyeOff />}
                            </a>
                        </div>
                        <div className='flex h-16 w-full flex-col justify-start lg:w-36 lg:items-center lg:justify-end'>
                            <div className='h-0 lg:h-6'></div>
                            <Button onClick={handleChangePassword}>
                                Update Password
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}