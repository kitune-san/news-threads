"use client";
import {signIn, signOut} from "next-auth/react";

export const SignIn = () => {
    return (
        <button style={{marginRight: 10}} onClick={() => signIn()}>
            Sign in
        </button>
    );
};

export const SignOut = () => {
    return (
        <button style={{marginRight: 10}} onClick={() => signOut()}>
            Sign Out
        </button>
    );
};