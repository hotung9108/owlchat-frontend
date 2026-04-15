// Mapbox Configuration
export const MAPBOX_CONFIG = {
    TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || '',
    STYLE: import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
    INITIAL_CENTER: {
        lng: parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '106.6837'),
        lat: parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '10.7769'),
    },
    INITIAL_ZOOM: parseFloat(import.meta.env.VITE_MAP_ZOOM || '9'),
};

export interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
    timestamp?: number;
}

export const isMapboxAvailable = (): boolean => {
    return MAPBOX_CONFIG.TOKEN.length > 0;
};
