import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import type { DefaultSession, NextAuthConfig } from 'next-auth'

import GitHub from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials';

import { Adapter, AdapterUser } from 'next-auth/adapters';
import prisma from '@/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { z } from 'zod';

import bcrypt from 'bcrypt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      userName: string  | null
    } & DefaultSession['user']
  }
  interface User {
    userName: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userName: string | null
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
  adapter: customAdapter,
  session: { strategy: 'jwt' },
  providers: [
    GitHub,
    CredentialsProvider({
      credentials: {
        username: {
          label: 'User Name',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password'
        },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object( { username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({ where: {userName: username }});

          if (user?.password == null) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userName = user.userName;
      return token;
    },
    async session({session, token}) {
      if (session.user != null) {
        if (token.sub != null) {
          session.user.id = token.sub;
        }
        session.user.userName = token.userName;
      }
      return session;
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
