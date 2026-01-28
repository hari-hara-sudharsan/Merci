"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Crown } from "lucide-react";
import { isValidEmail } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            // Redirect to dashboard on success
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

            {/* Logo in top-left corner */}
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 group"
            >
                <div className="p-2 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                    <Crown className="h-6 w-6" />
                </div>
            </Link>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="glass-card p-8 space-y-6 animate-scale-in">
                    {/* Email Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <Mail className="h-10 w-10 text-white" />
                            </div>
                            {/* Decorative lines below icon */}
                            <div className="flex justify-center gap-1 mt-3">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                <div className="w-1 h-1 bg-primary rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center text-foreground">
                        Log in
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
