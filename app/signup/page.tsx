"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Crown } from "lucide-react";
import { isValidEmail, validatePassword } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (!isValidEmail(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.valid) {
            setError(passwordValidation.message);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong");
                setLoading(false);
                return;
            }

            // Redirect to login on success
            router.push("/login?registered=true");
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

            {/* Signup Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="glass-card p-8 space-y-6 animate-scale-in">
                    {/* User Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <UserPlus className="h-10 w-10 text-white" />
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
                        Sign up
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <Input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <Input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary font-semibold hover:text-primary/80 transition-colors"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
