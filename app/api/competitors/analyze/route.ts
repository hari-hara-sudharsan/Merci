import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Competitor from "@/models/Competitor";
import Business from "@/models/Business";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        const { competitorId } = await req.json();

        if (!competitorId) {
            return NextResponse.json(
                { message: "Competitor ID is required" },
                { status: 400 }
            );
        }

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

        // Get competitor
        const competitor = await Competitor.findById(competitorId);
        if (!competitor) {
            return NextResponse.json(
                { message: "Competitor not found" },
                { status: 404 }
            );
        }

        // Check ownership
        if (competitor.businessId.toString() !== business._id.toString()) {
            return NextResponse.json(
                { message: "Unauthorized access to competitor" },
                { status: 403 }
            );
        }

        // Build context for AI analysis
        const context = `
User's Business:
- Name: ${business.businessName}
- Industry: ${business.industry}
- Revenue: ${business.annualRevenue ? `₹${business.annualRevenue}` : "Not provided"}
- Employees: ${business.employeeCount || "Not provided"}
- Location: ${business.location.city}, ${business.location.state}

Competitor:
- Name: ${competitor.name}
- Industry: ${competitor.industry}
- Revenue: ${competitor.estimatedRevenue ? `₹${competitor.estimatedRevenue}` : "Not provided"}
- Employees: ${competitor.employeeCount || "Not provided"}
- Location: ${competitor.location.city}, ${competitor.location.state}
- Distance: ${competitor.distance ? `${competitor.distance.toFixed(1)} km` : "Not provided"}
- Market Share: ${competitor.marketShare ? `${competitor.marketShare}%` : "Not provided"}
${competitor.strengths && competitor.strengths.length > 0 ? `- Strengths: ${competitor.strengths.join(", ")}` : ""}
${competitor.weaknesses && competitor.weaknesses.length > 0 ? `- Weaknesses: ${competitor.weaknesses.join(", ")}` : ""}
`;

        // Generate AI analysis
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a competitive intelligence analyst. Analyze the competitor and provide strategic insights in JSON format.
          
          Return the following structure:
          {
            "competitiveThreat": "low" | "medium" | "high",
            "summary": "Brief 2-3 sentence summary of the competitive threat",
            "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
            "keyInsights": ["insight 1", "insight 2", "insight 3"],
            "differentiationOpportunities": ["opportunity 1", "opportunity 2"]
          }
          
          Base your analysis on:
          1. Proximity (closer = higher threat)
          2. Market share and revenue comparison
          3. Strengths and weaknesses
          4. Industry dynamics
          
          Provide actionable, specific recommendations.`,
                },
                {
                    role: "user",
                    content: `Analyze this competitor:\n\n${context}`,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const analysis = JSON.parse(
            completion.choices[0].message.content || "{}"
        );

        // Update competitor with AI insights
        competitor.aiInsights = {
            competitiveThreat: analysis.competitiveThreat || "medium",
            summary: analysis.summary,
            recommendations: analysis.recommendations || [],
            generatedAt: new Date(),
        };

        await competitor.save();

        return NextResponse.json(
            {
                message: "Competitor analyzed successfully",
                analysis: {
                    ...analysis,
                    competitorName: competitor.name,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Competitor analysis error:", error);

        if (error.code === "insufficient_quota") {
            return NextResponse.json(
                { message: "OpenAI API quota exceeded. Please try again later." },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: "Failed to analyze competitor. Please try again." },
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
        const competitorId = searchParams.get("competitorId");

        if (!competitorId) {
            return NextResponse.json(
                { message: "Competitor ID is required" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Get competitor with AI insights
        const competitor = await Competitor.findById(competitorId);
        if (!competitor) {
            return NextResponse.json(
                { message: "Competitor not found" },
                { status: 404 }
            );
        }

        // Check if analysis exists
        if (!competitor.aiInsights) {
            return NextResponse.json(
                { message: "No analysis available. Please run analysis first." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                analysis: competitor.aiInsights,
                competitorName: competitor.name,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Fetch analysis error:", error);

        return NextResponse.json(
            { message: "Failed to fetch analysis. Please try again." },
            { status: 500 }
        );
    }
}
