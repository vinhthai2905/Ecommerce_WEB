'use client';

import { Notifications } from '@/core/model/notifications';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import React from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { initNotifications } from '@/lib/features/notifications';

export default function NotificationsPage() {
    const notifications: Notifications[] = useAppSelector(
        (state) => state.notifications.data
    );
    const dispatch = useAppDispatch();

    const handleMarkAsRead = async (id: number) => {
        try {
            await api.postToServerAxios({
                endpoint: `/notifications/${id}`,
            });
            // find the notification and update it
            const updatedNotifications = notifications.map((notification) => {
                if (notification.id === id) {
                    return {
                        ...notification,
                        read_at: true,
                    };
                }
                return notification;
            });
            dispatch(initNotifications(updatedNotifications));
        } catch (error) {}
    };
    return (
        <div
            className={cn('flex w-full flex-col items-center justify-center')}
            style={{
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <div className='relative flex w-full flex-1  flex-col border-x p-4 dark:border-gray-600 lg:w-1/2'>
                <div className='flex h-max justify-between'>
                    <div className='flex h-full w-full flex-col gap-2'>
                        <h1 className='text-xl font-bold'>Notifications</h1>
                        <>
                            {notifications.length > 0 ? (
                                <>
                                    {notifications.map((notification) => (
                                        <a
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification.id
                                                )
                                            }
                                            className='cursor-pointer'
                                            key={notification.id}
                                        >
                                            {!notification.source ? (
                                                <Alert>
                                                    {notification.read_at ? (
                                                        <Bell className='h-4 w-4' />
                                                    ) : (
                                                        <BellRing className='animate-ring h-4 w-4' />
                                                    )}
                                                    <AlertTitle>
                                                        Notifications !
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        {notification.data}
                                                    </AlertDescription>
                                                </Alert>
                                            ) : (
                                                <Link
                                                    href={notification.source}
                                                >
                                                    <Alert
                                                        key={notification.id}
                                                    >
                                                        {notification.read_at ? (
                                                            <Bell className='h-4 w-4' />
                                                        ) : (
                                                            <BellRing className='animate-ring h-4 w-4' />
                                                        )}
                                                        <AlertTitle>
                                                            Notifications !
                                                        </AlertTitle>
                                                        <AlertDescription>
                                                            {notification.data}
                                                        </AlertDescription>
                                                    </Alert>
                                                </Link>
                                            )}{' '}
                                        </a>
                                    ))}{' '}
                                </>
                            ) : (
                                <div className='flex h-full w-full flex-col items-center justify-center gap-2 py-10'>
                                    <BellOff size={40} />
                                    <h1 className='text-lg font-bold'>
                                        No notifications
                                    </h1>
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
}