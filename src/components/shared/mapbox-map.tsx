import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MAPBOX_CONFIG, type LocationData } from '@/config/mapbox';
import { MapPin } from 'lucide-react';

// Dynamically load Mapbox GL JS
const loadMapboxGL = async () => {
    if ((window as any).mapboxgl) return (window as any).mapboxgl;
    
    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.href = 'https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.css';
    cssLink.rel = 'stylesheet';
    document.head.appendChild(cssLink);
    
    // Load JS
return new Promise<any>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.js';
        script.onload = () => resolve((window as any).mapboxgl);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

interface MapboxMapProps {
    onLocationSelect?: (location: LocationData) => void;
    allowSelection?: boolean;
    initialLocation?: LocationData;
}

export const MapboxMap = React.forwardRef<HTMLDivElement, MapboxMapProps>(
    ({ onLocationSelect, allowSelection = true, initialLocation }, ref) => {
        const mapContainer = useRef<HTMLDivElement>(null);
        const map = useRef<any>(null);
        const marker = useRef<any>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [currentLocation, setCurrentLocation] = useState<LocationData | null>(initialLocation || null);
        const [error, setError] = useState<string | null>(null);

        // Initialize map
        useEffect(() => {
            const initMap = async () => {
                try {
                    const mapboxgl = await loadMapboxGL();
                    mapboxgl.accessToken = MAPBOX_CONFIG.TOKEN;

                    if (!mapContainer.current) return;

                    // Create map
                    map.current = new mapboxgl.Map({
                        container: mapContainer.current,
                        style: MAPBOX_CONFIG.STYLE,
                        center: initialLocation 
                            ? [initialLocation.longitude, initialLocation.latitude]
                            : [MAPBOX_CONFIG.INITIAL_CENTER.lng, MAPBOX_CONFIG.INITIAL_CENTER.lat],
                        zoom: MAPBOX_CONFIG.INITIAL_ZOOM,
                    });

                    // Add controls
                    map.current.addControl(new mapboxgl.NavigationControl());
                    map.current.addControl(new mapboxgl.FullscreenControl());

                    // Add geolocate control
                    const geolocate = new mapboxgl.GeolocateControl({
                        positionOptions: { enableHighAccuracy: true },
                        trackUserLocation: false,
                        showUserLocation: true,
                    });
                    map.current.addControl(geolocate);

                    // Add marker if location provided
                    if (initialLocation) {
                        addMarker(
                            initialLocation.latitude,
                            initialLocation.longitude,
                            mapboxgl
                        );
                    }

                    // Handle map click for location selection
                    if (allowSelection) {
                        map.current.on('click', handleMapClick);
                    }

                    setIsLoading(false);
                } catch (err) {
                    setError('Failed to load map. Check Mapbox token.');
                    console.error('Mapbox initialization error:', err);
                    setIsLoading(false);
                }
            };

            initMap();

            return () => {
                if (map.current) {
                    map.current.off('click', handleMapClick);
                }
            };
        }, []);

        const addMarker = useCallback(
            (lat: number, lng: number, mapboxgl: any) => {
                // Remove existing marker
                if (marker.current) {
                    marker.current.remove();
                }

                // Create new marker
                const el = document.createElement('div');
                el.className = 'w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer';
                el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3C/svg%3E")`;
                el.style.backgroundSize = 'contain';

                marker.current = new mapboxgl.Marker(el)
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            },
            []
        );

        const handleMapClick = useCallback(
            async (e: any) => {
                if (!allowSelection) return;

                const { lng, lat } = e.lngLat;
                const location: LocationData = {
                    latitude: lat,
                    longitude: lng,
                    timestamp: Date.now(),
                };

                // Try to get address using reverse geocoding
                try {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_CONFIG.TOKEN}`
                    );
                    const data = await response.json();
                    if (data.features?.[0]) {
                        location.address = data.features[0].place_name;
                    }
                } catch (err) {
                    console.error('Reverse geocoding error:', err);
                }

                setCurrentLocation(location);
                addMarker(lat, lng, (window as any).mapboxgl);
                onLocationSelect?.(location);
            },
            [allowSelection, onLocationSelect, addMarker]
        );

        if (error) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                </div>
            );
        }

        return (
            <div ref={ref || mapContainer} className="w-full h-full rounded-lg overflow-hidden">
                <div ref={mapContainer} className="w-full h-full" />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {currentLocation && allowSelection && (
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg max-w-xs">
                        <p className="text-xs font-semibold text-foreground mb-1">📍 Location Selected</p>
                        <p className="text-xs text-muted-foreground">
                            {currentLocation.address || `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                        </p>
                    </div>
                )}
            </div>
        );
    }
);

MapboxMap.displayName = 'MapboxMap';
