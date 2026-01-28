/**
 * Trends analysis and utility functions
 */

export interface TrendAnalysis {
    relevanceScore: number; // 0-100
    businessImpact: "low" | "medium" | "high";
    actionability: number; // 0-100
    urgency: "low" | "medium" | "high";
    recommendations: string[];
}

/**
 * Analyze trend relevance to a business
 * @param trend - Trend data
 * @param business - Business data
 * @returns Trend analysis
 */
export function analyzeTrendRelevance(trend: any, business: any): TrendAnalysis {
    let relevanceScore = 0;
    let actionability = 50;
    let urgency: "low" | "medium" | "high" = "medium";

    // Industry match (40 points)
    if (trend.industry === business.industry) {
        relevanceScore += 40;
    } else if (trend.relatedIndustries?.includes(business.industry)) {
        relevanceScore += 20;
    }

    // Impact level (30 points)
    if (trend.impact === "high") {
        relevanceScore += 30;
        urgency = "high";
    } else if (trend.impact === "medium") {
        relevanceScore += 20;
        urgency = "medium";
    } else {
        relevanceScore += 10;
        urgency = "low";
    }

    // Confidence score (20 points)
    relevanceScore += (trend.confidence / 100) * 20;

    // Timeframe (10 points)
    if (trend.timeframe === "short_term") {
        relevanceScore += 10;
        actionability += 20;
        urgency = urgency === "low" ? "medium" : "high";
    } else if (trend.timeframe === "medium_term") {
        relevanceScore += 7;
        actionability += 10;
    } else {
        relevanceScore += 5;
    }

    // Determine business impact
    let businessImpact: "low" | "medium" | "high";
    if (relevanceScore >= 70) {
        businessImpact = "high";
    } else if (relevanceScore >= 40) {
        businessImpact = "medium";
    } else {
        businessImpact = "low";
    }

    // Generate recommendations
    const recommendations = generateRecommendations(trend, business, relevanceScore);

    return {
        relevanceScore: Math.round(relevanceScore),
        businessImpact,
        actionability: Math.min(100, actionability),
        urgency,
        recommendations,
    };
}

/**
 * Generate recommendations based on trend
 * @param trend - Trend data
 * @param business - Business data
 * @param relevanceScore - Calculated relevance score
 * @returns Array of recommendations
 */
function generateRecommendations(
    trend: any,
    business: any,
    relevanceScore: number
): string[] {
    const recommendations: string[] = [];

    if (relevanceScore >= 70) {
        recommendations.push("This trend is highly relevant to your business. Consider immediate action.");
    }

    if (trend.timeframe === "short_term") {
        recommendations.push("Act quickly - this is a short-term trend with immediate impact.");
    }

    if (trend.impact === "high") {
        recommendations.push("High impact trend - allocate resources to capitalize on this opportunity.");
    }

    if (trend.category === "technology") {
        recommendations.push("Evaluate technology adoption to stay competitive.");
    } else if (trend.category === "regulatory") {
        recommendations.push("Review compliance requirements and adjust operations accordingly.");
    } else if (trend.category === "consumer") {
        recommendations.push("Adapt your offerings to meet changing consumer preferences.");
    }

    if (trend.aiInsights?.opportunities?.length > 0) {
        recommendations.push(`Explore opportunities: ${trend.aiInsights.opportunities[0]}`);
    }

    return recommendations;
}

/**
 * Group trends by category
 * @param trends - Array of trends
 * @returns Grouped trends
 */
export function groupTrendsByCategory(trends: any[]) {
    return {
        technology: trends.filter((t) => t.category === "technology"),
        market: trends.filter((t) => t.category === "market"),
        consumer: trends.filter((t) => t.category === "consumer"),
        regulatory: trends.filter((t) => t.category === "regulatory"),
        economic: trends.filter((t) => t.category === "economic"),
        social: trends.filter((t) => t.category === "social"),
    };
}

/**
 * Get top trends by impact
 * @param trends - Array of trends
 * @param limit - Number of trends to return
 * @returns Top trends
 */
export function getTopTrends(trends: any[], limit: number = 5) {
    return trends
        .sort((a, b) => {
            // Sort by impact first
            const impactOrder = { high: 0, medium: 1, low: 2 };
            const impactDiff = impactOrder[a.impact as keyof typeof impactOrder] -
                impactOrder[b.impact as keyof typeof impactOrder];

            if (impactDiff !== 0) return impactDiff;

            // Then by confidence
            return b.confidence - a.confidence;
        })
        .slice(0, limit);
}

/**
 * Filter trends by timeframe
 * @param trends - Array of trends
 * @param timeframe - Timeframe to filter by
 * @returns Filtered trends
 */
export function filterTrendsByTimeframe(
    trends: any[],
    timeframe: "short_term" | "medium_term" | "long_term"
) {
    return trends.filter((t) => t.timeframe === timeframe);
}

/**
 * Calculate trend momentum (based on data points)
 * @param trend - Trend with data points
 * @returns Momentum score (-100 to 100)
 */
export function calculateTrendMomentum(trend: any): number {
    if (!trend.dataPoints || trend.dataPoints.length < 2) {
        return 0;
    }

    const points = trend.dataPoints.sort(
        (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate average change between consecutive points
    let totalChange = 0;
    for (let i = 1; i < points.length; i++) {
        const change = ((points[i].value - points[i - 1].value) / points[i - 1].value) * 100;
        totalChange += change;
    }

    const momentum = totalChange / (points.length - 1);
    return Math.max(-100, Math.min(100, momentum));
}

/**
 * Get trend statistics
 * @param trends - Array of trends
 * @returns Statistics object
 */
export function getTrendStatistics(trends: any[]) {
    const total = trends.length;
    const byImpact = {
        high: trends.filter((t) => t.impact === "high").length,
        medium: trends.filter((t) => t.impact === "medium").length,
        low: trends.filter((t) => t.impact === "low").length,
    };
    const byTimeframe = {
        short_term: trends.filter((t) => t.timeframe === "short_term").length,
        medium_term: trends.filter((t) => t.timeframe === "medium_term").length,
        long_term: trends.filter((t) => t.timeframe === "long_term").length,
    };
    const byCategory = {
        technology: trends.filter((t) => t.category === "technology").length,
        market: trends.filter((t) => t.category === "market").length,
        consumer: trends.filter((t) => t.category === "consumer").length,
        regulatory: trends.filter((t) => t.category === "regulatory").length,
        economic: trends.filter((t) => t.category === "economic").length,
        social: trends.filter((t) => t.category === "social").length,
    };
    const averageConfidence =
        trends.reduce((sum, t) => sum + t.confidence, 0) / total || 0;

    return {
        total,
        byImpact,
        byTimeframe,
        byCategory,
        averageConfidence: Math.round(averageConfidence),
    };
}

/**
 * Format trend for display
 * @param trend - Trend data
 * @returns Formatted trend
 */
export function formatTrendForDisplay(trend: any) {
    return {
        ...trend,
        impactBadge: getImpactBadge(trend.impact),
        timeframeBadge: getTimeframeBadge(trend.timeframe),
        categoryIcon: getCategoryIcon(trend.category),
        confidenceLevel: getConfidenceLevel(trend.confidence),
    };
}

function getImpactBadge(impact: string) {
    const badges = {
        high: { color: "red", label: "High Impact" },
        medium: { color: "orange", label: "Medium Impact" },
        low: { color: "green", label: "Low Impact" },
    };
    return badges[impact as keyof typeof badges];
}

function getTimeframeBadge(timeframe: string) {
    const badges = {
        short_term: { label: "0-1 Year", icon: "⚡" },
        medium_term: { label: "1-3 Years", icon: "📅" },
        long_term: { label: "3+ Years", icon: "🔮" },
    };
    return badges[timeframe as keyof typeof badges];
}

function getCategoryIcon(category: string) {
    const icons = {
        technology: "💻",
        market: "📈",
        consumer: "👥",
        regulatory: "⚖️",
        economic: "💰",
        social: "🌍",
    };
    return icons[category as keyof typeof icons] || "📊";
}

function getConfidenceLevel(confidence: number) {
    if (confidence >= 80) return "Very High";
    if (confidence >= 60) return "High";
    if (confidence >= 40) return "Medium";
    if (confidence >= 20) return "Low";
    return "Very Low";
}
