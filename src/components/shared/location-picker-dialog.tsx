import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapboxMap } from './mapbox-map';
import type { LocationData } from '@/config/mapbox';
import { Loader2, MapPin } from 'lucide-react';

interface LocationPickerDialogProps {
    open: boolean;
    onClose: () => void;
    onLocationSelect: (location: LocationData) => void;
}

export const LocationPickerDialog = React.memo(function LocationPickerDialog(
    { open, onClose, onLocationSelect }: LocationPickerDialogProps
) {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const handleLocationSelect = useCallback((location: LocationData) => {
        setSelectedLocation(location);
    }, []);

    const handleSubmit = async () => {
        if (!selectedLocation) return;

        try {
            setIsSubmitting(true);
            onLocationSelect(selectedLocation);
            onClose();
        } catch (error) {
            console.error('Error sending location:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setSelectedLocation(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Share Location
                    </DialogTitle>
                    <DialogDescription>
                        Click on the map to select your location, then share it with the group.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-[400px] w-full rounded-lg overflow-hidden border border-input bg-muted">
                    <MapboxMap
                        ref={mapRef}
                        onLocationSelect={handleLocationSelect}
                        allowSelection={true}
                        initialLocation={selectedLocation || undefined}
                    />
                </div>

                {selectedLocation && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-input">
                        <p className="text-xs font-semibold text-foreground mb-1">📍 Selected Location</p>
                        <p className="text-sm text-muted-foreground">
                            {selectedLocation.address || `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`}
                        </p>
                        {selectedLocation.accuracy && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Accuracy: {Math.round(selectedLocation.accuracy)}m
                            </p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!selectedLocation || isSubmitting}
                        className="gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Share Location
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

LocationPickerDialog.displayName = 'LocationPickerDialog';
