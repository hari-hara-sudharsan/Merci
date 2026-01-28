import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocation {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface IBusiness extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    // Basic Information
    businessName: string;
    industry: string;
    description?: string;

    // Location
    location: ILocation;

    // Business Details
    yearEstablished?: number;
    employeeCount?: number;
    annualRevenue?: number;

    // Challenges & Goals
    challenges: string[]; // Array of challenge IDs from constants
    goals?: string;

    // Documents & AI Analysis
    documents?: {
        fileName: string;
        fileUrl: string;
        fileType: string;
        uploadedAt: Date;
    }[];

    aiParsedData?: {
        revenue?: number;
        expenses?: number;
        profit?: number;
        customerCount?: number;
        topProducts?: string[];
        marketPosition?: string;
        parsedAt: Date;
    };

    // Completion Status
    onboardingComplete: boolean;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
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
        lat: { type: Number },
        lng: { type: Number },
    },
});

const BusinessSchema: Schema<IBusiness> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        businessName: {
            type: String,
            required: [true, "Business name is required"],
            trim: true,
            minlength: [2, "Business name must be at least 2 characters"],
            maxlength: [100, "Business name cannot exceed 100 characters"],
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
            type: LocationSchema,
            required: [true, "Location is required"],
        },
        yearEstablished: {
            type: Number,
            min: [1800, "Year must be after 1800"],
            max: [new Date().getFullYear(), "Year cannot be in the future"],
        },
        employeeCount: {
            type: Number,
            min: [1, "Employee count must be at least 1"],
        },
        annualRevenue: {
            type: Number,
            min: [0, "Revenue cannot be negative"],
        },
        challenges: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length > 0;
                },
                message: "Please select at least one challenge",
            },
        },
        goals: {
            type: String,
            trim: true,
            maxlength: [1000, "Goals cannot exceed 1000 characters"],
        },
        documents: [
            {
                fileName: { type: String, required: true },
                fileUrl: { type: String, required: true },
                fileType: { type: String, required: true },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        aiParsedData: {
            revenue: Number,
            expenses: Number,
            profit: Number,
            customerCount: Number,
            topProducts: [String],
            marketPosition: String,
            parsedAt: Date,
        },
        onboardingComplete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
BusinessSchema.index({ userId: 1 });
BusinessSchema.index({ businessName: 1 });
BusinessSchema.index({ industry: 1 });
BusinessSchema.index({ "location.city": 1 });

// Prevent model recompilation in development
const Business: Model<IBusiness> =
    mongoose.models.Business || mongoose.model<IBusiness>("Business", BusinessSchema);

export default Business;
