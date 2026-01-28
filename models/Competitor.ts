import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompetitor extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    businessId: mongoose.Types.ObjectId;

    // Basic Information
    name: string;
    industry: string;
    description?: string;

    // Location
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };

    // Business Metrics
    estimatedRevenue?: number;
    employeeCount?: number;
    yearEstablished?: number;

    // Competitive Analysis
    strengths?: string[];
    weaknesses?: string[];
    marketShare?: number; // Percentage (0-100)

    // Distance from user's business
    distance?: number; // in kilometers

    // Website & Social
    website?: string;
    socialMedia?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };

    // AI-generated insights
    aiInsights?: {
        competitiveThreat: "low" | "medium" | "high";
        summary?: string;
        recommendations?: string[];
        generatedAt: Date;
    };

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const CompetitorSchema: Schema<ICompetitor> = new Schema(
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
        name: {
            type: String,
            required: [true, "Competitor name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        industry: {
            type: String,
            required: [true, "Industry is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        location: {
            address: {
                type: String,
                required: [true, "Address is required"],
                trim: true,
            },
            city: {
                type: String,
                required: [true, "City is required"],
                trim: true,
            },
            state: {
                type: String,
                required: [true, "State is required"],
                trim: true,
            },
            country: {
                type: String,
                required: [true, "Country is required"],
                trim: true,
                default: "India",
            },
            postalCode: {
                type: String,
                required: [true, "Postal code is required"],
                trim: true,
            },
            coordinates: {
                lat: {
                    type: Number,
                    required: [true, "Latitude is required"],
                    min: -90,
                    max: 90,
                },
                lng: {
                    type: Number,
                    required: [true, "Longitude is required"],
                    min: -180,
                    max: 180,
                },
            },
        },
        estimatedRevenue: {
            type: Number,
            min: [0, "Revenue cannot be negative"],
        },
        employeeCount: {
            type: Number,
            min: [1, "Employee count must be at least 1"],
        },
        yearEstablished: {
            type: Number,
            min: [1800, "Year must be after 1800"],
            max: [new Date().getFullYear(), "Year cannot be in the future"],
        },
        strengths: {
            type: [String],
            default: [],
        },
        weaknesses: {
            type: [String],
            default: [],
        },
        marketShare: {
            type: Number,
            min: [0, "Market share cannot be negative"],
            max: [100, "Market share cannot exceed 100%"],
        },
        distance: {
            type: Number,
            min: [0, "Distance cannot be negative"],
        },
        website: {
            type: String,
            trim: true,
        },
        socialMedia: {
            linkedin: String,
            twitter: String,
            facebook: String,
        },
        aiInsights: {
            competitiveThreat: {
                type: String,
                enum: ["low", "medium", "high"],
            },
            summary: String,
            recommendations: [String],
            generatedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
CompetitorSchema.index({ userId: 1, businessId: 1 });
CompetitorSchema.index({ industry: 1 });
CompetitorSchema.index({ "location.city": 1 });
CompetitorSchema.index({ "location.coordinates.lat": 1, "location.coordinates.lng": 1 });

// Prevent model recompilation in development
const Competitor: Model<ICompetitor> =
    mongoose.models.Competitor || mongoose.model<ICompetitor>("Competitor", CompetitorSchema);

export default Competitor;
