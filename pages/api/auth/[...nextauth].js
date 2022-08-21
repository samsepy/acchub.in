import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        const userId = user.id;
        session.user.id = userId;
        const userData = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: { profile: true },
        });
        session.user.profile = userData?.profile ?? null;
      }

      return session;
    },
  },
});
