import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import React from 'react';
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
};

export default function index({
                                  title,
                                  onSubmit,
                                  handleSubmit,
                                  errors,
                                  register,
                                  isLoading,
                              }: Props) {
    return (
        <form className='p-1' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        placeholder='My awesome tag category'
                        {...register('name')}
                    />
                    {errors.name && (
                        <Label htmlFor='name' className='text-red-500'>
                            {errors.name.message}
                        </Label>
                    )}
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