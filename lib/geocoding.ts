/**
 * Geocoding utilities using Geoapify API
 */

interface GeocodeResult {
    formatted: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    lat: number;
    lon: number;
}

interface GeocodeResponse {
    features: Array<{
        properties: GeocodeResult;
    }>;
}

/**
 * Geocode an address using Geoapify API
 * @param address - Full address string to geocode
 * @returns Geocoded location data with coordinates
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!address || address.trim().length < 3) {
        return null;
    }

    try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
        if (!apiKey) {
            console.error("Geoapify API key not found");
            return null;
        }

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                address
            )}&apiKey=${apiKey}&limit=1`
        );

        if (!response.ok) {
            console.error("Geocoding API error:", response.statusText);
            return null;
        }

        const data: GeocodeResponse = await response.json();

        if (data.features && data.features.length > 0) {
            return data.features[0].properties;
        }

        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

/**
 * Reverse geocode coordinates to get address
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Address data
 */
export async function reverseGeocode(
    lat: number,
    lon: number
): Promise<GeocodeResult | null> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
        if (!apiKey) {
            console.error("Geoapify API key not found");
            return null;
        }

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
        );

        if (!response.ok) {
            console.error("Reverse geocoding API error:", response.statusText);
            return null;
        }

        const data: GeocodeResponse = await response.json();

        if (data.features && data.features.length > 0) {
            return data.features[0].properties;
        }

        return null;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
}

/**
 * Get autocomplete suggestions for address input
 * @param query - Partial address string
 * @param limit - Maximum number of suggestions (default: 5)
 * @returns Array of geocoded suggestions
 */
export async function getAddressSuggestions(
    query: string,
    limit: number = 5
): Promise<GeocodeResult[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }

    try {
        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
        if (!apiKey) {
            console.error("Geoapify API key not found");
            return [];
        }

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                query
            )}&apiKey=${apiKey}&limit=${limit}`
        );

        if (!response.ok) {
            console.error("Autocomplete API error:", response.statusText);
            return [];
        }

        const data: GeocodeResponse = await response.json();

        if (data.features && data.features.length > 0) {
            return data.features.map((feature) => feature.properties);
        }

        return [];
    } catch (error) {
        console.error("Autocomplete error:", error);
        return [];
    }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}
