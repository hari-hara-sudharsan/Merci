"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit3, Sparkles } from "lucide-react";

interface InputModeSelectorProps {
    onSelectMode: (mode: "form" | "upload") => void;
}

export default function InputModeSelector({ onSelectMode }: InputModeSelectorProps) {
    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-foreground mb-3">
                        Welcome to BizIntel
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let's get your business set up. Choose how you'd like to provide your information.
                    </p>
                </div>

                {/* Mode Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Manual Form Mode */}
                    <Card
                        variant="glass"
                        hoverable
                        className="cursor-pointer group"
                        onClick={() => onSelectMode("form")}
                    >
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="inline-flex p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                <Edit3 className="h-12 w-12 text-primary" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Fill Out Form
                                </h2>
                                <p className="text-muted-foreground">
                                    Manually enter your business information step by step
                                </p>
                            </div>

                            <div className="pt-4 space-y-2 text-sm text-left">
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        Complete control over your data
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        4 simple steps to complete
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        Takes about 5 minutes
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <div className="px-4 py-2 bg-primary text-white rounded-lg font-semibold group-hover:bg-primary/90 transition-colors">
                                    Start Form
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document Upload Mode */}
                    <Card
                        variant="glass"
                        hoverable
                        className="cursor-pointer group relative overflow-hidden"
                        onClick={() => onSelectMode("upload")}
                    >
                        {/* AI Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI Powered
                        </div>

                        <CardContent className="p-8 text-center space-y-4">
                            <div className="inline-flex p-4 bg-accent/10 rounded-2xl group-hover:bg-accent/20 transition-colors">
                                <FileText className="h-12 w-12 text-accent" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Upload Documents
                                </h2>
                                <p className="text-muted-foreground">
                                    Let AI extract information from your business documents
                                </p>
                            </div>

                            <div className="pt-4 space-y-2 text-sm text-left">
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        Fast and automated
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        Upload PDFs, Excel, or Word files
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        AI extracts key business data
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <div className="px-4 py-2 bg-accent text-white rounded-lg font-semibold group-hover:bg-accent/90 transition-colors">
                                    Upload Documents
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    Don't worry, you can always update your information later from the dashboard
                </p>
            </div>
        </div>
    );
}
