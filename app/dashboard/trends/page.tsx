"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, Bookmark, Eye, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getTrendStatistics, formatTrendForDisplay } from "@/lib/trends";

const CATEGORIES = [
    { id: "all", label: "All Categories", icon: "📊" },
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "market", label: "Market", icon: "📈" },
    { id: "consumer", label: "Consumer", icon: "👥" },
    { id: "regulatory", label: "Regulatory", icon: "⚖️" },
    { id: "economic", label: "Economic", icon: "💰" },
    { id: "social", label: "Social", icon: "🌍" },
];

const IMPACT_FILTERS = [
    { id: "all", label: "All Impact" },
    { id: "high", label: "High Impact" },
    { id: "medium", label: "Medium Impact" },
    { id: "low", label: "Low Impact" },
];

const TIMEFRAME_FILTERS = [
    { id: "all", label: "All Timeframes" },
    { id: "short_term", label: "Short-term (0-1yr)" },
    { id: "medium_term", label: "Medium-term (1-3yr)" },
    { id: "long_term", label: "Long-term (3+yr)" },
];

export default function TrendsPage() {
    const { data: session } = useSession();
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedImpact, setSelectedImpact] = useState("all");
    const [selectedTimeframe, setSelectedTimeframe] = useState("all");

    useEffect(() => {
        fetchTrends();
    }, [selectedCategory, selectedImpact, selectedTimeframe]);

    const fetchTrends = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== "all") params.append("category", selectedCategory);
            if (selectedImpact !== "all") params.append("impact", selectedImpact);
            if (selectedTimeframe !== "all") params.append("timeframe", selectedTimeframe);

            const response = await fetch(`/api/trends/fetch?${params.toString()}`);
            const data = await response.json();

            if (response.ok) {
                setTrends(data.trends || []);
            }
        } catch (error) {
            console.error("Failed to fetch trends:", error);
        } finally {
            setLoading(false);
        }
    };

    const statistics = trends.length > 0 ? getTrendStatistics(trends) : null;

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading trends...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Market Trends</h1>
                        <p className="text-muted-foreground mt-1">
                            Stay ahead with AI-powered market intelligence
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Trends</p>
                                        <p className="text-2xl font-bold text-foreground">{statistics.total}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-500/10 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">High Impact</p>
                                        <p className="text-2xl font-bold text-foreground">{statistics.byImpact.high}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-orange-500/10 rounded-lg">
                                        <Calendar className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Short-term</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {statistics.byTimeframe.short_term}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Filter className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Avg Confidence</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {statistics.averageConfidence}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card variant="glass">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Category Filter */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                                                    ? "bg-primary text-white"
                                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                                }`}
                                        >
                                            <span className="mr-2">{category.icon}</span>
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Impact & Timeframe Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-3">Impact</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {IMPACT_FILTERS.map((filter) => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setSelectedImpact(filter.id)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedImpact === filter.id
                                                        ? "bg-primary text-white"
                                                        : "bg-muted hover:bg-muted/80 text-foreground"
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-foreground mb-3">Timeframe</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {TIMEFRAME_FILTERS.map((filter) => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setSelectedTimeframe(filter.id)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedTimeframe === filter.id
                                                        ? "bg-primary text-white"
                                                        : "bg-muted hover:bg-muted/80 text-foreground"
                                                    }`}
                                            >
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trends List */}
                <div className="grid grid-cols-1 gap-4">
                    {trends.length === 0 ? (
                        <Card variant="glass">
                            <CardContent className="p-12 text-center">
                                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-semibold text-foreground mb-2">No trends found</p>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your filters to see more trends
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        trends.map((trend) => {
                            const formatted = formatTrendForDisplay(trend);
                            return (
                                <Card key={trend._id} variant="glass">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                {/* Header */}
                                                <div className="flex items-start gap-3 mb-3">
                                                    <span className="text-3xl">{formatted.categoryIcon}</span>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-foreground mb-1">
                                                            {trend.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">{trend.description}</p>
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
                                                </div>

                                                {/* AI Insights */}
                                                {trend.aiInsights && (
                                                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            <strong className="text-foreground">AI Summary:</strong>{" "}
                                                            {trend.aiInsights.summary}
                                                        </p>
                                                        {trend.aiInsights.opportunities?.length > 0 && (
                                                            <div className="text-sm">
                                                                <strong className="text-foreground">Opportunities:</strong>
                                                                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                                                                    {trend.aiInsights.opportunities.slice(0, 2).map((opp: string, i: number) => (
                                                                        <li key={i}>{opp}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
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
                                                <Button variant="outline" size="sm">
                                                    <Bookmark className="h-4 w-4 mr-1" />
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
