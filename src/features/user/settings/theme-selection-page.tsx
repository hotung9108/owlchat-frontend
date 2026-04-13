import React from "react";
import { useThemeColorStore, type ThemeColor } from "@/stores/theme-color.store.tsx";
import { Card } from "@/components/ui/card";
import owlLogo from "@/assets/owl-logo/black/owl-512.png";
import ChatFullView from "../chat-fullview";

interface ThemeOption {
    id: ThemeColor;
    name: string;
    description: string;
    colors: {
        light: {
            primary: string;
            secondary: string;
        };
        dark: {
            primary: string;
            secondary: string;
        };
    };
}

const THEME_OPTIONS: ThemeOption[] = [
    {
        id: "theme1",
        name: "Ocean Green",
        description: "Calm and professional with ocean green tones",
        colors: {
            light: {
                primary: "#67c97e",
                secondary: "#e5e7eb",
            },
            dark: {
                primary: "#7dd0b7",
                secondary: "#4a4e51",
            },
        },
    },
    {
        id: "theme2",
        name: "Purple Sunset",
        description: "Vibrant and creative with purple hues",
        colors: {
            light: {
                primary: "#a855f7",
                secondary: "#ede9fe",
            },
            dark: {
                primary: "#c084fc",
                secondary: "#5a4a6f",
            },
        },
    },
    {
        id: "theme3",
        name: "Coral Warm",
        description: "Warm and inviting with coral tones",
        colors: {
            light: {
                primary: "#f97316",
                secondary: "#fef3c7",
            },
            dark: {
                primary: "#fb923c",
                secondary: "#6c3d2f",
            },
        },
    },
];

const ThemeCard: React.FC<{
    theme: ThemeOption;
    isSelected: boolean;
    onSelect: (themeId: ThemeColor) => void;
}> = ({ theme, isSelected, onSelect }) => {
    return (
        <div
            className={`cursor-pointer transition-all duration-300 rounded-lg border-2 border-t-4 p-2 ${
                isSelected
                    ? "border-t-primary"
                    : "border-t-muted hover:shadow-lg"
            } border-muted-foreground/20 hover:border-muted-foreground/40`}
            onClick={() => onSelect(theme.id)}
            style={{
                borderTopColor: isSelected ? "var(--primary)" : "var(--muted-foreground)",
            }}
        >
            <h3 className="text-sm font-semibold mb-2">{theme.name}</h3>
            <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                    <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.light.primary }}
                        title="Light Primary"
                    />
                    <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.light.secondary }}
                        title="Light Secondary"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.dark.primary }}
                        title="Dark Primary"
                    />
                    <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.dark.secondary }}
                        title="Dark Secondary"
                    />
                </div>
            </div>
        </div>
    );
};

const ThemeSelectionPage = () => {
    const { themeColor, setThemeColor } = useThemeColorStore();

    const handleThemeChange = (themeId: ThemeColor) => {
        setThemeColor(themeId);
    };

    return (
        <ChatFullView>
            <div className="flex flex-col w-full h-full">
                <div className="flex items-center gap-4 mb-6 lg:mb-8 mt-4 lg:mt-6 lg:px-10">
                    <div style={{ filter: `var(--logo-filter, invert(0.8) sepia(0.5) saturate(1.5))` }}>
                        <img
                            src={owlLogo}
                            alt="Owl Logo"
                            className="w-10 h-10"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                            Theme Gallery
                        </h1>
                        <p className="text-sm lg:text-base">
                            Customize your experience with different color themes
                        </p>
                    </div>
                </div>

                <div className="w-full h-full overflow-y-auto lg:px-10 pb-6">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                        {THEME_OPTIONS.map((theme) => (
                            <ThemeCard
                                key={theme.id}
                                theme={theme}
                                isSelected={themeColor === theme.id}
                                onSelect={handleThemeChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ChatFullView>
    );
};

export default ThemeSelectionPage;
