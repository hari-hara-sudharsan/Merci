/**
 * Competitor analysis and utility functions
 */

import { ICompetitor } from "@/models/Competitor";

export interface CompetitorThreatAnalysis {
    threatLevel: "low" | "medium" | "high";
    score: number; // 0-100
    factors: {
        proximity: number; // 0-100
        marketShare: number; // 0-100
        revenue: number; // 0-100
        overall: number; // 0-100
    };
    recommendations: string[];
}

/**
 * Analyze competitor threat level based on multiple factors
 * @param competitor - Competitor data
 * @param userRevenue - User's business revenue
 * @returns Threat analysis
 */
export function analyzeCompetitorThreat(
    competitor: any,
    userRevenue?: number
): CompetitorThreatAnalysis {
    let proximityScore = 0;
    let marketShareScore = 0;
    let revenueScore = 0;

    // Proximity score (closer = higher threat)
    if (competitor.distance !== undefined) {
        if (competitor.distance < 5) proximityScore = 100;
        else if (competitor.distance < 10) proximityScore = 80;
        else if (competitor.distance < 25) proximityScore = 60;
        else if (competitor.distance < 50) proximityScore = 40;
        else if (competitor.distance < 100) proximityScore = 20;
        else proximityScore = 10;
    }

    // Market share score
    if (competitor.marketShare !== undefined) {
        marketShareScore = competitor.marketShare;
    }

    // Revenue score (relative to user's revenue)
    if (competitor.estimatedRevenue && userRevenue) {
        const ratio = competitor.estimatedRevenue / userRevenue;
        if (ratio >= 2) revenueScore = 100;
        else if (ratio >= 1.5) revenueScore = 80;
        else if (ratio >= 1) revenueScore = 60;
        else if (ratio >= 0.5) revenueScore = 40;
        else revenueScore = 20;
    } else if (competitor.estimatedRevenue) {
        // Absolute revenue score if user revenue not available
        if (competitor.estimatedRevenue > 10000000) revenueScore = 100;
        else if (competitor.estimatedRevenue > 5000000) revenueScore = 80;
        else if (competitor.estimatedRevenue > 1000000) revenueScore = 60;
        else if (competitor.estimatedRevenue > 500000) revenueScore = 40;
        else revenueScore = 20;
    }

    // Calculate overall score
    const overallScore = Math.round(
        (proximityScore * 0.4 + marketShareScore * 0.3 + revenueScore * 0.3)
    );

    // Determine threat level
    let threatLevel: "low" | "medium" | "high";
    if (overallScore >= 70) threatLevel = "high";
    else if (overallScore >= 40) threatLevel = "medium";
    else threatLevel = "low";

    // Generate recommendations
    const recommendations: string[] = [];

    if (proximityScore >= 80) {
        recommendations.push("Consider local marketing to strengthen your presence");
    }
    if (marketShareScore >= 70) {
        recommendations.push("Focus on differentiation and unique value propositions");
    }
    if (revenueScore >= 70) {
        recommendations.push("Analyze their pricing strategy and service offerings");
    }
    if (competitor.strengths && competitor.strengths.length > 0) {
        recommendations.push("Study their strengths and find opportunities to compete");
    }

    return {
        threatLevel,
        score: overallScore,
        factors: {
            proximity: proximityScore,
            marketShare: marketShareScore,
            revenue: revenueScore,
            overall: overallScore,
        },
        recommendations,
    };
}

/**
 * Format competitor data for 3D globe visualization
 * @param competitors - Array of competitors
 * @returns Formatted data for Globe.GL
 */
export function formatCompetitorsForGlobe(competitors: any[]) {
    return competitors.map((competitor) => ({
        lat: competitor.location.coordinates.lat,
        lng: competitor.location.coordinates.lng,
        name: competitor.name,
        industry: competitor.industry,
        distance: competitor.distance,
        revenue: competitor.estimatedRevenue,
        employees: competitor.employeeCount,
        threatLevel: competitor.aiInsights?.competitiveThreat || "medium",
        size: calculateMarkerSize(competitor),
        color: getThreatColor(competitor.aiInsights?.competitiveThreat || "medium"),
    }));
}

/**
 * Calculate marker size based on competitor metrics
 * @param competitor - Competitor data
 * @returns Marker size (0.1 - 1.0)
 */
function calculateMarkerSize(competitor: any): number {
    let size = 0.3; // Base size

    // Increase size based on revenue
    if (competitor.estimatedRevenue) {
        if (competitor.estimatedRevenue > 10000000) size += 0.4;
        else if (competitor.estimatedRevenue > 5000000) size += 0.3;
        else if (competitor.estimatedRevenue > 1000000) size += 0.2;
        else size += 0.1;
    }

    // Increase size based on market share
    if (competitor.marketShare) {
        size += competitor.marketShare / 200; // 0-0.5 additional
    }

    return Math.min(size, 1.0); // Cap at 1.0
}

/**
 * Get color based on threat level
 * @param threatLevel - Threat level
 * @returns Hex color code
 */
function getThreatColor(threatLevel: "low" | "medium" | "high"): string {
    switch (threatLevel) {
        case "high":
            return "#EF4444"; // Red
        case "medium":
            return "#F59E0B"; // Orange
        case "low":
            return "#10B981"; // Green
        default:
            return "#6B7280"; // Gray
    }
}

/**
 * Group competitors by proximity
 * @param competitors - Array of competitors
 * @returns Grouped competitors
 */
export function groupCompetitorsByProximity(competitors: any[]) {
    return {
        nearby: competitors.filter((c) => c.distance && c.distance < 10),
        local: competitors.filter((c) => c.distance && c.distance >= 10 && c.distance < 50),
        regional: competitors.filter((c) => c.distance && c.distance >= 50 && c.distance < 200),
        distant: competitors.filter((c) => c.distance && c.distance >= 200),
    };
}

/**
 * Get top competitors by threat level
 * @param competitors - Array of competitors
 * @param userRevenue - User's business revenue
 * @param limit - Number of top competitors to return
 * @returns Top competitors with threat analysis
 */
export function getTopCompetitors(
    competitors: any[],
    userRevenue?: number,
    limit: number = 5
) {
    const analyzed = competitors.map((competitor) => ({
        ...competitor,
        threatAnalysis: analyzeCompetitorThreat(competitor, userRevenue),
    }));

    return analyzed
        .sort((a, b) => b.threatAnalysis.score - a.threatAnalysis.score)
        .slice(0, limit);
}

/**
 * Calculate market concentration (Herfindahl-Hirschman Index)
 * @param competitors - Array of competitors with market share
 * @returns HHI score (0-10000)
 */
export function calculateMarketConcentration(competitors: any[]): number {
    const competitorsWithShare = competitors.filter((c) => c.marketShare);

    if (competitorsWithShare.length === 0) return 0;

    const hhi = competitorsWithShare.reduce((sum, competitor) => {
        return sum + Math.pow(competitor.marketShare, 2);
    }, 0);

    return Math.round(hhi);
}
