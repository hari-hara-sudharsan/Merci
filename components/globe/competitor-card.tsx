"use client";

import { X, MapPin, DollarSign, Users, Calendar, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { analyzeCompetitorThreat } from "@/lib/competitors";

interface CompetitorCardProps {
    competitor: any;
    userRevenue?: number;
    onClose: () => void;
}

export default function CompetitorCard({ competitor, userRevenue, onClose }: CompetitorCardProps) {
    const threatAnalysis = analyzeCompetitorThreat(competitor, userRevenue);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-2xl">{competitor.name}</CardTitle>
                            <p className="text-muted-foreground mt-1">{competitor.industry}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Threat Level */}
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Competitive Threat Analysis
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${threatAnalysis.threatLevel === "high"
                                        ? "bg-red-100 text-red-700"
                                        : threatAnalysis.threatLevel === "medium"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {threatAnalysis.threatLevel.toUpperCase()} THREAT
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Overall Score</span>
                                <span className="font-semibold">{threatAnalysis.score}/100</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2">
                                <div
                                    className={`h-full rounded-full transition-all ${threatAnalysis.threatLevel === "high"
                                            ? "bg-red-500"
                                            : threatAnalysis.threatLevel === "medium"
                                                ? "bg-orange-500"
                                                : "bg-green-500"
                                        }`}
                                    style={{ width: `${threatAnalysis.score}%` }}
                                />
                            </div>
                        </div>

                        {/* Threat Factors */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="text-center p-2 bg-white/50 rounded">
                                <p className="text-xs text-muted-foreground">Proximity</p>
                                <p className="text-sm font-semibold">{threatAnalysis.factors.proximity}/100</p>
                            </div>
                            <div className="text-center p-2 bg-white/50 rounded">
                                <p className="text-xs text-muted-foreground">Market Share</p>
                                <p className="text-sm font-semibold">{threatAnalysis.factors.marketShare}/100</p>
                            </div>
                            <div className="text-center p-2 bg-white/50 rounded">
                                <p className="text-xs text-muted-foreground">Revenue</p>
                                <p className="text-sm font-semibold">{threatAnalysis.factors.revenue}/100</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Metrics */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">Business Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Distance</p>
                                    <p className="font-semibold text-foreground">
                                        {competitor.distance ? `${competitor.distance.toFixed(1)} km` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Est. Revenue</p>
                                    <p className="font-semibold text-foreground">
                                        {competitor.estimatedRevenue ? formatCurrency(competitor.estimatedRevenue) : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="p-2 bg-accent/10 rounded-lg">
                                    <Users className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Employees</p>
                                    <p className="font-semibold text-foreground">
                                        {competitor.employeeCount ? formatNumber(competitor.employeeCount) : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Established</p>
                                    <p className="font-semibold text-foreground">
                                        {competitor.yearEstablished || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">Location</h3>
                        <p className="text-sm text-muted-foreground">
                            {competitor.location.address}, {competitor.location.city}, {competitor.location.state}{" "}
                            {competitor.location.postalCode}, {competitor.location.country}
                        </p>
                    </div>

                    {/* Description */}
                    {competitor.description && (
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">About</h3>
                            <p className="text-sm text-muted-foreground">{competitor.description}</p>
                        </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-4">
                        {competitor.strengths && competitor.strengths.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-foreground mb-2 text-sm">Strengths</h3>
                                <ul className="space-y-1">
                                    {competitor.strengths.map((strength: string, index: number) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-green-600">✓</span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-foreground mb-2 text-sm">Weaknesses</h3>
                                <ul className="space-y-1">
                                    {competitor.weaknesses.map((weakness: string, index: number) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-red-600">✗</span>
                                            {weakness}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    {threatAnalysis.recommendations.length > 0 && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Recommendations
                            </h3>
                            <ul className="space-y-2">
                                {threatAnalysis.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Website */}
                    {competitor.website && (
                        <div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.open(competitor.website, "_blank")}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Website
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
