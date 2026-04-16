import React from 'react';
import type { LocationData } from '@/config/mapbox';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMessageProps {
    location: LocationData;
    isMe?: boolean;
}

export const LocationMessage = React.memo(function LocationMessage(
    { location, isMe = false }: LocationMessageProps
) {

    const googleMapsUrl = `https://www.google.com/maps/search/${location.latitude},${location.longitude}`;
    const mapboxUrl = `https://maps.mapbox.com/?marker=${location.longitude},${location.latitude}`;

    return (
        <div
            className={`group relative p-3 rounded-2xl text-sm break-words shadow-sm transition-all overflow-hidden w-full
                ${isMe
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-muted-foreground rounded-bl-none'
                }
            `}
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        >
            {/* Map Preview */}
            <div className="mb-2 rounded-lg overflow-hidden border border-current border-opacity-20">
                <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative">
                    {/* Static map preview using Mapbox static images */}
                    <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${location.longitude},${location.latitude},10,0/400x300@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN || ''}`}
                        alt="Location map"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    
                    {/* Fallback if map fails to load */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                        <div className="text-center">
                            <MapPin className={`w-8 h-8 mx-auto mb-2 ${isMe ? 'text-primary-foreground' : 'text-primary'}`} />
                            <p className="text-xs font-medium">📍 Location</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Details */}
            <div className="space-y-1">
                <div className="flex items-start gap-1">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold leading-tight">
                            {location.address?.split(',')[0] || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                        </p>
                        {location.address && location.address.split(',').length > 1 && (
                            <p className="text-[10px] opacity-75 leading-tight mt-0.5">
                                {location.address.split(',').slice(1).join(',').trim()}
                            </p>
                        )}
                    </div>
                </div>

                {location.accuracy && (
                    <p className="text-[10px] opacity-60">
                        Accuracy: {Math.round(location.accuracy)}m
                    </p>
                )}

                {location.timestamp && (
                    <p className="text-[10px] opacity-60">
                        {new Date(location.timestamp).toLocaleTimeString()}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 mt-3 pt-2 border-t border-current border-opacity-20">
                <Button
                    size="sm"
                    variant="ghost"
                    className={`h-7 text-xs gap-1 ${isMe ? 'text-primary-foreground hover:bg-primary-foreground/20' : 'text-primary hover:bg-primary/10'}`}
                    asChild
                >
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                        Google Maps
                    </a>
                </Button>
            </div>

            {/* Hover context menu for more options */}
            <div className="hidden group-hover:flex absolute top-full right-2 mt-1 gap-1 bg-background border border-input p-1 rounded shadow-md">
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    asChild
                >
                    <a href={mapboxUrl} target="_blank" rel="noopener noreferrer">
                        Mapbox
                    </a>
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${location.latitude},${location.longitude}`
                        );
                    }}
                >
                    Copy Coords
                </Button>
            </div>
        </div>
    );
});

LocationMessage.displayName = 'LocationMessage';
