"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Eye, TrendingUp, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatTrendForDisplay } from "@/lib/trends";

interface TrendCardProps {
    trend: any;
    onBookmark?: (trendId: string) => void;
    isBookmarked?: boolean;
}

export default function TrendCard({ trend, onBookmark, isBookmarked = false }: TrendCardProps) {
    const [expanded, setExpanded] = useState(false);
    const formatted = formatTrendForDisplay(trend);

    const handleBookmark = () => {
        if (onBookmark) {
            onBookmark(trend._id);
        }
    };

    return (
        <Card variant="glass">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-3xl flex-shrink-0">{formatted.categoryIcon}</span>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {trend.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {trend.description}
                                </p>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${trend.impact === "high"
                                        ? "bg-red-100 text-red-700"
                                        : trend.impact === "medium"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {formatted.impactBadge.label}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                {formatted.timeframeBadge.icon} {formatted.timeframeBadge.label}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground">
                                {formatted.confidenceLevel} Confidence ({trend.confidence}%)
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                                {trend.industry}
                            </span>
                        </div>

                        {/* AI Insights */}
                        {trend.aiInsights && (
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    <strong className="text-foreground">AI Summary:</strong>{" "}
                                    {trend.aiInsights.summary}
                                </p>

                                {expanded && (
                                    <>
                                        {trend.aiInsights.opportunities?.length > 0 && (
                                            <div className="text-sm mb-2">
                                                <strong className="text-foreground">💡 Opportunities:</strong>
                                                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                                    {trend.aiInsights.opportunities.map((opp: string, i: number) => (
                                                        <li key={i}>{opp}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {trend.aiInsights.threats?.length > 0 && (
                                            <div className="text-sm mb-2">
                                                <strong className="text-foreground">⚠️ Threats:</strong>
                                                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                                    {trend.aiInsights.threats.map((threat: string, i: number) => (
                                                        <li key={i}>{threat}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {trend.aiInsights.recommendations?.length > 0 && (
                                            <div className="text-sm">
                                                <strong className="text-foreground">🎯 Recommendations:</strong>
                                                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                                    {trend.aiInsights.recommendations.map((rec: string, i: number) => (
                                                        <li key={i}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}

                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="text-xs text-primary hover:underline mt-2 flex items-center gap-1"
                                >
                                    {expanded ? (
                                        <>
                                            <ChevronUp className="h-3 w-3" />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-3 w-3" />
                                            Show more insights
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Metrics */}
                        {trend.metrics && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {trend.metrics.growthRate !== undefined && (
                                    <div className="p-2 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Growth Rate</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {trend.metrics.growthRate > 0 ? "+" : ""}
                                            {trend.metrics.growthRate}%
                                        </p>
                                    </div>
                                )}
                                {trend.metrics.marketSize !== undefined && (
                                    <div className="p-2 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Market Size</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            ₹{(trend.metrics.marketSize / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                )}
                                {trend.metrics.adoptionRate !== undefined && (
                                    <div className="p-2 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Adoption Rate</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {trend.metrics.adoptionRate}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sources */}
                        {expanded && trend.sources?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-foreground mb-2">Sources:</h4>
                                <div className="space-y-1">
                                    {trend.sources.slice(0, 3).map((source: any, i: number) => (
                                        <a
                                            key={i}
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {source.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {trend.views || 0} views
                            </span>
                            <span className="flex items-center gap-1">
                                <Bookmark className="h-3 w-3" />
                                {trend.bookmarks || 0} bookmarks
                            </span>
                            <span>{formatDate(trend.createdAt)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Button
                            variant={isBookmarked ? "default" : "outline"}
                            size="sm"
                            onClick={handleBookmark}
                        >
                            <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
                            {isBookmarked ? "Saved" : "Save"}
                        </Button>
                        <Button variant="outline" size="sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Analyze
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
