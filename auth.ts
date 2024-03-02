import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

import GitHub from "next-auth/providers/github"

import { Adapter, AdapterUser } from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const customAdapter: Adapter = {
  ...PrismaAdapter(prisma),

  getUserByEmail: () => null,

  createUser: async (data) => {
    const user = await prisma.user.create({ data: { ...data, email: null } });
    return user as AdapterUser;
  },
}

export const config = {
  adapter: customAdapter,
  session: { strategy: "jwt" },
  providers: [
    GitHub,
  ],
  callbacks: {
    async session({session, token}) {
      if (session.user != null && token.sub != null) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
