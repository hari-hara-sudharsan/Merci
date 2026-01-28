import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
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
        const data = await req.json();

        // Connect to database
        await connectDB();

        // Find existing business
        const existingBusiness = await Business.findOne({ userId });
        if (!existingBusiness) {
            return NextResponse.json(
                { message: "Business not found. Please create one first." },
                { status: 404 }
            );
        }

        // Update business
        const updateData: any = {};

        if (data.businessName) updateData.businessName = data.businessName;
        if (data.industry) updateData.industry = data.industry;
        if (data.description !== undefined) updateData.description = data.description;

        if (data.location) {
            updateData.location = {
                address: data.location.address || existingBusiness.location.address,
                city: data.location.city || existingBusiness.location.city,
                state: data.location.state || existingBusiness.location.state,
                country: data.location.country || existingBusiness.location.country,
                postalCode: data.location.postalCode || existingBusiness.location.postalCode,
                coordinates: data.location.coordinates || existingBusiness.location.coordinates,
            };
        }

        if (data.yearEstablished !== undefined) updateData.yearEstablished = data.yearEstablished;
        if (data.employeeCount !== undefined) updateData.employeeCount = data.employeeCount;
        if (data.annualRevenue !== undefined) updateData.annualRevenue = data.annualRevenue;
        if (data.challenges) updateData.challenges = data.challenges;
        if (data.goals !== undefined) updateData.goals = data.goals;

        // Update AI parsed data if provided
        if (data.aiParsedData) {
            updateData.aiParsedData = {
                ...data.aiParsedData,
                parsedAt: new Date(),
            };
        }

        // Update documents if provided
        if (data.documents) {
            updateData.documents = data.documents;
        }

        const updatedBusiness = await Business.findByIdAndUpdate(
            existingBusiness._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        // Update user's business name if changed
        if (data.businessName && data.businessName !== existingBusiness.businessName) {
            await User.findByIdAndUpdate(userId, {
                businessName: data.businessName,
            });
        }

        return NextResponse.json(
            {
                message: "Business updated successfully",
                business: {
                    id: updatedBusiness._id,
                    businessName: updatedBusiness.businessName,
                    industry: updatedBusiness.industry,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Business update error:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(
                (err: any) => err.message
            );
            return NextResponse.json(
                { message: messages.join(", ") },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Failed to update business. Please try again." },
            { status: 500 }
        );
    }
}

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
        const data = await req.json();

        // Connect to database
        await connectDB();

        // Find and update business with partial data
        const business = await Business.findOneAndUpdate(
            { userId },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!business) {
            return NextResponse.json(
                { message: "Business not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Business updated successfully",
                business,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Business patch error:", error);

        return NextResponse.json(
            { message: "Failed to update business. Please try again." },
            { status: 500 }
        );
    }
}
