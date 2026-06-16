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
    async authorized({ request }) {
      if (!request.cookies.get("sessionCartId")) {
        const response = NextResponse.next();

        response.cookies.set("sessionCartId", crypto.randomUUID());

        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
