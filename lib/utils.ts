import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ============================================
// DATE & TIME UTILITIES
// ============================================

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format date to short format (MM/DD/YYYY)
 */
export function formatDateShort(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(d);
}

// ============================================
// NUMBER & CURRENCY UTILITIES
// ============================================

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return num.toLocaleString("en-US");
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * Format currency for Indian Rupees
 */
export function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(amount);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert string to slug (URL-friendly)
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/**
 * Extract initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate password strength
 * Returns: { valid: boolean, message: string }
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    return { valid: true, message: "Password is strong" };
}

// ============================================
// GEOCODING & LOCATION UTILITIES
// ============================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
}

// ============================================
// FILE UPLOAD UTILITIES
// ============================================

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size (in MB)
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// ============================================
// BUSINESS-SPECIFIC UTILITIES
// ============================================

/**
 * Calculate business health score (0-100)
 * Based on various metrics
 */
export function calculateHealthScore(metrics: {
    revenue?: number;
    growth?: number;
    competitorCount?: number;
    digitalPresence?: number;
}): number {
    let score = 50; // Base score

    // Revenue impact (0-20 points)
    if (metrics.revenue) {
        if (metrics.revenue > 1000000) score += 20;
        else if (metrics.revenue > 500000) score += 15;
        else if (metrics.revenue > 100000) score += 10;
        else score += 5;
    }

    // Growth impact (0-30 points)
    if (metrics.growth !== undefined) {
        if (metrics.growth > 20) score += 30;
        else if (metrics.growth > 10) score += 20;
        else if (metrics.growth > 0) score += 10;
        else score -= 10;
    }

    // Competitor impact (0-20 points, inverse)
    if (metrics.competitorCount !== undefined) {
        if (metrics.competitorCount < 3) score += 20;
        else if (metrics.competitorCount < 5) score += 15;
        else if (metrics.competitorCount < 10) score += 10;
        else score += 5;
    }

    // Digital presence (0-30 points)
    if (metrics.digitalPresence !== undefined) {
        score += metrics.digitalPresence * 30;
    }

    return Math.min(100, Math.max(0, score));
}

/**
 * Get health score color
 */
export function getHealthScoreColor(score: number): string {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
}

/**
 * Get health score label
 */
export function getHealthScoreLabel(score: number): string {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
}

// ============================================
// GENERAL UTILITIES
// ============================================

/**
 * Generate random ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === "object") return Object.keys(obj).length === 0;
    return false;
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "An unknown error occurred";
}

/**
 * Format API error for display
 */
export function formatApiError(error: any): string {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    return "Something went wrong. Please try again.";
}
