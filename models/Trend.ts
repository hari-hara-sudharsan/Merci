import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITrend extends Document {
    _id: mongoose.Types.ObjectId;

    // Trend Metadata
    industry: string;
    category: "technology" | "market" | "consumer" | "regulatory" | "economic" | "social";
    title: string;
    description: string;

    // Trend Details
    impact: "low" | "medium" | "high";
    timeframe: "short_term" | "medium_term" | "long_term"; // 0-1yr, 1-3yr, 3+yr
    confidence: number; // 0-100

    // Data Points
    dataPoints?: {
        date: Date;
        value: number;
        metric: string;
    }[];

    // Sources
    sources: {
        type: "article" | "report" | "research" | "news" | "social_media";
        title: string;
        url?: string;
        publishedAt?: Date;
        credibility?: number; // 0-100
    }[];

    // AI Analysis
    aiInsights?: {
        summary: string;
        opportunities: string[];
        threats: string[];
        recommendations: string[];
        generatedAt: Date;
    };

    // Metrics
    metrics?: {
        growthRate?: number; // Percentage
        marketSize?: number;
        adoptionRate?: number; // Percentage
        customMetrics?: {
            name: string;
            value: number;
            unit: string;
        }[];
    };

    // Related Entities
    relatedIndustries?: string[];
    affectedBusinesses?: mongoose.Types.ObjectId[]; // Business IDs

    // Engagement
    views: number;
    bookmarks: number;

    // Status
    isActive: boolean;
    verifiedAt?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const TrendSchema: Schema<ITrend> = new Schema(
    {
        industry: {
            type: String,
            required: [true, "Industry is required"],
            trim: true,
            index: true,
        },
        category: {
            type: String,
            enum: ["technology", "market", "consumer", "regulatory", "economic", "social"],
            required: [true, "Category is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [10, "Title must be at least 10 characters"],
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        impact: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Impact level is required"],
            index: true,
        },
        timeframe: {
            type: String,
            enum: ["short_term", "medium_term", "long_term"],
            required: [true, "Timeframe is required"],
        },
        confidence: {
            type: Number,
            required: [true, "Confidence score is required"],
            min: [0, "Confidence cannot be less than 0"],
            max: [100, "Confidence cannot exceed 100"],
        },
        dataPoints: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                value: {
                    type: Number,
                    required: true,
                },
                metric: {
                    type: String,
                    required: true,
                },
            },
        ],
        sources: [
            {
                type: {
                    type: String,
                    enum: ["article", "report", "research", "news", "social_media"],
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                url: String,
                publishedAt: Date,
                credibility: {
                    type: Number,
                    min: 0,
                    max: 100,
                },
            },
        ],
        aiInsights: {
            summary: String,
            opportunities: [String],
            threats: [String],
            recommendations: [String],
            generatedAt: Date,
        },
        metrics: {
            growthRate: Number,
            marketSize: Number,
            adoptionRate: Number,
            customMetrics: [
                {
                    name: String,
                    value: Number,
                    unit: String,
                },
            ],
        },
        relatedIndustries: [String],
        affectedBusinesses: [
            {
                type: Schema.Types.ObjectId,
                ref: "Business",
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        bookmarks: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        verifiedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
TrendSchema.index({ industry: 1, category: 1 });
TrendSchema.index({ impact: 1, timeframe: 1 });
TrendSchema.index({ isActive: 1, createdAt: -1 });
TrendSchema.index({ "sources.publishedAt": -1 });

// Prevent model recompilation in development
const Trend: Model<ITrend> =
    mongoose.models.Trend || mongoose.model<ITrend>("Trend", TrendSchema);

export default Trend;
