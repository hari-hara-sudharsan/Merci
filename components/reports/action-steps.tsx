"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Circle } from "lucide-react";

interface ActionStepsProps {
    recommendations: {
        priority: "high" | "medium" | "low";
        title: string;
        description: string;
        actionItems?: string[];
    }[];
}

export default function ActionSteps({ recommendations }: ActionStepsProps) {
    // Sort by priority
    const sortedRecommendations = [...recommendations].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case "high":
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case "medium":
                return <AlertCircle className="h-5 w-5 text-orange-600" />;
            case "low":
                return <Circle className="h-5 w-5 text-green-600" />;
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            high: "bg-red-100 text-red-700 border-red-200",
            medium: "bg-orange-100 text-orange-700 border-orange-200",
            low: "bg-green-100 text-green-700 border-green-200",
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[priority as keyof typeof styles]
                    }`}
            >
                {priority.toUpperCase()} PRIORITY
            </span>
        );
    };

    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedRecommendations.map((recommendation, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${recommendation.priority === "high"
                                ? "bg-red-50/50 border-red-200"
                                : recommendation.priority === "medium"
                                    ? "bg-orange-50/50 border-orange-200"
                                    : "bg-green-50/50 border-green-200"
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                                {getPriorityIcon(recommendation.priority)}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground mb-1">
                                        {recommendation.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {recommendation.description}
                                    </p>
                                </div>
                            </div>
                            {getPriorityBadge(recommendation.priority)}
                        </div>

                        {/* Action Items */}
                        {recommendation.actionItems && recommendation.actionItems.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-current/10">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                    Action Items:
                                </h4>
                                <div className="space-y-2">
                                    {recommendation.actionItems.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="flex items-start gap-3 p-2 bg-white/50 rounded hover:bg-white/80 transition-colors cursor-pointer group"
                                        >
                                            <div className="mt-0.5">
                                                <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 group-hover:border-primary transition-colors flex items-center justify-center">
                                                    <CheckCircle2 className="h-3 w-3 text-transparent group-hover:text-primary transition-colors" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground flex-1">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Summary */}
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-1">Next Steps</h4>
                            <p className="text-sm text-muted-foreground">
                                Focus on high-priority recommendations first. These actions will have the
                                most immediate impact on your business growth and competitive positioning.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
