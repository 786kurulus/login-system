import NextAuth, { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../../models/User";
import { connectDB } from "../../../../lib/db";

// --- TypeScript fix: extend session and token ---
declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
  interface User extends DefaultUser {
    id: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login?error",
  },
  callbacks: {
    // store id in JWT
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // include id in session.user
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id, // ✅ now TypeScript knows about id
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
