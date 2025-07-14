import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Session, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const myAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, name: true, email: true, password: true, role: true },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        // Don't return password!
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token, user }: { session: Session; token: JWT; user?: NextAuthUser & { role?: string } }) {
      if (session.user && token?.sub) {
        (session.user as any).id = token.sub;
      }
      // Add role to session if available
      if (user?.role && session.user) {
        (session.user as any).role = user.role;
      } else if (token?.role && session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser & { role?: string } }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(myAuthOptions);

export { handler as GET, handler as POST, myAuthOptions as authOptions }; 