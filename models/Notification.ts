import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    // Notification Details
    type: "trend" | "competitor" | "report" | "system" | "alert";
    title: string;
    message: string;
    priority: "low" | "medium" | "high";

    // Related Entity
    relatedEntity?: {
        entityType?: "trend" | "competitor" | "report" | "business";
        entityId?: mongoose.Types.ObjectId;
        metadata?: any;
    };

    // Action
    actionUrl?: string;
    actionLabel?: string;

    // Status
    isRead: boolean;
    readAt?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        type: {
            type: String,
            enum: ["trend", "competitor", "report", "system", "alert"],
            required: [true, "Notification type is required"],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            index: true,
        },
        relatedEntity: {
            entityType: {
                type: String,
                enum: ["trend", "competitor", "report", "business"],
            },
            entityId: Schema.Types.ObjectId,
            metadata: Schema.Types.Mixed,
        },
        actionUrl: String,
        actionLabel: String,
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: Date,
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, priority: 1 });

// Prevent model recompilation in development
const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
