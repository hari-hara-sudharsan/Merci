import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border bg-card mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <h3 className="font-display font-bold text-lg text-primary">
                            BizIntel
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Empowering businesses with AI-driven insights and competitor analysis.
                        </p>
                    </div>

                    {/* Product */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/competitors"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Competitor Analysis
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/report"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    AI Reports
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/trends"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Market Trends
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Connect</h4>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-all"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-all"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:contact@bizintel.com"
                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-all"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} BizIntel. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Built for hackathon with ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
