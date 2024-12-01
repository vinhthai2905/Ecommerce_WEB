'use client';
import { APIResponse } from '@/core/model/api';
import { Notifications } from '@/core/model/notifications';
import { User } from '@/core/model/user';
import api from '@/lib/api';
import { initBookMark } from '@/lib/features/bookmark';
import { initNotifications } from '@/lib/features/notifications';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';

type AuthProviderProps = {
    zUser: User | null | undefined;
    zToken: string | null | undefined;
    setZToken: Dispatch<SetStateAction<string | null | undefined>>;
    setZUser: Dispatch<SetStateAction<User | null | undefined>>;
};

export const AuthContext = createContext<AuthProviderProps>({
    zUser: null,
    zToken: null,
    setZToken: () => {},
    setZUser: () => {},
});

export default function AuthProvider({
    children,
    token,
}: {
    children: React.ReactNode;
    token: string | null | undefined;
}) {
    const [zToken, setZToken] = useState<string | null | undefined>(token);
    const [zUser, setZUser] = useState<User | null | undefined>(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const updateMe = async () => {
        try {
            const res = await api.getFromServerAxios({
                endpoint: '/me',
            });
            if (res.status === 200) {
                const response: APIResponse<User> = res.data;
                setZUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                dispatch(initBookMark(response.data.bookmarks));

                // if user not verified, redirect to /verify
                if (!response.data.verified) {
                    router.push('/verify');
                    return;
                } else if (response.data.user_tags.length === 0) {
                    router.push('/onboarding');
                    return;
                } else {
                    router.push('/');
                }

                try {
                    const res = await api.getFromServerAxios({
                        endpoint: '/notifications',
                    });
                    const data: APIResponse<Notifications[]> = res.data;
                    dispatch(initNotifications(data.data));
                } catch (error) {}
            }
        } catch (e) {
            setZToken(null);
            setZUser(null);
            localStorage.removeItem('user');
            deleteCookie('token');
            router.push('/login');
        }
    };

    useEffect(() => {
        // update me
        if (zToken) {
            updateMe();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                zUser,
                zToken,
                setZToken,
                setZUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}