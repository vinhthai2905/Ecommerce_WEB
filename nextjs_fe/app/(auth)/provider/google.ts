import { openWindow } from '@/app/(auth)/provider';

export const loginWithGoogle = () => {
    openWindow(
        process.env.NEXT_PUBLIC_API_URL + '/auth/google',
        'Goole Login',
        {
            width: 600,
            height: 720,
        }
    );
};