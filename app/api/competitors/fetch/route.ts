import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Competitor from "@/models/Competitor";
import Business from "@/models/Business";
import { calculateDistance } from "@/lib/geocoding";

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
                { message: "Please complete onboarding first" },
                { status: 404 }
            );
        }

        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const industry = searchParams.get("industry");
        const maxDistance = searchParams.get("maxDistance");
        const sortBy = searchParams.get("sortBy") || "distance"; // distance, name, revenue

        // Build query
        const query: any = { businessId: business._id };
        if (industry) {
            query.industry = industry;
        }

        // Fetch competitors
        let competitors = await Competitor.find(query).lean();

        // Calculate distances if user's business has coordinates
        if (business.location?.coordinates) {
            const userLat = business.location.coordinates.lat;
            const userLng = business.location.coordinates.lng;

            competitors = competitors.map((competitor: any) => {
                if (competitor.location?.coordinates) {
                    const distance = calculateDistance(
                        userLat,
                        userLng,
                        competitor.location.coordinates.lat,
                        competitor.location.coordinates.lng
                    );
                    return { ...competitor, distance };
                }
                return competitor;
            });

            // Filter by max distance if specified
            if (maxDistance) {
                const maxDistanceNum = parseFloat(maxDistance);
                competitors = competitors.filter(
                    (c: any) => c.distance !== undefined && c.distance <= maxDistanceNum
                );
            }
        }

        // Sort competitors
        switch (sortBy) {
            case "name":
                competitors.sort((a: any, b: any) => a.name.localeCompare(b.name));
                break;
            case "revenue":
                competitors.sort(
                    (a: any, b: any) =>
                        (b.estimatedRevenue || 0) - (a.estimatedRevenue || 0)
                );
                break;
            case "distance":
            default:
                competitors.sort((a: any, b: any) => {
                    if (a.distance === undefined) return 1;
                    if (b.distance === undefined) return -1;
                    return a.distance - b.distance;
                });
                break;
        }

        return NextResponse.json(
            {
                competitors,
                count: competitors.length,
                userBusiness: {
                    name: business.businessName,
                    location: business.location,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Competitor fetch error:", error);

        return NextResponse.json(
            { message: "Failed to fetch competitors. Please try again." },
            { status: 500 }
        );
    }
}
