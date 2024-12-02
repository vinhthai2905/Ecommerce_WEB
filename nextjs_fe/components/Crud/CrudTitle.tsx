'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
    isEditing?: boolean;
    isShowDelete?: boolean;
    isShowComments?: boolean;
    onDelete?: () => void;
};
export default function CrudTitle({
                                      isEditing = false,
                                      isShowDelete = true,
                                      isShowComments = false,
                                      onDelete,
                                  }: Props) {
    const { replace } = useRouter();
    const pathname = usePathname();

    return (
        <div className='flex justify-between'>
            <Button
                variant={'ghost'}
                onClick={() => {
                    replace(pathname.split('/').slice(0, -1).join('/'));
                }}
            >
                <X />
            </Button>
            <div className='flex gap-2'>
                {isEditing && isShowComments && (
                    <Button
                        onClick={() => {
                            replace(pathname + '/comments');
                        }}
                    >
                        Comments
                    </Button>
                )}
                {isEditing && isShowDelete && (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant='destructive'>Delete</Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-md'>
                            <DialogHeader>
                                <DialogTitle>
                                    Are you sure you want to delete this?
                                </DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className='flex items-center justify-between'>
                                <DialogClose asChild>
                                    <Button type='button' variant='secondary'>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type='button'
                                    variant='destructive'
                                    onClick={onDelete}
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}