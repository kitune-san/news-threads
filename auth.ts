import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import type { DefaultSession, NextAuthConfig } from 'next-auth'

import GitHub from 'next-auth/providers/github'
import { Credential } from '@/auth.credentials'
import { authConfig } from '@/auth.config'

import { Adapter, AdapterUser } from 'next-auth/adapters';
import prisma from '@/db';
import { Role } from '@/prisma/generated/client'
import { PrismaAdapter } from '@auth/prisma-adapter';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      userName: string  | null;
      role?: Role;
    } & DefaultSession['user']
  }
  interface User {
    userName: string | null;
    role?: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userName: string | null;
    role?: Role;
  }
}

export const customAdapter: Adapter = {
  ...PrismaAdapter(prisma),

  getUserByEmail: () => null,

  createUser: async (data) => {
    const user = await prisma.user.create({ data: { ...data, name: null, email: null, image: null } });
    return user as AdapterUser;
  },
}

export const config = {
  ...authConfig,
  adapter: customAdapter,
  session: { strategy: 'jwt' },
  providers: [
    GitHub,
    Credential
  ],

} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
