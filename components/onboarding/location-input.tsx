"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { geocodeAddress } from "@/lib/utils";

interface LocationData {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

interface LocationInputProps {
    value: LocationData;
    onChange: (location: LocationData) => void;
    disabled?: boolean;
}

interface GeocodeSuggestion {
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

export default function LocationInput({ value, onChange, disabled }: LocationInputProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Fetch suggestions from Geoapify
    const fetchSuggestions = async (query: string) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    query
                )}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}&limit=5`
            );

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const formattedSuggestions = data.features.map((feature: any) => ({
                    formatted: feature.properties.formatted,
                    address_line1: feature.properties.address_line1 || "",
                    address_line2: feature.properties.address_line2 || "",
                    city: feature.properties.city || "",
                    state: feature.properties.state || "",
                    country: feature.properties.country || "",
                    postcode: feature.properties.postcode || "",
                    lat: feature.properties.lat,
                    lon: feature.properties.lon,
                }));

                setSuggestions(formattedSuggestions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(searchQuery);
        }, 500);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    const handleSuggestionClick = (suggestion: GeocodeSuggestion) => {
        onChange({
            address: suggestion.address_line1 || suggestion.formatted,
            city: suggestion.city,
            state: suggestion.state,
            country: suggestion.country,
            postalCode: suggestion.postcode,
            coordinates: {
                lat: suggestion.lat,
                lng: suggestion.lon,
            },
        });

        setSearchQuery("");
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <div className="relative">
                    <Input
                        label="Search Location"
                        placeholder="Start typing an address..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        disabled={disabled}
                        icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                            >
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {suggestion.formatted}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {suggestion.city && `${suggestion.city}, `}
                                            {suggestion.state && `${suggestion.state}, `}
                                            {suggestion.country}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Manual Input Fields */}
            <div className="space-y-4 pt-2">
                <Input
                    label="Address *"
                    name="address"
                    value={value.address}
                    onChange={(e) => onChange({ ...value, address: e.target.value })}
                    placeholder="Street address"
                    disabled={disabled}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="City *"
                        name="city"
                        value={value.city}
                        onChange={(e) => onChange({ ...value, city: e.target.value })}
                        placeholder="City"
                        disabled={disabled}
                    />

                    <Input
                        label="State *"
                        name="state"
                        value={value.state}
                        onChange={(e) => onChange({ ...value, state: e.target.value })}
                        placeholder="State"
                        disabled={disabled}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Country *"
                        name="country"
                        value={value.country}
                        onChange={(e) => onChange({ ...value, country: e.target.value })}
                        placeholder="Country"
                        disabled={disabled}
                    />

                    <Input
                        label="Postal Code *"
                        name="postalCode"
                        value={value.postalCode}
                        onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
                        placeholder="Postal code"
                        disabled={disabled}
                    />
                </div>

                {/* Coordinates Display (if available) */}
                {value.coordinates && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            📍 Coordinates: {value.coordinates.lat.toFixed(6)}, {value.coordinates.lng.toFixed(6)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
