'use client';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/core/model/user';
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
    user: User[];
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
                                  user,
                              }: Props) {
    const [openUser, setOpenUser] = useState(false);
    const [openRole, setOpenRole] = useState(false);
    const role: {
        id: number;
        name: string;
    }[] = [
        {
            id: 0,
            name: 'Member',
        },
        {
            id: 1,
            name: 'Admin',
        },
    ];

    return (
        <form className='p-1' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
                <div className='grid gap-2'>
                    <Label htmlFor='user'>User</Label>
                    <Popover open={openUser} onOpenChange={setOpenUser}>
                        <PopoverTrigger asChild>
                            <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={openUser}
                                className='w-full justify-between'
                            >
                                {getValues('user_id')
                                    ? user.find(
                                        (_user) =>
                                            _user.id === getValues('user_id')
                                    )?.first_name +
                                    ' ' +
                                    user.find(
                                        (_user) =>
                                            _user.id === getValues('user_id')
                                    )?.last_name
                                    : 'Select a user'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0'>
                            <Command>
                                <CommandInput placeholder='Search user...' />
                                <CommandEmpty>No user found.</CommandEmpty>
                                <CommandList>
                                    {user.map((_user) => (
                                        <CommandItem
                                            key={_user.id}
                                            onSelect={(currentValue) => {
                                                setValue(
                                                    'user_id',
                                                    currentValue ===
                                                    getValues('user_id')
                                                        ? ''
                                                        : _user.id
                                                );
                                                setOpenUser(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    getValues('user_id') ===
                                                    _user.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            {_user.first_name +
                                                ' ' +
                                                _user.last_name}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {errors.user_id && (
                        <span className='text-sm text-red-500'>
                            {errors.user_id.message}
                        </span>
                    )}
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='role'>Role</Label>
                    <Popover open={openRole} onOpenChange={setOpenRole}>
                        <PopoverTrigger asChild>
                            <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={openRole}
                                className='w-full justify-between'
                            >
                                {getValues('role_id') === 0 ||
                                getValues('role_id') === 1
                                    ? role.find(
                                        (_role) =>
                                            _role.id === getValues('role_id')
                                    )?.name
                                    : 'Select a role'}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0'>
                            <Command>
                                <CommandInput placeholder='Search role...' />
                                <CommandEmpty>No role found.</CommandEmpty>
                                <CommandList>
                                    {role.map((_role) => (
                                        <CommandItem
                                            key={_role.id}
                                            onSelect={(currentValue) => {
                                                setValue(
                                                    'role_id',
                                                    currentValue ===
                                                    getValues('role_id')
                                                        ? ''
                                                        : _role.id
                                                );
                                                setOpenRole(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    getValues('role_id') ===
                                                    _role.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            {_role.name}
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {errors.role_id && (
                        <span className='text-sm text-red-500'>
                            {errors.role_id.message}
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