import { openWindow } from '@/app/(auth)/provider';

export const loginWithGithub = () => {
    openWindow(
        process.env.NEXT_PUBLIC_API_URL + '/auth/github',
        'Github Login',
        {
            width: 600,
            height: 720,
        }
    );
};