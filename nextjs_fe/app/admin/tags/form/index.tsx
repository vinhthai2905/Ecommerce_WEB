'use client';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { TagCategories } from '@/core/model/tag';
import { cn } from '@/lib/utils';
import { CommandList } from 'cmdk';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import {
    SubmitHandler,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue,
} from 'react-hook-form';

type Props = {
    title: string;
    onSubmit: SubmitHandler<any>;
    handleSubmit: UseFormHandleSubmit<any>;
    errors: any;
    register: UseFormRegister<any>;
    isLoading: boolean;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    tagCategories: TagCategories[];
};

export default function Index({
                                  title,
                                  onSubmit,
                                  handleSubmit,
                                  errors,
                                  register,
                                  isLoading,
                                  setValue,
                                  getValues,
                                  tagCategories,
                              }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <form className='p-1' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <Label htmlFor='title'>Name</Label>
                    <Input placeholder='My awesome tag' {...register('name')} />
                    {errors.name && (
                        <Label htmlFor='name' className='text-red-500'>
                            {errors.name.message}
                        </Label>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='tags'>Tags Category</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={open}
                                className='w-full justify-between'
                            >
                                {getValues('tag_category_id')
                                    ? tagCategories.find(
                                        (tagCategory) =>
                                            tagCategory.id ===
                                            getValues('tag_category_id')
                                    )?.title
                                    : 'Select a tag category'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0'>
                            <Command>
                                <CommandInput placeholder='Search framework...' />
                                <CommandEmpty>
                                    No tag category found.
                                </CommandEmpty>
                                <CommandList>
                                    {tagCategories.map((tagCategory) => (
                                        <CommandItem
                                            key={tagCategory.id}
                                            onSelect={(currentValue) => {
                                                setValue(
                                                    'tag_category_id',
                                                    currentValue ===
                                                    getValues(
                                                        'tag_category_id'
                                                    )
                                                        ? ''
                                                        : tagCategory.id
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    getValues(
                                                        'tag_category_id'
                                                    ) === tagCategory.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            {tagCategory.title}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {errors.tagCategory && (
                        <span className='text-sm text-red-500'>
                            {errors.tagCategory.message}
                        </span>
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