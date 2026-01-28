"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
    FileText,
    TrendingUp,
    Target,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
} from "lucide-react";

interface Activity {
    id: string;
    type: "report" | "competitor" | "trend" | "notification" | "system";
    title: string;
    description: string;
    timestamp: Date;
    status?: "success" | "warning" | "info";
    metadata?: any;
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            // Fetch recent activities from various sources
            const [reportsRes, competitorsRes, trendsRes, notificationsRes] = await Promise.all([
                fetch("/api/reports/list?limit=3"),
                fetch("/api/competitors/fetch?limit=3"),
                fetch("/api/trends/fetch?limit=3"),
                fetch("/api/notifications/create?limit=5"),
            ]);

            const reports = reportsRes.ok ? await reportsRes.json() : { reports: [] };
            const competitors = competitorsRes.ok ? await competitorsRes.json() : { competitors: [] };
            const trends = trendsRes.ok ? await trendsRes.json() : { trends: [] };
            const notifications = notificationsRes.ok
                ? await notificationsRes.json()
                : { notifications: [] };

            // Combine and format activities
            const allActivities: Activity[] = [
                ...(reports.reports || []).map((r: any) => ({
                    id: r._id,
                    type: "report" as const,
                    title: "Report Generated",
                    description: r.title,
                    timestamp: new Date(r.createdAt),
                    status: r.status === "completed" ? "success" : "info",
                })),
                ...(competitors.competitors || []).map((c: any) => ({
                    id: c._id,
                    type: "competitor" as const,
                    title: "Competitor Added",
                    description: `${c.name} tracked in ${c.location.city}`,
                    timestamp: new Date(c.createdAt),
                    status: c.aiInsights?.competitiveThreat === "high" ? "warning" : "info",
                })),
                ...(trends.trends || []).map((t: any) => ({
                    id: t._id,
                    type: "trend" as const,
                    title: "New Trend Detected",
                    description: t.title,
                    timestamp: new Date(t.createdAt),
                    status: t.impact === "high" ? "warning" : "info",
                })),
                ...(notifications.notifications || []).map((n: any) => ({
                    id: n._id,
                    type: "notification" as const,
                    title: n.title,
                    description: n.message,
                    timestamp: new Date(n.createdAt),
                    status: n.priority === "high" ? "warning" : "info",
                })),
            ];

            // Sort by timestamp (most recent first)
            allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            setActivities(allActivities.slice(0, 10));
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "report":
                return FileText;
            case "competitor":
                return Target;
            case "trend":
                return TrendingUp;
            case "notification":
                return Bell;
            default:
                return Info;
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "success":
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-orange-600" />;
            default:
                return <Info className="h-4 w-4 text-blue-600" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case "report":
                return "bg-green-500/10 text-green-600";
            case "competitor":
                return "bg-red-500/10 text-red-600";
            case "trend":
                return "bg-blue-500/10 text-blue-600";
            case "notification":
                return "bg-purple-500/10 text-purple-600";
            default:
                return "bg-gray-500/10 text-gray-600";
        }
    };

    if (loading) {
        return (
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="glass">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => {
                            const Icon = getActivityIcon(activity.type);
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="text-sm font-semibold text-foreground">
                                                {activity.title}
                                            </h4>
                                            {activity.status && getStatusIcon(activity.status)}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
