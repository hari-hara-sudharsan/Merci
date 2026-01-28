"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Users,
    FileText,
    Target,
    ArrowRight,
    Plus,
    MapPin,
    AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>({
        business: null,
        competitors: [],
        reports: [],
        trends: [],
        stats: {
            totalCompetitors: 0,
            totalReports: 0,
            highThreatCompetitors: 0,
            activeTrends: 0,
        },
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all dashboard data in parallel
            const [businessRes, competitorsRes, reportsRes, trendsRes] = await Promise.all([
                fetch("/api/business/get"),
                fetch("/api/competitors/fetch?limit=5"),
                fetch("/api/reports/list?limit=5"),
                fetch("/api/trends/fetch?limit=5"),
            ]);

            const business = businessRes.ok ? await businessRes.json() : null;
            const competitors = competitorsRes.ok ? await competitorsRes.json() : { competitors: [] };
            const reports = reportsRes.ok ? await reportsRes.json() : { reports: [] };
            const trends = trendsRes.ok ? await trendsRes.json() : { trends: [] };

            setDashboardData({
                business: business?.business,
                competitors: competitors.competitors || [],
                reports: reports.reports || [],
                trends: trends.trends || [],
                stats: {
                    totalCompetitors: competitors.pagination?.total || 0,
                    totalReports: reports.reports?.length || 0,
                    highThreatCompetitors:
                        competitors.competitors?.filter(
                            (c: any) => c.aiInsights?.competitiveThreat === "high"
                        ).length || 0,
                    activeTrends: trends.trends?.length || 0,
                },
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, {session?.user?.name || "User"}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your business today
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Competitors</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {dashboardData.stats.totalCompetitors}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Reports</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {dashboardData.stats.totalReports}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-500/10 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">High Threats</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {dashboardData.stats.highThreatCompetitors}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Trends</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {dashboardData.stats.activeTrends}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2"
                                onClick={() => router.push("/dashboard/reports")}
                            >
                                <Plus className="h-6 w-6" />
                                <span>Generate Report</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2"
                                onClick={() => router.push("/dashboard/competitors")}
                            >
                                <Target className="h-6 w-6" />
                                <span>Add Competitor</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center gap-2"
                                onClick={() => router.push("/dashboard/trends")}
                            >
                                <TrendingUp className="h-6 w-6" />
                                <span>Explore Trends</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Reports */}
                    <Card variant="glass">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Reports</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push("/dashboard/reports")}
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {dashboardData.reports.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground">No reports yet</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => router.push("/dashboard/reports")}
                                    >
                                        Generate your first report
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dashboardData.reports.slice(0, 5).map((report: any) => (
                                        <div
                                            key={report._id}
                                            className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/dashboard/reports/${report._id}`)}
                                        >
                                            <h4 className="font-semibold text-foreground text-sm mb-1">
                                                {report.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {report.summary}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-semibold ${report.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : report.status === "generating"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {report.status}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Competitors */}
                    <Card variant="glass">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Top Competitive Threats</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push("/dashboard/competitors")}
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {dashboardData.competitors.length === 0 ? (
                                <div className="text-center py-8">
                                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground">No competitors tracked</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => router.push("/dashboard/competitors")}
                                    >
                                        Add your first competitor
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dashboardData.competitors.slice(0, 5).map((competitor: any) => (
                                        <div
                                            key={competitor._id}
                                            className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => router.push("/dashboard/competitors")}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-foreground text-sm mb-1">
                                                        {competitor.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {competitor.location.city}, {competitor.location.state}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-xs font-semibold ${competitor.aiInsights?.competitiveThreat === "high"
                                                            ? "bg-red-100 text-red-700"
                                                            : competitor.aiInsights?.competitiveThreat === "medium"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {competitor.aiInsights?.competitiveThreat || "medium"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Trending Insights */}
                <Card variant="glass">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Trending Market Insights</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/dashboard/trends")}
                            >
                                View all
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.trends.length === 0 ? (
                            <div className="text-center py-8">
                                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-sm text-muted-foreground">No trends available</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {dashboardData.trends.slice(0, 3).map((trend: any) => (
                                    <div
                                        key={trend._id}
                                        className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => router.push("/dashboard/trends")}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-2xl">
                                                {trend.category === "technology"
                                                    ? "💻"
                                                    : trend.category === "market"
                                                        ? "📈"
                                                        : trend.category === "consumer"
                                                            ? "👥"
                                                            : "📊"}
                                            </span>
                                            <h4 className="font-semibold text-foreground text-sm line-clamp-2">
                                                {trend.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${trend.impact === "high"
                                                        ? "bg-red-100 text-red-700"
                                                        : trend.impact === "medium"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {trend.impact}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {trend.confidence}% confidence
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
