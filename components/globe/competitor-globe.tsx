"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { formatCompetitorsForGlobe } from "@/lib/competitors";

// Dynamically import Globe.GL to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface CompetitorGlobeProps {
    competitors: any[];
    userLocation?: {
        lat: number;
        lng: number;
    };
    onCompetitorClick?: (competitor: any) => void;
}

export default function CompetitorGlobe({
    competitors,
    userLocation,
    onCompetitorClick,
}: CompetitorGlobeProps) {
    const globeEl = useRef<any>();
    const [globeReady, setGlobeReady] = useState(false);

    // Format competitors for globe visualization
    const globeData = formatCompetitorsForGlobe(competitors);

    // Add user's business location
    const allPoints = userLocation
        ? [
            ...globeData,
            {
                lat: userLocation.lat,
                lng: userLocation.lng,
                name: "Your Business",
                isUser: true,
                size: 0.8,
                color: "#3E4A8A", // Primary color
            },
        ]
        : globeData;

    useEffect(() => {
        if (globeEl.current && userLocation) {
            // Point camera to user's location
            globeEl.current.pointOfView(
                {
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                    altitude: 2.5,
                },
                1000
            );
        }
    }, [userLocation, globeReady]);

    return (
        <div className="w-full h-full relative">
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Points (competitors)
                pointsData={allPoints}
                pointLat="lat"
                pointLng="lng"
                pointColor={(d: any) => d.color}
                pointAltitude={(d: any) => d.size * 0.01}
                pointRadius={(d: any) => d.size * 0.5}
                pointLabel={(d: any) => {
                    if (d.isUser) {
                        return `<div style="background: rgba(62, 74, 138, 0.9); padding: 8px 12px; border-radius: 8px; color: white; font-weight: 600;">
              ${d.name}
            </div>`;
                    }
                    return `<div style="background: rgba(0, 0, 0, 0.8); padding: 8px 12px; border-radius: 8px; color: white;">
            <div style="font-weight: 600; margin-bottom: 4px;">${d.name}</div>
            <div style="font-size: 12px; opacity: 0.8;">${d.industry}</div>
            ${d.distance ? `<div style="font-size: 12px; margin-top: 4px;">📍 ${d.distance.toFixed(1)} km away</div>` : ""}
            ${d.revenue ? `<div style="font-size: 12px;">💰 ₹${(d.revenue / 1000000).toFixed(1)}M</div>` : ""}
          </div>`;
                }}
                onPointClick={(point: any) => {
                    if (!point.isUser && onCompetitorClick) {
                        const competitor = competitors.find(
                            (c) =>
                                c.location.coordinates.lat === point.lat &&
                                c.location.coordinates.lng === point.lng
                        );
                        if (competitor) {
                            onCompetitorClick(competitor);
                        }
                    }
                }}

                // Arcs (connections from user to competitors)
                arcsData={
                    userLocation
                        ? globeData.map((competitor) => ({
                            startLat: userLocation.lat,
                            startLng: userLocation.lng,
                            endLat: competitor.lat,
                            endLng: competitor.lng,
                            color:
                                competitor.threatLevel === "high"
                                    ? ["#3E4A8A", "#EF4444"]
                                    : competitor.threatLevel === "medium"
                                        ? ["#3E4A8A", "#F59E0B"]
                                        : ["#3E4A8A", "#10B981"],
                        }))
                        : []
                }
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={0.2}
                arcDashAnimateTime={3000}
                arcStroke={0.5}

                // Atmosphere
                atmosphereColor="#5A7DFF"
                atmosphereAltitude={0.15}

                // Controls
                enablePointerInteraction={true}

                // Animation
                animateIn={true}

                onGlobeReady={() => setGlobeReady(true)}
            />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg">
                <h4 className="font-semibold text-foreground mb-3 text-sm">Threat Level</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-foreground">High Threat</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-foreground">Medium Threat</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs text-foreground">Low Threat</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs text-foreground">Your Business</span>
                    </div>
                </div>
            </div>

            {/* Controls Info */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg">
                <p className="text-xs text-muted-foreground">
                    🖱️ Drag to rotate • Scroll to zoom • Click markers for details
                </p>
            </div>
        </div>
    );
}
