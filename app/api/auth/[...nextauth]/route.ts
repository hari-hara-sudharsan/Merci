import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide email and password");
                }

                try {
                    await connectDB();

                    // Find user by email
                    const user = await User.findOne({ email: credentials.email }).select(
                        "+password"
                    );

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    // Check if password matches
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid email or password");
                    }

                    // Return user object (without password)
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        businessName: user.businessName,
                        onboardingComplete: user.onboardingComplete,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed");
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
        signIn: "/login",
        signOut: "/",
        error: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            // Add user data to token on sign in
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.businessName = (user as any).businessName;
                token.onboardingComplete = (user as any).onboardingComplete;
            }
            return token;
        },

        async session({ session, token }) {
            // Add token data to session
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    businessName: token.businessName as string,
                    onboardingComplete: token.onboardingComplete as boolean,
                };
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
