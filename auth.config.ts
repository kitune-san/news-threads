import type { NextAuthConfig } from 'next-auth';
import prisma from '@/db';
import { use } from 'react';
 
export const authConfig = {
    providers: [],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
          if (user) {
            token.userName = user.userName;
            token.role = user.role;
          }
          if (trigger === 'update' && session?.userName != null) {
            //  Note, that `session` can be any arbitrary object, remember to validate it!
            const data = await prisma.user.findUnique({ select: { userName: true }, where: { id: token.sub }});
            if (data?.userName != null) token.userName = data?.userName;
          }
          return token;
        },
        async session({session, token}) {
          if (session.user != null) {
            if (token.sub != null) {
              session.user.id = token.sub;
            }
            session.user.userName = token.userName;
            session.user.role = token.role;
          }
          return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isSignIn = !!auth?.user;
            if (isSignIn) {
                const isOnAccountSettings = nextUrl.pathname.startsWith('/settings/account');
                if (auth?.user.userName == null && !isOnAccountSettings) {
                    return Response.redirect(new URL('/settings/account', nextUrl));
                }
            } else {
              if (nextUrl.pathname.startsWith('/settings')) {
                // Redirect unauthenticated users to login page
                return false;
              }
            }

            if (nextUrl.pathname.startsWith('/control_panel')) {
              if (!isSignIn || auth.user.role != "ADMIN") {
                return Response.redirect(new URL('/', nextUrl));
              }
            }

            return true;
        }
    },
} satisfies NextAuthConfig;
