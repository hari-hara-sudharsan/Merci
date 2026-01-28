import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OpenAI from "openai";
import pdf from "pdf-parse";
import mammoth from "mammoth";

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

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { message: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: "Invalid file type. Please upload PDF or Word documents." },
                { status: 400 }
            );
        }

        // Extract text from document
        let documentText = "";
        const buffer = Buffer.from(await file.arrayBuffer());

        if (file.type === "application/pdf") {
            // Parse PDF
            const pdfData = await pdf(buffer);
            documentText = pdfData.text;
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type === "application/msword"
        ) {
            // Parse Word document
            const result = await mammoth.extractRawText({ buffer });
            documentText = result.value;
        }

        if (!documentText || documentText.trim().length < 50) {
            return NextResponse.json(
                { message: "Could not extract sufficient text from document" },
                { status: 400 }
            );
        }

        // Use OpenAI to extract business information
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a business data extraction assistant. Extract relevant business information from the provided document and return it in JSON format. 
          
          Extract the following fields if available:
          - businessName: string
          - industry: string
          - description: string
          - yearEstablished: number
          - employeeCount: number
          - annualRevenue: number
          - expenses: number
          - profit: number
          - customerCount: number
          - topProducts: string[] (array of product names)
          - marketPosition: string
          - location: { address: string, city: string, state: string, country: string, postalCode: string }
          
          Return ONLY valid JSON. If a field is not found, omit it from the response.`,
                },
                {
                    role: "user",
                    content: `Extract business information from this document:\n\n${documentText.slice(0, 8000)}`,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const extractedData = JSON.parse(
            completion.choices[0].message.content || "{}"
        );

        // Return extracted data
        return NextResponse.json(
            {
                message: "Document parsed successfully",
                data: extractedData,
                fileName: file.name,
                fileSize: file.size,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Document parsing error:", error);

        if (error.code === "insufficient_quota") {
            return NextResponse.json(
                { message: "OpenAI API quota exceeded. Please try again later." },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: "Failed to parse document. Please try again." },
            { status: 500 }
        );
    }
}
