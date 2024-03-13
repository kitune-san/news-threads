import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const Credential = CredentialsProvider({
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
  }
);