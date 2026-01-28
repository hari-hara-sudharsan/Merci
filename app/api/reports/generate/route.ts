import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import Business from "@/models/Business";
import Competitor from "@/models/Competitor";
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
        const { type, title, includeCompetitors } = await req.json();

        // Validate report type
        const validTypes = ["market_analysis", "competitor_analysis", "growth_strategy", "financial_insights", "custom"];
        if (!type || !validTypes.includes(type)) {
            return NextResponse.json(
                { message: "Invalid report type" },
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

        // Get competitors if needed
        let competitors: any[] = [];
        if (includeCompetitors || type === "competitor_analysis") {
            competitors = await Competitor.find({ businessId: business._id }).limit(10);
        }

        // Build context for AI
        const context = buildReportContext(business, competitors, type);

        // Create report in database (status: generating)
        const report = await Report.create({
            userId,
            businessId: business._id,
            title: title || getDefaultTitle(type, business.businessName),
            type,
            status: "generating",
            summary: "Generating report...",
            sections: [],
            recommendations: [],
            aiGenerated: {
                model: "gpt-4o-mini",
                prompt: context,
                generatedAt: new Date(),
            },
            dataSources: {
                competitors: competitors.map((c) => c._id),
            },
        });

        // Generate report asynchronously (in background)
        generateReportContent(report._id.toString(), context, type)
            .catch((error) => {
                console.error("Report generation error:", error);
                Report.findByIdAndUpdate(report._id, { status: "failed" });
            });

        return NextResponse.json(
            {
                message: "Report generation started",
                reportId: report._id,
                status: "generating",
            },
            { status: 202 }
        );
    } catch (error: any) {
        console.error("Report creation error:", error);

        return NextResponse.json(
            { message: "Failed to create report. Please try again." },
            { status: 500 }
        );
    }
}

async function generateReportContent(reportId: string, context: string, type: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: getSystemPrompt(type),
                },
                {
                    role: "user",
                    content: context,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 4000,
        });

        const reportData = JSON.parse(completion.choices[0].message.content || "{}");

        // Update report with generated content
        await Report.findByIdAndUpdate(reportId, {
            status: "completed",
            summary: reportData.summary || "Report generated successfully",
            sections: reportData.sections || [],
            keyMetrics: reportData.keyMetrics || [],
            recommendations: reportData.recommendations || [],
            "aiGenerated.tokensUsed": completion.usage?.total_tokens,
        });
    } catch (error) {
        console.error("Report generation error:", error);
        await Report.findByIdAndUpdate(reportId, { status: "failed" });
        throw error;
    }
}

function buildReportContext(business: any, competitors: any[], type: string): string {
    let context = `
Business Information:
- Name: ${business.businessName}
- Industry: ${business.industry}
- Description: ${business.description || "Not provided"}
- Location: ${business.location.city}, ${business.location.state}, ${business.location.country}
- Year Established: ${business.yearEstablished || "Not provided"}
- Employees: ${business.employeeCount || "Not provided"}
- Annual Revenue: ${business.annualRevenue ? `₹${business.annualRevenue}` : "Not provided"}
- Challenges: ${business.challenges?.join(", ") || "Not provided"}
- Goals: ${business.goals || "Not provided"}
`;

    if (competitors.length > 0) {
        context += `\n\nCompetitors (${competitors.length}):\n`;
        competitors.forEach((comp, index) => {
            context += `
${index + 1}. ${comp.name}
   - Industry: ${comp.industry}
   - Location: ${comp.location.city}, ${comp.location.state}
   - Distance: ${comp.distance ? `${comp.distance.toFixed(1)} km` : "N/A"}
   - Revenue: ${comp.estimatedRevenue ? `₹${comp.estimatedRevenue}` : "N/A"}
   - Employees: ${comp.employeeCount || "N/A"}
   - Market Share: ${comp.marketShare ? `${comp.marketShare}%` : "N/A"}
   - Threat Level: ${comp.aiInsights?.competitiveThreat || "N/A"}
`;
        });
    }

    return context;
}

function getSystemPrompt(type: string): string {
    const basePrompt = `You are a business intelligence analyst generating a comprehensive report. Return your analysis in JSON format with the following structure:

{
  "summary": "2-3 sentence executive summary",
  "sections": [
    {
      "title": "Section Title",
      "content": "Detailed content (markdown supported)",
      "insights": ["key insight 1", "key insight 2"]
    }
  ],
  "keyMetrics": [
    {
      "label": "Metric Name",
      "value": "Metric Value",
      "change": 5.2,
      "trend": "up"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "actionItems": ["action 1", "action 2"]
    }
  ]
}`;

    const typeSpecificPrompts: Record<string, string> = {
        market_analysis: `${basePrompt}

Focus on:
- Market size and growth potential
- Industry trends and dynamics
- Target customer segments
- Market opportunities and threats
- Competitive landscape overview

Include 3-4 sections with actionable insights.`,

        competitor_analysis: `${basePrompt}

Focus on:
- Competitive positioning
- Competitor strengths and weaknesses
- Market share analysis
- Differentiation opportunities
- Competitive threats and responses

Include detailed competitor comparisons and strategic recommendations.`,

        growth_strategy: `${basePrompt}

Focus on:
- Growth opportunities
- Market expansion strategies
- Product/service development
- Customer acquisition strategies
- Scaling recommendations

Provide actionable growth roadmap with priorities.`,

        financial_insights: `${basePrompt}

Focus on:
- Revenue analysis
- Cost optimization opportunities
- Profitability improvements
- Financial health indicators
- Investment recommendations

Include financial metrics and projections.`,

        custom: basePrompt,
    };

    return typeSpecificPrompts[type] || basePrompt;
}

function getDefaultTitle(type: string, businessName: string): string {
    const titles: Record<string, string> = {
        market_analysis: `Market Analysis Report - ${businessName}`,
        competitor_analysis: `Competitive Intelligence Report - ${businessName}`,
        growth_strategy: `Growth Strategy Report - ${businessName}`,
        financial_insights: `Financial Insights Report - ${businessName}`,
        custom: `Business Report - ${businessName}`,
    };

    return titles[type] || `Report - ${businessName}`;
}
