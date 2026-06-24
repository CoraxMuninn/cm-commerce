import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

export default {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize() {
        return null;
      },
    }),
  ],

  callbacks: {
    async authorized({ request, auth }: any) {
      // array of regex patterns of paths we want to protect
      const protectPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // get pathname from req url object
      const { pathname } = request.nextUrl;

      // check if user is not authenticated and accessing to protected path
      if (!auth && protectPaths.some((p) => p.test(pathname))) return false;

      // check for cart session cookie
      if (!request.cookies.get("sessionCartId")) {
        const response = NextResponse.next();

        response.cookies.set("sessionCartId", crypto.randomUUID());

        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
