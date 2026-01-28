/**
 * Design System Color Palette
 * Based on user's custom color scheme
 */

export const colors = {
    // Primary Colors
    primary: {
        blue: '#3E4A8A',        // Primary Blue (Buttons, Icons, Headings)
        lightBg: '#EAF2FF',     // Light Blue Background
    },

    // Neutral Colors
    neutral: {
        white: '#FFFFFF',       // Card / Form Background
        border: '#D8DDE6',      // Input Border / Divider Grey
        textSecondary: '#9AA3B2', // Secondary Text Grey
        textPrimary: '#2E2E2E', // Primary Text (Dark Grey)
    },

    // Accent Color
    accent: {
        link: '#5A7DFF',        // Link / "Forgot password?"
    },
} as const;

/**
 * Business Challenge Types
 */
export const CHALLENGES = [
    {
        id: 'talent',
        label: 'Talented Peoples',
        description: 'Finding and retaining skilled employees',
        icon: 'Users',
    },
    {
        id: 'costs',
        label: 'Rising Costs and Inflation',
        description: 'Managing increasing operational expenses',
        icon: 'TrendingUp',
    },
    {
        id: 'cyber',
        label: 'Cyber Attacks',
        description: 'Protecting against digital threats',
        icon: 'Shield',
    },
    {
        id: 'supply',
        label: 'Supply Chain Disruptions',
        description: 'Ensuring reliable product/service delivery',
        icon: 'Truck',
    },
    {
        id: 'uncertainty',
        label: 'Political and Economic Uncertainty',
        description: 'Navigating market volatility',
        icon: 'AlertTriangle',
    },
    {
        id: 'ai',
        label: 'AI and Technological Adoption',
        description: 'Leveraging new technologies',
        icon: 'Cpu',
    },
    {
        id: 'digital',
        label: 'Digital Presence and Online Marketing Gaps',
        description: 'Building effective online presence',
        icon: 'Globe',
    },
    {
        id: 'sustainability',
        label: 'Societal Expectations and Sustainability Pressures',
        description: 'Meeting ESG and sustainability goals',
        icon: 'Leaf',
    },
] as const;

/**
 * Business Industry Types
 */
export const INDUSTRIES = [
    'Restaurant',
    'Retail',
    'E-commerce',
    'Technology',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Real Estate',
    'Finance',
    'Hospitality',
    'Transportation',
    'Agriculture',
    'Other',
] as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    auth: {
        signup: '/api/auth/signup',
        signin: '/api/auth/signin',
    },
    business: {
        create: '/api/business/create',
        update: '/api/business/update',
        parseDocument: '/api/business/parse-document',
    },
    competitors: {
        fetch: '/api/competitors/fetch',
        analyze: '/api/competitors/analyze',
    },
    report: {
        generate: '/api/report/generate',
    },
    trends: {
        fetch: '/api/trends/fetch',
    },
    notifications: {
        create: '/api/notifications/create',
    },
    dashboard: {
        stats: '/api/dashboard/stats',
    },
} as const;

/**
 * App Routes
 */
export const ROUTES = {
    home: '/',
    login: '/login',
    signup: '/signup',
    onboarding: '/onboarding',
    dashboard: {
        home: '/dashboard',
        competitors: '/dashboard/competitors',
        report: '/dashboard/report',
        trends: '/dashboard/trends',
        settings: '/dashboard/settings',
    },
} as const;
