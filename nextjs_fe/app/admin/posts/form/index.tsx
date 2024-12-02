import { Button } from '@/components/ui/button';
import { FancyMultiSelect } from '@/components/ui/fany-multi-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tags } from '@/core/model/tag';
import { slug } from '@/lib/slug';
import { Loader2 } from 'lucide-react';
import React from 'react';
import {
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';

type Props = {
    title: string;
    onSubmit: SubmitHandler<any>;
    handleSubmit: UseFormHandleSubmit<any>;
    errors: any;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    trigger: UseFormTrigger<any>;
    tags: Tags[];
    pickedTags: Tags[];
    isLoading: boolean;
};

export default function Form({
                                 title,
                                 onSubmit,
                                 handleSubmit,
                                 errors,
                                 register,
                                 setValue,
                                 tags,
                                 trigger,
                                 pickedTags,
                                 isLoading,
                             }: Props) {
    return (
        <form className='p-1' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <Label htmlFor='title'>Title</Label>
                    <Input
                        id='title'
                        type='title'
                        placeholder='My awesome post'
                        {...register('title')}
                        onChange={(e) => {
                            const title = e.target.value;
                            setValue('slug', slug(title));
                        }}
                    />
                    {errors.title && (
                        <Label
                            htmlFor='title'
                            className='text-sm font-medium text-destructive text-red-500'
                        >
                            {errors.title.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='title'>
                        Source (link to the original post)
                    </Label>
                    <Input
                        id='source'
                        type='source'
                        placeholder='https://example.com'
                        {...register('source')}
                    />
                    {errors.source && (
                        <Label
                            htmlFor='source'
                            className='text-sm font-medium text-destructive text-red-500'
                        >
                            {errors.source.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='title'>Tags</Label>
                    <FancyMultiSelect
                        data={tags}
                        defaultTags={pickedTags}
                        setValue={setValue}
                        trigger={trigger}
                    />
                    {errors.tags && (
                        <Label
                            htmlFor='tags'
                            className='text-sm font-medium text-destructive text-red-500'
                        >
                            {errors.tags.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='content'>Content</Label>
                    <Textarea id='content' {...register('content')} />
                    {errors.content && (
                        <Label
                            htmlFor='content'
                            className='text-sm font-medium text-destructive text-red-500'
                        >
                            {errors.content.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='title'>
                        Slug (optional, will be generated automatically)
                    </Label>
                    <Input
                        id='slug'
                        type='slug'
                        placeholder='my-awesome-post'
                        {...register('slug')}
                    />
                    {errors.slug && (
                        <Label
                            htmlFor='slug'
                            className='text-sm font-medium text-destructive text-red-500'
                        >
                            {errors.slug.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='title'>Level</Label>
                    <Input
                        id='level'
                        type='level'
                        placeholder='Easy, Medium, Hard, etc.'
                        {...register('level')}
                    />
                    {errors.level && (
                        <Label
                            htmlFor='level'
                            className='text-sm font-medium text-destructive text-red-500'
                        >
                            {errors.level.message}
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