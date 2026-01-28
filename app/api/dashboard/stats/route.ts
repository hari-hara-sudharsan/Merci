import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Competitor from "@/models/Competitor";
import Report from "@/models/Report";
import Trend from "@/models/Trend";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        // Connect to database
        await connectDB();

        // Get user's business
        const business = await Business.findOne({ userId });

        if (!business) {
            return NextResponse.json(
                { message: "Business not found. Please complete onboarding." },
                { status: 404 }
            );
        }

        // Fetch all stats in parallel
        const [
            totalCompetitors,
            highThreatCompetitors,
            nearbyCompetitors,
            totalReports,
            completedReports,
            generatingReports,
            activeTrends,
            highImpactTrends,
            unreadNotifications,
            totalNotifications,
        ] = await Promise.all([
            // Competitors
            Competitor.countDocuments({ userId }),
            Competitor.countDocuments({
                userId,
                "aiInsights.competitiveThreat": "high",
            }),
            Competitor.countDocuments({
                userId,
                "location.coordinates": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: business.location.coordinates,
                        },
                        $maxDistance: 50000, // 50km
                    },
                },
            }),

            // Reports
            Report.countDocuments({ userId }),
            Report.countDocuments({ userId, status: "completed" }),
            Report.countDocuments({ userId, status: "generating" }),

            // Trends
            Trend.countDocuments({ isActive: true }),
            Trend.countDocuments({ isActive: true, impact: "high" }),

            // Notifications
            Notification.countDocuments({ userId, isRead: false }),
            Notification.countDocuments({ userId }),
        ]);

        // Calculate trends (compare with last month)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const [
            competitorsLastMonth,
            reportsLastMonth,
            notificationsLastMonth,
        ] = await Promise.all([
            Competitor.countDocuments({
                userId,
                createdAt: { $gte: lastMonth },
            }),
            Report.countDocuments({
                userId,
                createdAt: { $gte: lastMonth },
            }),
            Notification.countDocuments({
                userId,
                createdAt: { $gte: lastMonth },
            }),
        ]);

        // Calculate percentage changes
        const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        // Get recent activities count
        const recentActivitiesCount = competitorsLastMonth + reportsLastMonth;

        return NextResponse.json(
            {
                business: {
                    name: business.name,
                    industry: business.industry,
                    location: business.location,
                },
                competitors: {
                    total: totalCompetitors,
                    highThreat: highThreatCompetitors,
                    nearby: nearbyCompetitors,
                    trend: {
                        value: calculateChange(totalCompetitors, competitorsLastMonth),
                        isPositive: totalCompetitors > competitorsLastMonth,
                    },
                },
                reports: {
                    total: totalReports,
                    completed: completedReports,
                    generating: generatingReports,
                    trend: {
                        value: calculateChange(totalReports, reportsLastMonth),
                        isPositive: totalReports > reportsLastMonth,
                    },
                },
                trends: {
                    active: activeTrends,
                    highImpact: highImpactTrends,
                },
                notifications: {
                    unread: unreadNotifications,
                    total: totalNotifications,
                    trend: {
                        value: calculateChange(unreadNotifications, notificationsLastMonth),
                        isPositive: false, // More notifications is not necessarily positive
                    },
                },
                activity: {
                    recentCount: recentActivitiesCount,
                    trend: {
                        value: Math.abs(calculateChange(recentActivitiesCount, 0)),
                        isPositive: recentActivitiesCount > 0,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Dashboard stats error:", error);

        return NextResponse.json(
            { message: "Failed to fetch dashboard stats. Please try again." },
            { status: 500 }
        );
    }
}
