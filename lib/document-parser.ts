/**
 * Document parsing utilities for PDF and Word documents
 */

import pdf from "pdf-parse";
import mammoth from "mammoth";

export interface ParsedDocument {
    text: string;
    pageCount?: number;
    metadata?: {
        title?: string;
        author?: string;
        creationDate?: string;
    };
}

/**
 * Parse PDF document and extract text
 * @param buffer - PDF file buffer
 * @returns Parsed document data
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedDocument> {
    try {
        const data = await pdf(buffer);

        return {
            text: data.text,
            pageCount: data.numpages,
            metadata: {
                title: data.info?.Title,
                author: data.info?.Author,
                creationDate: data.info?.CreationDate,
            },
        };
    } catch (error) {
        console.error("PDF parsing error:", error);
        throw new Error("Failed to parse PDF document");
    }
}

/**
 * Parse Word document (.docx) and extract text
 * @param buffer - Word file buffer
 * @returns Parsed document data
 */
export async function parseWordDocument(buffer: Buffer): Promise<ParsedDocument> {
    try {
        const result = await mammoth.extractRawText({ buffer });

        return {
            text: result.value,
            metadata: {},
        };
    } catch (error) {
        console.error("Word document parsing error:", error);
        throw new Error("Failed to parse Word document");
    }
}

/**
 * Parse document based on file type
 * @param buffer - File buffer
 * @param mimeType - MIME type of the file
 * @returns Parsed document data
 */
export async function parseDocument(
    buffer: Buffer,
    mimeType: string
): Promise<ParsedDocument> {
    switch (mimeType) {
        case "application/pdf":
            return parsePDF(buffer);

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
            return parseWordDocument(buffer);

        default:
            throw new Error(`Unsupported file type: ${mimeType}`);
    }
}

/**
 * Extract key business metrics from document text using regex patterns
 * @param text - Document text
 * @returns Extracted metrics
 */
export function extractBusinessMetrics(text: string): {
    revenue?: number;
    expenses?: number;
    profit?: number;
    employeeCount?: number;
} {
    const metrics: any = {};

    // Revenue patterns
    const revenuePatterns = [
        /revenue[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
        /total\s+sales[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
        /annual\s+revenue[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
    ];

    for (const pattern of revenuePatterns) {
        const match = text.match(pattern);
        if (match) {
            metrics.revenue = parseFloat(match[1].replace(/,/g, ""));
            break;
        }
    }

    // Expenses patterns
    const expensesPatterns = [
        /expenses?[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
        /total\s+costs?[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
    ];

    for (const pattern of expensesPatterns) {
        const match = text.match(pattern);
        if (match) {
            metrics.expenses = parseFloat(match[1].replace(/,/g, ""));
            break;
        }
    }

    // Profit patterns
    const profitPatterns = [
        /profit[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
        /net\s+income[:\s]+(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{2})?)/i,
    ];

    for (const pattern of profitPatterns) {
        const match = text.match(pattern);
        if (match) {
            metrics.profit = parseFloat(match[1].replace(/,/g, ""));
            break;
        }
    }

    // Employee count patterns
    const employeePatterns = [
        /employees?[:\s]+([\d,]+)/i,
        /staff[:\s]+([\d,]+)/i,
        /team\s+size[:\s]+([\d,]+)/i,
    ];

    for (const pattern of employeePatterns) {
        const match = text.match(pattern);
        if (match) {
            metrics.employeeCount = parseInt(match[1].replace(/,/g, ""));
            break;
        }
    }

    return metrics;
}

/**
 * Clean and normalize extracted text
 * @param text - Raw text
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
    return text
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
        .trim();
}
