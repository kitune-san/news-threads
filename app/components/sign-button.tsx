'use client';
import {signIn, signOut, useSession} from 'next-auth/react';

export const SignIn = () => {
    return (
        <button onClick={() => signIn()}>
            Sign in
        </button>
    );
};

export const SignOut = () => {
    return (
        <button onClick={() => signOut()}>
            Sign Out
        </button>
    );
};