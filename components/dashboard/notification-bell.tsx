"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/notifications/create?limit=10");
            const data = await response.json();

            if (response.ok) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: "PATCH",
            });

            if (response.ok) {
                // Update local state
                setNotifications((prev) =>
                    prev.map((n) =>
                        n._id === notificationId ? { ...n, isRead: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/notifications/mark-all-read", {
                method: "PATCH",
            });

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "trend":
                return "📈";
            case "competitor":
                return "🎯";
            case "report":
                return "📊";
            case "alert":
                return "⚠️";
            case "system":
                return "🔔";
            default:
                return "📢";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-600";
            case "medium":
                return "text-orange-600";
            case "low":
                return "text-green-600";
            default:
                return "text-muted-foreground";
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
                <Bell className="h-5 w-5 text-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border z-50 max-h-[600px] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    disabled={loading}
                                    className="text-sm text-primary hover:underline disabled:opacity-50"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground">
                                        No notifications yet
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.isRead ? "bg-primary/5" : ""
                                                }`}
                                            onClick={() => {
                                                if (!notification.isRead) {
                                                    markAsRead(notification._id);
                                                }
                                                if (notification.actionUrl) {
                                                    window.location.href = notification.actionUrl;
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className="text-2xl flex-shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4
                                                            className={`text-sm font-semibold ${!notification.isRead
                                                                    ? "text-foreground"
                                                                    : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {notification.message}
                                                    </p>

                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span
                                                            className={getPriorityColor(notification.priority)}
                                                        >
                                                            {notification.priority.toUpperCase()}
                                                        </span>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="text-muted-foreground">
                                                            {formatDistanceToNow(
                                                                new Date(notification.createdAt),
                                                                { addSuffix: true }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-border text-center">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        window.location.href = "/dashboard/notifications";
                                    }}
                                    className="text-sm text-primary hover:underline"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
