"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Building2, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
    });

    const [businessData, setBusinessData] = useState({
        name: "",
        industry: "",
        description: "",
        website: "",
        phone: "",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        trendAlerts: true,
        competitorAlerts: true,
        reportAlerts: true,
        weeklyDigest: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const [userRes, businessRes] = await Promise.all([
                fetch("/api/user/profile"),
                fetch("/api/business/get"),
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setProfileData({
                    name: userData.name || "",
                    email: userData.email || "",
                });
            }

            if (businessRes.ok) {
                const businessData = await businessRes.json();
                setBusinessData({
                    name: businessData.business?.name || "",
                    industry: businessData.business?.industry || "",
                    description: businessData.business?.description || "",
                    website: businessData.business?.website || "",
                    phone: businessData.business?.phone || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveBusiness = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/business/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(businessData),
            });

            if (response.ok) {
                alert("Business settings updated successfully!");
            } else {
                alert("Failed to update business settings");
            }
        } catch (error) {
            console.error("Failed to save business settings:", error);
            alert("Failed to update business settings");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/user/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notificationSettings),
            });

            if (response.ok) {
                alert("Notification settings updated successfully!");
            } else {
                alert("Failed to update notification settings");
            }
        } catch (error) {
            console.error("Failed to save notification settings:", error);
            alert("Failed to update notification settings");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "business", label: "Business", icon: Building2 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account and preferences
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <Card variant="glass" className="lg:col-span-1">
                        <CardContent className="p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                    ? "bg-primary text-white"
                                                    : "hover:bg-muted text-foreground"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Settings */}
                        {activeTab === "profile" && (
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Profile Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, name: e.target.value })
                                            }
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, email: e.target.value })
                                            }
                                            placeholder="Enter your email"
                                            disabled
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Email cannot be changed
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="w-full"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Business Settings */}
                        {activeTab === "business" && (
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Business Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="businessName">Business Name</Label>
                                        <Input
                                            id="businessName"
                                            value={businessData.name}
                                            onChange={(e) =>
                                                setBusinessData({ ...businessData, name: e.target.value })
                                            }
                                            placeholder="Enter business name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="industry">Industry</Label>
                                        <Input
                                            id="industry"
                                            value={businessData.industry}
                                            onChange={(e) =>
                                                setBusinessData({ ...businessData, industry: e.target.value })
                                            }
                                            placeholder="Enter industry"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            value={businessData.description}
                                            onChange={(e) =>
                                                setBusinessData({
                                                    ...businessData,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Enter business description"
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={businessData.website}
                                            onChange={(e) =>
                                                setBusinessData({ ...businessData, website: e.target.value })
                                            }
                                            placeholder="https://example.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={businessData.phone}
                                            onChange={(e) =>
                                                setBusinessData({ ...businessData, phone: e.target.value })
                                            }
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSaveBusiness}
                                        disabled={saving}
                                        className="w-full"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notification Settings */}
                        {activeTab === "notifications" && (
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">
                                                Receive notifications via email
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={(e) =>
                                                setNotificationSettings({
                                                    ...notificationSettings,
                                                    emailNotifications: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">Trend Alerts</p>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified about new market trends
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.trendAlerts}
                                            onChange={(e) =>
                                                setNotificationSettings({
                                                    ...notificationSettings,
                                                    trendAlerts: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">Competitor Alerts</p>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified about competitor activities
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.competitorAlerts}
                                            onChange={(e) =>
                                                setNotificationSettings({
                                                    ...notificationSettings,
                                                    competitorAlerts: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">Report Alerts</p>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified when reports are generated
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.reportAlerts}
                                            onChange={(e) =>
                                                setNotificationSettings({
                                                    ...notificationSettings,
                                                    reportAlerts: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">Weekly Digest</p>
                                            <p className="text-sm text-muted-foreground">
                                                Receive a weekly summary email
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.weeklyDigest}
                                            onChange={(e) =>
                                                setNotificationSettings({
                                                    ...notificationSettings,
                                                    weeklyDigest: e.target.checked,
                                                })
                                            }
                                            className="h-5 w-5"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSaveNotifications}
                                        disabled={saving}
                                        className="w-full"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Settings */}
                        {activeTab === "security" && (
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <Button disabled className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>

                                    <div className="pt-4 border-t border-border">
                                        <h3 className="font-semibold text-foreground mb-2">
                                            Two-Factor Authentication
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Add an extra layer of security to your account
                                        </p>
                                        <Button variant="outline" disabled>
                                            Enable 2FA
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
