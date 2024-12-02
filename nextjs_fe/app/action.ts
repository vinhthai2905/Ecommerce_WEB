'use server';

import { cookies } from 'next/headers';

export async function createToken() {
    cookies().set('token', 'lee');
}