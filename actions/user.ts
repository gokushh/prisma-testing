// app/actions/userActions.ts
'use server';

import db from '@/lib/db';

export async function addUser(name: string) {
    try {
        const user = await db.user.create({
            data: {
                name: name,
            },
        });
        return { success: true, user };
    } catch (error) {
        return { success: false, error: 'Failed to create user' };
    }
}

export async function listUsers() {
    try {
        const users = await db.user.findMany();
        return { success: true, users };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}