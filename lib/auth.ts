import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validators/auth";

const baseProviders: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      loginMode: { label: "Login Mode", type: "text" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse({
        email: credentials?.email,
        password: credentials?.password,
      });

      if (!parsed.success) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });

      if (!user || !user.passwordHash) {
        return null;
      }

      const isPasswordValid = await verifyPassword(parsed.data.password, user.passwordHash);

      if (!isPasswordValid) {
        return null;
      }

      const isAdminLogin = credentials?.loginMode === "admin";

      if (isAdminLogin && user.role !== "admin") {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: (user.role === "admin" ? "admin" : "customer") as "admin" | "customer",
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  baseProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const email = profile.email ?? "";
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          const usersCount = await prisma.user.count();
          const bootstrapRole = usersCount === 0 ? "admin" : "customer";

          const newUser = await prisma.user.create({
            data: {
              email,
              name: profile.name ?? profile.email ?? undefined,
              provider: "google",
              role: bootstrapRole,
            },
          });

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: (newUser.role === "admin" ? "admin" : "customer") as "admin" | "customer",
          };
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user.role === "admin" ? "admin" : "customer") as "admin" | "customer",
        };
      },
    }),
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: baseProviders,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role === "admin" ? "admin" : "customer";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token as JWT & { role?: string }).role ?? "customer";
      }

      return session;
    },
  },
};