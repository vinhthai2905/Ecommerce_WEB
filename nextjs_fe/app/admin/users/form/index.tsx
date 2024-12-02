import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import {
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormRegister,
} from 'react-hook-form';

type Props = {
    title: string;
    onSubmit: SubmitHandler<any>;
    handleSubmit: UseFormHandleSubmit<any>;
    errors: any;
    register: UseFormRegister<any>;
    isLoading: boolean;
    isEdit?: boolean;
    defaultSource?: File | null | string;
};

export default function Index({
                                  title,
                                  onSubmit,
                                  handleSubmit,
                                  errors,
                                  register,
                                  isLoading,
                                  isEdit = false,
                                  defaultSource = null,
                              }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [source, setSource] = useState<File | null | string>(defaultSource);

    return (
        <form className='p-1' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <Label htmlFor='first_name'>First Name</Label>
                    <Input placeholder='Tien' {...register('first_name')} />
                    {errors.first_name && (
                        <Label htmlFor='first_name' className='text-red-500'>
                            {errors.first_name.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='last_name'>Last Name</Label>
                    <Input
                        placeholder='Nguyen Tran'
                        {...register('last_name')}
                    />
                    {errors.last_name && (
                        <Label htmlFor='last_name' className='text-red-500'>
                            {errors.last_name.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='bio'>Bio</Label>
                    <Input placeholder='My bio' {...register('bio')} />
                    {errors.bio && (
                        <Label htmlFor='bio' className='text-red-500'>
                            {errors.bio.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='username'>Username</Label>
                    <Input placeholder='zlynx' {...register('username')} />
                    {errors.username && (
                        <Label htmlFor='username' className='text-red-500'>
                            {errors.username.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        placeholder='tn07050222@gmail.com'
                        {...register('email')}
                    />
                    {errors.email && (
                        <Label htmlFor='email' className='text-red-500'>
                            {errors.email.message}
                        </Label>
                    )}
                </div>
                {!isEdit && (
                    <div className='relative grid gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input
                            placeholder={
                                showPassword
                                    ? 'My awesome password'
                                    : '********'
                            }
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                        />
                        {errors.password && (
                            <Label htmlFor='password' className='text-red-500'>
                                {errors.password.message}
                            </Label>
                        )}
                        <a
                            className='absolute right-2 top-[50%] cursor-pointer'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Eye /> : <EyeOff />}
                        </a>
                    </div>
                )}
                <div className='grid gap-2'>
                    <Label htmlFor='avatar'>Avatar</Label>
                    <div className='flex w-full flex-col gap-2'>
                        <img
                            className='h-40 w-40 items-center justify-center rounded-md'
                            src={
                                source
                                    ? typeof source === 'string'
                                        ? source
                                        : URL.createObjectURL(source)
                                    : '/images/default-avatar.jpg'
                            }
                            onError={(e) => {
                                e.currentTarget.src = '/images/default.jpg';
                            }}
                        />

                        <Input
                            type='file'
                            {...register('avatar')}
                            onChange={(e) => {
                                if (e.target.files) {
                                    setSource(e.target.files[0]);
                                }
                            }}
                        />
                        {errors.avatar && (
                            <Label htmlFor='avatar' className='text-red-500'>
                                {errors.avatar.message}
                            </Label>
                        )}
                    </div>
                </div>
            </div>
            <div className='mt-4 flex w-full flex-col gap-2'>
                <Button className='w-full' disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin items-center' />
                    ) : (
                        <span>{title}</span>
                    )}
                </Button>
            </div>
        </form>
    );
}