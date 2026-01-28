import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function PATCH(req: NextRequest) {
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

        // Connect to database
        await connectDB();

        // Mark all unread notifications as read
        const result = await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        return NextResponse.json(
            {
                message: "All notifications marked as read",
                count: result.modifiedCount,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Mark all as read error:", error);

        return NextResponse.json(
            { message: "Failed to mark all notifications as read" },
            { status: 500 }
        );
    }
}
