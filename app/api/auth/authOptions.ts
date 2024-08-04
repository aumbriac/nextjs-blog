import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import User from "@/app/models/User";
import connect from "@/app/utils/connect";

const signInPage = "/";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id || user.sub;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.userId || token.sub;
        session.user.provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        await connect();
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                name: user.name,
                image: user.image,
              },
              $addToSet: {
                providers: account?.provider,
              },
            },
            { new: true }
          );
        } else {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            providers: [account?.provider],
          });
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      const isSigninPage = url.includes("api/auth/signin");
      return isSigninPage
        ? signInPage
        : url.startsWith(baseUrl)
        ? url
        : baseUrl;
    },
  },
  pages: {
    signIn: signInPage,
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
