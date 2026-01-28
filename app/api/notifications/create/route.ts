import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { type, title, message, priority, relatedEntity } = body;

        // Validate required fields
        if (!type || !title || !message) {
            return NextResponse.json(
                { message: "Missing required fields: type, title, message" },
                { status: 400 }
            );
        }

        // Validate type
        const validTypes = ["trend", "competitor", "report", "system", "alert"];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { message: "Invalid notification type" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Create notification
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            priority: priority || "medium",
            relatedEntity: relatedEntity || {},
            isRead: false,
        });

        return NextResponse.json(
            {
                message: "Notification created successfully",
                notification,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Notification creation error:", error);

        return NextResponse.json(
            { message: "Failed to create notification. Please try again." },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;
        const searchParams = req.nextUrl.searchParams;

        // Query parameters
        const unreadOnly = searchParams.get("unreadOnly") === "true";
        const type = searchParams.get("type");
        const limit = parseInt(searchParams.get("limit") || "50");

        // Connect to database
        await connectDB();

        // Build query
        const query: any = { userId };

        if (unreadOnly) {
            query.isRead = false;
        }

        if (type) {
            query.type = type;
        }

        // Fetch notifications
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Get unread count
        const unreadCount = await Notification.countDocuments({
            userId,
            isRead: false,
        });

        return NextResponse.json(
            {
                notifications,
                unreadCount,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Notifications fetch error:", error);

        return NextResponse.json(
            { message: "Failed to fetch notifications. Please try again." },
            { status: 500 }
        );
    }
}
