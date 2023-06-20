import { PrismaAdapter } from "@next-auth/prisma-adapter";

import bcrypt from "bcrypt";

import { type GetServerSidePropsContext } from "next";

import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { signInSchema } from "~/schemas/sign-in-schema";
import { prisma } from "~/server/db";
import { type Role } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles: Role[];
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    roles: Role[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: Role[];
    id: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user == undefined) {
        return token;
      }

      token.roles = user.roles;
      token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        // eslint-disable-next-line no-param-reassign
        session.user.id = token.id;
        // eslint-disable-next-line no-param-reassign
        session.user.name = token.name as string;

        session.user.roles = token.roles ?? [];
        session.user.isAdmin =
          token.roles?.some((role) => role.isAdmin) ?? false;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    Credentials({
      name: "credentials",
      credentials: {
        name: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const data = await signInSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          include: {
            roles: true,
          },
          where: {
            name: data.name,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        console.log(
          `user ${user.id} is trying to log in. checking password...`
        );
        const isValidPassword = await bcrypt.compare(
          data.password,
          user.password
        );

        if (!isValidPassword) {
          console.log(`password for user ${user.id} was incorrect`);
          return null;
        }

        console.log(`user ${user.id} successfully authorized`);

        return {
          id: user.id,
          name: user.name,
          roles: user.roles,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
