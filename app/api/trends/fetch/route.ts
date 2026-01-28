import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Trend from "@/models/Trend";
import Business from "@/models/Business";

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
        const industry = searchParams.get("industry");
        const category = searchParams.get("category");
        const impact = searchParams.get("impact");
        const timeframe = searchParams.get("timeframe");
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Connect to database
        await connectDB();

        // Get user's business to filter by industry
        const business = await Business.findOne({ userId });
        const userIndustry = business?.industry;

        // Build query
        const query: any = { isActive: true };

        // Filter by industry (user's industry or specified)
        if (industry) {
            query.industry = industry;
        } else if (userIndustry) {
            // Default to user's industry or related industries
            query.$or = [
                { industry: userIndustry },
                { relatedIndustries: userIndustry },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by impact
        if (impact) {
            query.impact = impact;
        }

        // Filter by timeframe
        if (timeframe) {
            query.timeframe = timeframe;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort: any = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Fetch trends
        const trends = await Trend.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const total = await Trend.countDocuments(query);

        // Increment view count for fetched trends
        await Trend.updateMany(
            { _id: { $in: trends.map((t) => t._id) } },
            { $inc: { views: 1 } }
        );

        return NextResponse.json(
            {
                trends,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
                filters: {
                    industry: industry || userIndustry,
                    category,
                    impact,
                    timeframe,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Trends fetch error:", error);

        return NextResponse.json(
            { message: "Failed to fetch trends. Please try again." },
            { status: 500 }
        );
    }
}

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

        const body = await req.json();
        const {
            industry,
            category,
            title,
            description,
            impact,
            timeframe,
            confidence,
            sources,
            metrics,
        } = body;

        // Validate required fields
        if (!industry || !category || !title || !description || !impact || !timeframe || !confidence) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Create trend
        const trend = await Trend.create({
            industry,
            category,
            title,
            description,
            impact,
            timeframe,
            confidence,
            sources: sources || [],
            metrics: metrics || {},
            isActive: true,
        });

        return NextResponse.json(
            {
                message: "Trend created successfully",
                trend,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Trend creation error:", error);

        return NextResponse.json(
            { message: "Failed to create trend. Please try again." },
            { status: 500 }
        );
    }
}
