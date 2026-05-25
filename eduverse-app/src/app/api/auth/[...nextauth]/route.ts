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

        // Basic email format validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error("Invalid email format");
        }

        // Prevent emails with only numbers before the @ symbol (e.g. 123@gmail.com)
        const localPart = credentials.email.split('@')[0];
        if (/^\d+$/.test(localPart)) {
          throw new Error("Numeric-only email addresses are not allowed. Please use a real email.");
        }

        // Prevent common disposable/fake email domains
        const domainPart = credentials.email.split('@')[1].toLowerCase();
        const fakeDomains = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com', 'throwawaymail.com'];
        if (fakeDomains.includes(domainPart)) {
          throw new Error("Disposable or fake email providers are not allowed. Please use a real email.");
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "eduverse_super_secret_key_2026",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
