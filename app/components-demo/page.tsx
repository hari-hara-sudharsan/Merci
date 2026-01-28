"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Mail, Lock, Search, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function ComponentsDemo() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col gradient-bg">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 space-y-16">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <h1 className="text-5xl font-display font-bold text-primary">
                        UI Components Demo
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Interactive components with smooth animations and beautiful design
                    </p>
                </section>

                {/* Buttons */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Buttons</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary Button</Button>
                                <Button variant="secondary">Secondary Button</Button>
                                <Button variant="accent">Accent Button</Button>
                                <Button variant="outline">Outline Button</Button>
                                <Button variant="ghost">Ghost Button</Button>
                                <Button variant="destructive">Destructive</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                                <Button size="xl">Extra Large</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-foreground">With Icons</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button icon={<Sparkles className="h-5 w-5" />}>
                                    Get Started
                                </Button>
                                <Button
                                    variant="accent"
                                    icon={<ArrowRight className="h-5 w-5" />}
                                    iconPosition="right"
                                >
                                    Continue
                                </Button>
                                <Button
                                    variant="outline"
                                    icon={<TrendingUp className="h-5 w-5" />}
                                >
                                    View Analytics
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-foreground">States</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button loading>Loading...</Button>
                                <Button disabled>Disabled</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Inputs */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Inputs</h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail className="h-5 w-5" />}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock className="h-5 w-5" />}
                        />

                        <Input
                            label="Search"
                            type="text"
                            placeholder="Search..."
                            icon={<Search className="h-5 w-5" />}
                            iconPosition="right"
                        />

                        <Input
                            label="With Error"
                            type="text"
                            placeholder="Enter value"
                            error="This field is required"
                        />
                    </div>
                </section>

                {/* Cards */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Cards</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card variant="default">
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>Standard card with border and shadow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This is the default card variant with a clean, professional look.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm" variant="outline">Learn More</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Glass Card</CardTitle>
                                <CardDescription>Glassmorphism effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Beautiful glass effect with backdrop blur for a modern feel.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm" variant="accent">Explore</Button>
                            </CardFooter>
                        </Card>

                        <Card variant="bordered" hoverable>
                            <CardHeader>
                                <CardTitle>Hoverable Card</CardTitle>
                                <CardDescription>Hover to see effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This card lifts up and shows shadow on hover for interactivity.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm">Click Me</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                {/* Modal */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Modal</h2>

                    <div>
                        <Button onClick={() => setModalOpen(true)}>
                            Open Modal
                        </Button>

                        <Modal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            title="Welcome to BizIntel"
                            description="This is a modal dialog with backdrop blur and smooth animations"
                            size="md"
                        >
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    This modal demonstrates the component's features including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                    <li>Backdrop blur effect</li>
                                    <li>Escape key to close</li>
                                    <li>Click outside to close</li>
                                    <li>Smooth animations</li>
                                    <li>Multiple size options</li>
                                    <li>Body scroll prevention</li>
                                </ul>
                                <div className="flex gap-3 pt-4">
                                    <Button onClick={() => setModalOpen(false)}>
                                        Got it!
                                    </Button>
                                    <Button variant="outline" onClick={() => setModalOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
