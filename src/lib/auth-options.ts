import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getOrCreateAdminCredentialByEmail } from "@/lib/admin-credential";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    updateAge: 60 * 30,
  },
  jwt: {
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.authenticatedAt = Math.floor(Date.now() / 1000);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;
        const adminEmail = process.env.ADMIN_EMAIL;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!email || !password) {
          return null;
        }

        const normalizedEmail = email.toLowerCase();
        const storedCredential = await getOrCreateAdminCredentialByEmail(normalizedEmail);

        if (storedCredential) {
          const validStoredPassword = await compare(password, storedCredential.passwordHash);

          if (validStoredPassword) {
            return {
              id: "admin-user",
              name: "Administrador",
              email: storedCredential.email,
            };
          }
        }

        if (!adminEmail || !passwordHash) {
          return null;
        }

        if (normalizedEmail !== adminEmail.toLowerCase()) {
          return null;
        }

        const validPassword = await compare(password, passwordHash);

        if (!validPassword) {
          return null;
        }

        return {
          id: "admin-user",
          name: "Administrador",
          email: adminEmail,
        };
      },
    }),
  ],
};