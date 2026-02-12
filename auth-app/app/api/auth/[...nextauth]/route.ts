import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User"; // use alias instead of ../../..
import { connectDB } from "@/lib/db";
import type { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
