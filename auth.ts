import NextAuth from "next-auth";
import authConfig from "./auth.config";

import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isMatch = compareSync(
          credentials.password as string,
          user.password,
        );

        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },

    async session({ session, trigger, user, token }: any) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.name = token.name;
      }

      return session;
    },
  },
});

// import { prisma } from "@/lib/prisma";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { compareSync } from "bcrypt-ts-edge";
// import NextAuth, { NextAuthConfig } from "next-auth";
// import CredentialProviders from "next-auth/providers/credentials";
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export const config = {
//   pages: {
//     signIn: "/sign-in",
//     error: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialProviders({
//       credentials: {
//         email: { type: "email" },
//         password: { type: "password" },
//       },

//       async authorize(credentials) {
//         if (credentials === null) return null;

//         // find user in database
//         const user = await prisma.user.findFirst({
//           where: {
//             email: credentials.email as string,
//           },
//         });

//         // check if user exists and if the pass matches
//         if (user && user.password) {
//           const isMatch = compareSync(
//             credentials.password as string,
//             user.password,
//           );

//           // if pass was correct, return user
//           if (isMatch) {
//             return {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               role: user.role,
//             };
//           }
//         }

//         // if user doesn't exists and pass doesn't match return null
//         return null;
//       },
//     }),
//   ],

//   callbacks: {
//     async session({ session, trigger, user, token }: any) {
//       // set the user id from the token
//       session.user.id = token.sub;
//       session.user.role = token.role;
//       session.user.name = token.name;

//       //if there is an update set user name
//       if (trigger === "update") {
//         session.user.name = user.name;
//       }

//       return session;
//     },

//     async jwt({ token, trigger, user, session }: any) {
//       // assign user fields to token
//       if (user) {
//         token.role = user.role;

//         // if user has no name then user email
//         if (user.name === "NO_NAME") {
//           token.name = user.email!.split("@")[0];

//           //update db to reflect token name
//           await prisma.user.update({
//             where: { id: user.id },
//             data: { name: token.name },
//           });
//         }
//       }

//       return token;
//     },

//     async authorized({ request, auth }: any) {
//       // check for session cart cookie
//       if (!request.cookies.get("sessionCartId")) {
//         // generate session cart id
//         const sessionCartId = crypto.randomUUID();

//         //clone the req headers
//         const newRequestHeaders = new Headers(request.headers);

//         // create new response and add new headers
//         const response = NextResponse.next({
//           request: {
//             headers: newRequestHeaders,
//           },
//         });

//         // set newly generated sessionCartId in the response cookie
//         response.cookies.set("sessionCartId", sessionCartId);

//         return response;
//       } else {
//         return true;
//       }
//     },
//   },
// } satisfies NextAuthConfig;

// export const { handlers, auth, signIn, signOut } = NextAuth(config);
