import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    businessId: mongoose.Types.ObjectId;

    // Report Metadata
    title: string;
    type: "market_analysis" | "competitor_analysis" | "growth_strategy" | "financial_insights" | "custom";
    status: "generating" | "completed" | "failed";

    // Report Content
    summary: string;
    sections: {
        title: string;
        content: string;
        insights?: string[];
        charts?: {
            type: "bar" | "line" | "pie" | "area";
            data: any;
            title: string;
        }[];
    }[];

    // Key Metrics
    keyMetrics?: {
        label: string;
        value: string | number;
        change?: number; // Percentage change
        trend?: "up" | "down" | "stable";
    }[];

    // Recommendations
    recommendations: {
        priority: "high" | "medium" | "low";
        title: string;
        description: string;
        actionItems?: string[];
    }[];

    // AI Generation Details
    aiGenerated: {
        model: string;
        prompt: string;
        generatedAt: Date;
        tokensUsed?: number;
    };

    // Data Sources
    dataSources?: {
        competitors?: mongoose.Types.ObjectId[];
        dateRange?: {
            start: Date;
            end: Date;
        };
        customData?: any;
    };

    // Sharing & Export
    isPublic: boolean;
    shareToken?: string;
    exportedFormats?: ("pdf" | "docx" | "html")[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: [true, "Business ID is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Report title is required"],
            trim: true,
            minlength: [5, "Title must be at least 5 characters"],
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        type: {
            type: String,
            enum: ["market_analysis", "competitor_analysis", "growth_strategy", "financial_insights", "custom"],
            required: [true, "Report type is required"],
            index: true,
        },
        status: {
            type: String,
            enum: ["generating", "completed", "failed"],
            default: "generating",
            index: true,
        },
        summary: {
            type: String,
            required: [true, "Report summary is required"],
            trim: true,
        },
        sections: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                insights: [String],
                charts: [
                    {
                        type: {
                            type: String,
                            enum: ["bar", "line", "pie", "area"],
                        },
                        data: Schema.Types.Mixed,
                        title: String,
                    },
                ],
            },
        ],
        keyMetrics: [
            {
                label: {
                    type: String,
                    required: true,
                },
                value: Schema.Types.Mixed,
                change: Number,
                trend: {
                    type: String,
                    enum: ["up", "down", "stable"],
                },
            },
        ],
        recommendations: [
            {
                priority: {
                    type: String,
                    enum: ["high", "medium", "low"],
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                actionItems: [String],
            },
        ],
        aiGenerated: {
            model: {
                type: String,
                required: true,
            },
            prompt: {
                type: String,
                required: true,
            },
            generatedAt: {
                type: Date,
                required: true,
                default: Date.now,
            },
            tokensUsed: Number,
        },
        dataSources: {
            competitors: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Competitor",
                },
            ],
            dateRange: {
                start: Date,
                end: Date,
            },
            customData: Schema.Types.Mixed,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        shareToken: {
            type: String,
            unique: true,
            sparse: true,
        },
        exportedFormats: [
            {
                type: String,
                enum: ["pdf", "docx", "html"],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
ReportSchema.index({ userId: 1, businessId: 1 });
ReportSchema.index({ type: 1, status: 1 });
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ shareToken: 1 });

// Prevent model recompilation in development
const Report: Model<IReport> =
    mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;
