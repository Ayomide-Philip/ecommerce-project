import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "./libs/models/users.models";
import { BETTER_AUTH_SECRET, BASE_URL } from "./libs/config/config";
import bcrypt from "bcrypt";
import { connectToDatabase } from "./libs/config/database.config";

if (BASE_URL) {
  process.env.AUTH_URL = BASE_URL;
}

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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
        await connectToDatabase();

        const user = await User.findOne({ email: email?.trim() }).select(
          "+password",
        );

        if (!user) {
          console.log("User not found");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password);

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        return {
          id: user?._id?.toString(),
          name: user?.name,
          email: user?.email,
          role: user?.role,
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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: BETTER_AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});
