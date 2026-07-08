import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "./libs/models/users.models";
import { BETTER_AUTH_SECRET } from "./libs/config/config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          console.log("Email or password is missing");
          return null;
        }

        const user = await User.findOne({ email: email?.trim() }).select(
          "+password",
        );

        if (!user) {
          console.log("User not found");
          return null;
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        return {
          id: user?._id?.toString(),
          name: user?.name,
          email: user?.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: BETTER_AUTH_SECRET,
});
