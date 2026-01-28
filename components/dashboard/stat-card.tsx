"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtitle?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10",
    trend,
    subtitle,
}: StatCardProps) {
    return (
        <Card variant="glass">
            <CardContent className="p-6">
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`p-3 ${iconBgColor} rounded-lg flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-foreground">{value}</p>
                            {trend && (
                                <span
                                    className={`text-xs font-semibold ${trend.isPositive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                </span>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
