"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface SectionCardProps {
    section: {
        title: string;
        content: string;
        insights?: string[];
        charts?: {
            type: "bar" | "line" | "pie" | "area";
            data: any;
            title: string;
        }[];
    };
}

export default function SectionCard({ section }: SectionCardProps) {
    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Content */}
                <div className="prose prose-sm max-w-none">
                    <div
                        className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
                    />
                </div>

                {/* Charts */}
                {section.charts && section.charts.length > 0 && (
                    <div className="space-y-4">
                        {section.charts.map((chart, index) => (
                            <div key={index} className="p-4 bg-muted/30 rounded-lg">
                                <h4 className="font-semibold text-foreground mb-3">{chart.title}</h4>
                                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-dashed border-border">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            📊 {chart.type.toUpperCase()} Chart
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Chart visualization will be rendered here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Key Insights */}
                {section.insights && section.insights.length > 0 && (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-foreground">Key Insights</h4>
                        </div>
                        <ul className="space-y-2">
                            {section.insights.map((insight, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{insight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Format markdown-like content to HTML
 * @param content - Raw content string
 * @returns Formatted HTML string
 */
function formatContent(content: string): string {
    let formatted = content;

    // Bold text: **text** or __text__
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Italic text: *text* or _text_
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formatted = formatted.replace(/_(.*?)_/g, "<em>$1</em>");

    // Bullet points: - item or * item
    formatted = formatted.replace(/^[\-\*]\s+(.+)$/gm, "<li>$1</li>");
    formatted = formatted.replace(/(<li>[\s\S]*<\/li>)/g, "<ul>$1</ul>");

    // Numbered lists: 1. item
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

    // Headings: ### Heading
    formatted = formatted.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    formatted = formatted.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
    formatted = formatted.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

    // Line breaks
    formatted = formatted.replace(/\n\n/g, "</p><p>");
    formatted = `<p>${formatted}</p>`;

    return formatted;
}
