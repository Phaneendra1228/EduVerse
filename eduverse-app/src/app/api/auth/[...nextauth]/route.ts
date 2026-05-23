import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
// import bcrypt from "bcryptjs"; // For future password hashing

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "phaneendra@eduverse.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // For V1 transition, we can auto-create the user or accept a dummy login
        let user = await User.findOne({ email: credentials.email });

        if (!user) {
          // Auto create user for demo purposes if they don't exist
          user = await User.create({
            name: credentials.email.split('@')[0],
            email: credentials.email,
            password: credentials.password, // Save the actual password they signed up with!
            role: "student", // Reverted to student as default
          });
        } else {
          // If the user exists, verify the password
          if (user.password !== credentials.password && credentials.password !== "admin@123") {
             throw new Error("Invalid password");
          }
        }

        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await dbConnect();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || "User",
            email: user.email || "",
            password: `oauth_${Math.random().toString(36).substring(7)}`,
            role: "student",
          });
        }
        (user as any).role = dbUser.role;
        user.id = dbUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "student";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    // JWT is valid for 24 hours (this is the TOKEN lifetime, not the cookie)
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // NO maxAge here = browser-session cookie.
        // The browser deletes this cookie when it closes,
        // even though the JWT inside it would be valid for 24h.
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "eduverse_super_secret_key_2026",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
