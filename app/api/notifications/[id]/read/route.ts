import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const notificationId = params.id;

        // Connect to database
        await connectDB();

        // Update notification
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json(
                { message: "Notification not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Notification marked as read",
                notification,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Mark as read error:", error);

        return NextResponse.json(
            { message: "Failed to mark notification as read" },
            { status: 500 }
        );
    }
}
