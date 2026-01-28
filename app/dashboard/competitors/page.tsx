"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { groupCompetitorsByProximity, getTopCompetitors } from "@/lib/competitors";

export default function CompetitorsPage() {
    const { data: session } = useSession();
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [userBusiness, setUserBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null);

    useEffect(() => {
        fetchCompetitors();
    }, []);

    const fetchCompetitors = async () => {
        try {
            const response = await fetch("/api/competitors/fetch");
            const data = await response.json();

            if (response.ok) {
                setCompetitors(data.competitors);
                setUserBusiness(data.userBusiness);
            }
        } catch (error) {
            console.error("Failed to fetch competitors:", error);
        } finally {
            setLoading(false);
        }
    };

    const proximityGroups = groupCompetitorsByProximity(competitors);
    const topCompetitors = getTopCompetitors(competitors, userBusiness?.annualRevenue, 5);

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading competitors...</p>
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
                        <h1 className="text-3xl font-bold text-foreground">Competitor Analysis</h1>
                        <p className="text-muted-foreground mt-1">
                            Visualize and analyze your competitive landscape
                        </p>
                    </div>
                    <Button>
                        Add Competitor
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Competitors</p>
                                    <p className="text-2xl font-bold text-foreground">{competitors.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <MapPin className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Nearby ({"<"}10km)</p>
                                    <p className="text-2xl font-bold text-foreground">{proximityGroups.nearby.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">High Threat</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {competitors.filter((c) => c.aiInsights?.competitiveThreat === "high").length}
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
                                    <p className="text-sm text-muted-foreground">Avg Distance</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {competitors.length > 0
                                            ? Math.round(
                                                competitors.reduce((sum, c) => sum + (c.distance || 0), 0) /
                                                competitors.length
                                            )
                                            : 0}
                                        km
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3D Globe Placeholder */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>3D Competitor Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                            <div className="text-center">
                                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                                <p className="text-lg font-semibold text-foreground mb-2">
                                    3D Globe Visualization
                                </p>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Interactive 3D globe showing competitor locations will be rendered here using Globe.GL
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Competitors */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Top Competitive Threats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCompetitors.map((competitor, index) => (
                                <div
                                    key={competitor._id}
                                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedCompetitor(competitor)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl font-bold text-muted-foreground">
                                                    #{index + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{competitor.industry}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 mt-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Distance</p>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {competitor.distance ? `${competitor.distance.toFixed(1)} km` : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Revenue</p>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {competitor.estimatedRevenue
                                                            ? formatCurrency(competitor.estimatedRevenue)
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Employees</p>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {competitor.employeeCount
                                                            ? formatNumber(competitor.employeeCount)
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${competitor.threatAnalysis.threatLevel === "high"
                                                        ? "bg-red-100 text-red-700"
                                                        : competitor.threatAnalysis.threatLevel === "medium"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {competitor.threatAnalysis.threatLevel.toUpperCase()} THREAT
                                            </span>
                                            <p className="text-sm text-muted-foreground">
                                                Score: {competitor.threatAnalysis.score}/100
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* All Competitors List */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>All Competitors ({competitors.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {competitors.map((competitor) => (
                                <div
                                    key={competitor._id}
                                    className="p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                                    onClick={() => setSelectedCompetitor(competitor)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-foreground">{competitor.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {competitor.location.city}, {competitor.location.state}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-foreground">
                                                {competitor.distance ? `${competitor.distance.toFixed(1)} km` : "N/A"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{competitor.industry}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
