/**
 * Report generation utilities with chart data generation
 */

export interface ChartData {
    type: "bar" | "line" | "pie" | "area" | "histogram";
    title: string;
    data: any;
    options?: any;
}

/**
 * Generate market share pie chart data
 * @param competitors - Array of competitors with market share
 * @param businessName - User's business name
 * @returns Pie chart data
 */
export function generateMarketShareChart(
    competitors: any[],
    businessName: string,
    userMarketShare?: number
): ChartData {
    const data = competitors
        .filter((c) => c.marketShare)
        .map((c) => ({
            name: c.name,
            value: c.marketShare,
        }));

    // Add user's business if market share is provided
    if (userMarketShare) {
        data.unshift({
            name: businessName,
            value: userMarketShare,
        });
    }

    return {
        type: "pie",
        title: "Market Share Distribution",
        data: {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    data: data.map((d) => d.value),
                    backgroundColor: [
                        "#3E4A8A", // Primary (user's business)
                        "#EF4444", // Red
                        "#F59E0B", // Orange
                        "#10B981", // Green
                        "#6366F1", // Indigo
                        "#EC4899", // Pink
                        "#8B5CF6", // Purple
                    ],
                },
            ],
        },
    };
}

/**
 * Generate revenue comparison bar chart
 * @param competitors - Array of competitors with revenue
 * @param businessName - User's business name
 * @param userRevenue - User's business revenue
 * @returns Bar chart data
 */
export function generateRevenueComparisonChart(
    competitors: any[],
    businessName: string,
    userRevenue?: number
): ChartData {
    const data = competitors
        .filter((c) => c.estimatedRevenue)
        .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
        .slice(0, 10)
        .map((c) => ({
            name: c.name,
            revenue: c.estimatedRevenue / 1000000, // Convert to millions
        }));

    // Add user's business
    if (userRevenue) {
        data.unshift({
            name: businessName,
            revenue: userRevenue / 1000000,
        });
    }

    return {
        type: "bar",
        title: "Revenue Comparison (in Millions ₹)",
        data: {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    label: "Revenue (₹M)",
                    data: data.map((d) => d.revenue),
                    backgroundColor: data.map((d, i) =>
                        d.name === businessName ? "#3E4A8A" : "#94A3B8"
                    ),
                },
            ],
        },
    };
}

/**
 * Generate competitor proximity histogram
 * @param competitors - Array of competitors with distance
 * @returns Histogram data
 */
export function generateProximityHistogram(competitors: any[]): ChartData {
    const distances = competitors
        .filter((c) => c.distance !== undefined)
        .map((c) => c.distance);

    // Create bins: 0-10km, 10-25km, 25-50km, 50-100km, 100+km
    const bins = [
        { label: "0-10 km", min: 0, max: 10, count: 0 },
        { label: "10-25 km", min: 10, max: 25, count: 0 },
        { label: "25-50 km", min: 25, max: 50, count: 0 },
        { label: "50-100 km", min: 50, max: 100, count: 0 },
        { label: "100+ km", min: 100, max: Infinity, count: 0 },
    ];

    distances.forEach((distance) => {
        for (const bin of bins) {
            if (distance >= bin.min && distance < bin.max) {
                bin.count++;
                break;
            }
        }
    });

    return {
        type: "histogram",
        title: "Competitor Distribution by Distance",
        data: {
            labels: bins.map((b) => b.label),
            datasets: [
                {
                    label: "Number of Competitors",
                    data: bins.map((b) => b.count),
                    backgroundColor: "#5A7DFF",
                },
            ],
        },
    };
}

/**
 * Generate threat level distribution pie chart
 * @param competitors - Array of competitors with threat levels
 * @returns Pie chart data
 */
export function generateThreatLevelChart(competitors: any[]): ChartData {
    const threatCounts = {
        high: 0,
        medium: 0,
        low: 0,
    };

    competitors.forEach((c) => {
        const threat = c.aiInsights?.competitiveThreat || "medium";
        threatCounts[threat as keyof typeof threatCounts]++;
    });

    return {
        type: "pie",
        title: "Competitive Threat Distribution",
        data: {
            labels: ["High Threat", "Medium Threat", "Low Threat"],
            datasets: [
                {
                    data: [threatCounts.high, threatCounts.medium, threatCounts.low],
                    backgroundColor: ["#EF4444", "#F59E0B", "#10B981"],
                },
            ],
        },
    };
}

/**
 * Generate employee count comparison chart
 * @param competitors - Array of competitors with employee count
 * @param businessName - User's business name
 * @param userEmployees - User's employee count
 * @returns Bar chart data
 */
export function generateEmployeeComparisonChart(
    competitors: any[],
    businessName: string,
    userEmployees?: number
): ChartData {
    const data = competitors
        .filter((c) => c.employeeCount)
        .sort((a, b) => b.employeeCount - a.employeeCount)
        .slice(0, 10)
        .map((c) => ({
            name: c.name,
            employees: c.employeeCount,
        }));

    // Add user's business
    if (userEmployees) {
        data.unshift({
            name: businessName,
            employees: userEmployees,
        });
    }

    return {
        type: "bar",
        title: "Employee Count Comparison",
        data: {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    label: "Employees",
                    data: data.map((d) => d.employees),
                    backgroundColor: data.map((d, i) =>
                        d.name === businessName ? "#3E4A8A" : "#94A3B8"
                    ),
                },
            ],
        },
    };
}

/**
 * Generate industry distribution pie chart
 * @param competitors - Array of competitors
 * @returns Pie chart data
 */
export function generateIndustryDistributionChart(competitors: any[]): ChartData {
    const industryCounts: Record<string, number> = {};

    competitors.forEach((c) => {
        industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
    });

    const sortedIndustries = Object.entries(industryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8); // Top 8 industries

    return {
        type: "pie",
        title: "Competitor Industry Distribution",
        data: {
            labels: sortedIndustries.map(([industry]) => industry),
            datasets: [
                {
                    data: sortedIndustries.map(([, count]) => count),
                    backgroundColor: [
                        "#3E4A8A",
                        "#5A7DFF",
                        "#EF4444",
                        "#F59E0B",
                        "#10B981",
                        "#6366F1",
                        "#EC4899",
                        "#8B5CF6",
                    ],
                },
            ],
        },
    };
}

/**
 * Generate growth trend line chart (mock data for demonstration)
 * @param businessName - User's business name
 * @returns Line chart data
 */
export function generateGrowthTrendChart(businessName: string): ChartData {
    // Mock data - in production, this would come from historical data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const revenue = [100, 120, 115, 140, 155, 170];
    const competitors = [110, 115, 125, 130, 135, 145];

    return {
        type: "line",
        title: "Revenue Growth Trend (Last 6 Months)",
        data: {
            labels: months,
            datasets: [
                {
                    label: businessName,
                    data: revenue,
                    borderColor: "#3E4A8A",
                    backgroundColor: "rgba(62, 74, 138, 0.1)",
                    tension: 0.4,
                },
                {
                    label: "Industry Average",
                    data: competitors,
                    borderColor: "#94A3B8",
                    backgroundColor: "rgba(148, 163, 184, 0.1)",
                    tension: 0.4,
                },
            ],
        },
    };
}

/**
 * Generate comprehensive analytics for report
 * @param business - User's business data
 * @param competitors - Array of competitors
 * @returns Array of chart data
 */
export function generateReportAnalytics(
    business: any,
    competitors: any[]
): ChartData[] {
    const charts: ChartData[] = [];

    // Market share chart (if data available)
    if (competitors.some((c) => c.marketShare)) {
        charts.push(
            generateMarketShareChart(competitors, business.businessName, business.marketShare)
        );
    }

    // Revenue comparison
    if (competitors.some((c) => c.estimatedRevenue)) {
        charts.push(
            generateRevenueComparisonChart(
                competitors,
                business.businessName,
                business.annualRevenue
            )
        );
    }

    // Proximity histogram
    if (competitors.some((c) => c.distance !== undefined)) {
        charts.push(generateProximityHistogram(competitors));
    }

    // Threat level distribution
    if (competitors.some((c) => c.aiInsights?.competitiveThreat)) {
        charts.push(generateThreatLevelChart(competitors));
    }

    // Employee comparison
    if (competitors.some((c) => c.employeeCount)) {
        charts.push(
            generateEmployeeComparisonChart(
                competitors,
                business.businessName,
                business.employeeCount
            )
        );
    }

    // Industry distribution
    if (competitors.length > 0) {
        charts.push(generateIndustryDistributionChart(competitors));
    }

    // Growth trend
    charts.push(generateGrowthTrendChart(business.businessName));

    return charts;
}

/**
 * Format chart data for export
 * @param chart - Chart data
 * @returns Formatted chart for export
 */
export function formatChartForExport(chart: ChartData) {
    return {
        type: chart.type,
        title: chart.title,
        data: chart.data,
        config: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom" as const,
                },
                title: {
                    display: true,
                    text: chart.title,
                },
            },
        },
    };
}
