import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import User from "@/models/User";

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
        const data = await req.json();

        // Validation
        if (!data.businessName || !data.industry || !data.location || !data.challenges) {
            return NextResponse.json(
                { message: "Please provide all required fields" },
                { status: 400 }
            );
        }

        if (!data.location.address || !data.location.city || !data.location.state || !data.location.postalCode) {
            return NextResponse.json(
                { message: "Please provide complete location information" },
                { status: 400 }
            );
        }

        if (!Array.isArray(data.challenges) || data.challenges.length === 0) {
            return NextResponse.json(
                { message: "Please select at least one challenge" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Check if user already has a business
        const existingBusiness = await Business.findOne({ userId });
        if (existingBusiness) {
            return NextResponse.json(
                { message: "You already have a business profile. Please update instead." },
                { status: 409 }
            );
        }

        // Create business
        const business = await Business.create({
            userId,
            businessName: data.businessName,
            industry: data.industry,
            description: data.description,
            location: {
                address: data.location.address,
                city: data.location.city,
                state: data.location.state,
                country: data.location.country || "India",
                postalCode: data.location.postalCode,
                coordinates: data.location.coordinates,
            },
            yearEstablished: data.yearEstablished,
            employeeCount: data.employeeCount,
            annualRevenue: data.annualRevenue,
            challenges: data.challenges,
            goals: data.goals,
            onboardingComplete: true,
        });

        // Update user's onboarding status
        await User.findByIdAndUpdate(userId, {
            businessName: data.businessName,
            onboardingComplete: true,
        });

        return NextResponse.json(
            {
                message: "Business created successfully",
                business: {
                    id: business._id,
                    businessName: business.businessName,
                    industry: business.industry,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Business creation error:", error);

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
            { message: "Failed to create business. Please try again." },
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

        // Connect to database
        await connectDB();

        // Get user's business
        const business = await Business.findOne({ userId });

        if (!business) {
            return NextResponse.json(
                { message: "Business not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { business },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Business fetch error:", error);

        return NextResponse.json(
            { message: "Failed to fetch business. Please try again." },
            { status: 500 }
        );
    }
}
