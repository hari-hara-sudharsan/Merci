"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";
import { FileText, Download, Share2, Clock, CheckCircle2, XCircle, Plus, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

const REPORT_TYPES = [
    {
        id: "market_analysis",
        label: "Market Analysis",
        description: "Analyze market size, trends, and opportunities",
        icon: "📊",
    },
    {
        id: "competitor_analysis",
        label: "Competitor Analysis",
        description: "Deep dive into competitive landscape",
        icon: "🎯",
    },
    {
        id: "growth_strategy",
        label: "Growth Strategy",
        description: "Strategic recommendations for growth",
        icon: "🚀",
    },
    {
        id: "financial_insights",
        label: "Financial Insights",
        description: "Revenue, costs, and profitability analysis",
        icon: "💰",
    },
];

export default function ReportsPage() {
    const { data: session } = useSession();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchReports();
        // Poll for report status updates every 5 seconds
        const interval = setInterval(fetchReports, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch("/api/reports/list");
            const data = await response.json();

            if (response.ok) {
                setReports(data.reports || []);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!selectedType) return;

        setGenerating(true);

        try {
            const response = await fetch("/api/reports/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: selectedType,
                    includeCompetitors: true,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowGenerateModal(false);
                setSelectedType("");
                fetchReports();
            } else {
                alert(data.message || "Failed to generate report");
            }
        } catch (error) {
            console.error("Report generation error:", error);
            alert("Failed to generate report");
        } finally {
            setGenerating(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case "generating":
                return <Clock className="h-5 w-5 text-orange-600 animate-pulse" />;
            case "failed":
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Completed";
            case "generating":
                return "Generating...";
            case "failed":
                return "Failed";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">AI-Powered Reports</h1>
                        <p className="text-muted-foreground mt-1">
                            Generate comprehensive business intelligence reports
                        </p>
                    </div>
                    <Button onClick={() => setShowGenerateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Report
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Reports</p>
                                    <p className="text-2xl font-bold text-foreground">{reports.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {reports.filter((r) => r.status === "completed").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-500/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Generating</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {reports.filter((r) => r.status === "generating").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent/10 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">This Month</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {
                                            reports.filter(
                                                (r) =>
                                                    new Date(r.createdAt).getMonth() === new Date().getMonth()
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reports List */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Your Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {reports.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg font-semibold text-foreground mb-2">
                                    No reports yet
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Generate your first AI-powered business intelligence report
                                </p>
                                <Button onClick={() => setShowGenerateModal(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Generate Report
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reports.map((report) => (
                                    <div
                                        key={report._id}
                                        className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">
                                                        {REPORT_TYPES.find((t) => t.id === report.type)?.icon || "📄"}
                                                    </span>
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {REPORT_TYPES.find((t) => t.id === report.type)?.label || report.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {report.summary}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>Created {formatDate(report.createdAt)}</span>
                                                    {report.dataSources?.competitors && (
                                                        <span>
                                                            {report.dataSources.competitors.length} competitors analyzed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(report.status)}
                                                    <span className="text-sm font-medium">
                                                        {getStatusText(report.status)}
                                                    </span>
                                                </div>

                                                {report.status === "completed" && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(`/dashboard/reports/${report._id}`, "_blank")}
                                                        >
                                                            <FileText className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Export
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Share2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Generate Report Modal */}
            {showGenerateModal && (
                <Modal onClose={() => setShowGenerateModal(false)}>
                    <ModalContent>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-foreground mb-4">
                                Generate New Report
                            </h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Select the type of report you want to generate
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {REPORT_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${selectedType === type.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{type.icon}</div>
                                        <h3 className="font-semibold text-foreground mb-1">{type.label}</h3>
                                        <p className="text-sm text-muted-foreground">{type.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowGenerateModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleGenerateReport}
                                    disabled={!selectedType || generating}
                                    loading={generating}
                                    className="flex-1"
                                >
                                    {generating ? "Generating..." : "Generate Report"}
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}
