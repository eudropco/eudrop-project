import NextAuth, { type NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import { User } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (isPasswordCorrect) {
          return user
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.membershipTier = (user as User).membershipTier;
        token.username = (user as User).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.membershipTier = token.membershipTier as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };