"use client";

import { AlertTriangle, XCircle, Info, CheckCircle2, X } from "lucide-react";

interface ErrorMessageProps {
    type?: "error" | "warning" | "info" | "success";
    title?: string;
    message: string;
    onDismiss?: () => void;
}

export default function ErrorMessage({
    type = "error",
    title,
    message,
    onDismiss,
}: ErrorMessageProps) {
    const config = {
        error: {
            icon: XCircle,
            bgColor: "bg-red-50 dark:bg-red-950/20",
            borderColor: "border-red-200 dark:border-red-800",
            iconColor: "text-red-600",
            textColor: "text-red-800 dark:text-red-200",
            defaultTitle: "Error",
        },
        warning: {
            icon: AlertTriangle,
            bgColor: "bg-orange-50 dark:bg-orange-950/20",
            borderColor: "border-orange-200 dark:border-orange-800",
            iconColor: "text-orange-600",
            textColor: "text-orange-800 dark:text-orange-200",
            defaultTitle: "Warning",
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            borderColor: "border-blue-200 dark:border-blue-800",
            iconColor: "text-blue-600",
            textColor: "text-blue-800 dark:text-blue-200",
            defaultTitle: "Information",
        },
        success: {
            icon: CheckCircle2,
            bgColor: "bg-green-50 dark:bg-green-950/20",
            borderColor: "border-green-200 dark:border-green-800",
            iconColor: "text-green-600",
            textColor: "text-green-800 dark:text-green-200",
            defaultTitle: "Success",
        },
    };

    const { icon: Icon, bgColor, borderColor, iconColor, textColor, defaultTitle } =
        config[type];

    return (
        <div
            className={`p-4 rounded-lg border ${bgColor} ${borderColor} flex items-start gap-3`}
        >
            <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
                {(title || defaultTitle) && (
                    <h4 className={`font-semibold ${textColor} mb-1`}>
                        {title || defaultTitle}
                    </h4>
                )}
                <p className={`text-sm ${textColor}`}>{message}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
