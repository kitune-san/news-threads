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

export default function SignButton() {
    const { data: sesion, status } = useSession();

    if (status === 'loading') return (<p>Loading</p>);
    if (status === 'authenticated') return <SignOut />
    return (<SignIn />);
}
