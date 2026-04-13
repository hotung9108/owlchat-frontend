import { createContext, useContext, type ReactNode, useState, useEffect } from "react";

export type ThemeColor = "theme1" | "theme2" | "theme3";

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (theme: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "vite-ui-theme-color";

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeColor | null;
    return saved || "theme1";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeColor);
    localStorage.setItem(THEME_STORAGE_KEY, themeColor);
  }, [themeColor]);

  const setThemeColor = (theme: ThemeColor) => {
    setThemeColorState(theme);
  };

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColorStore() {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error("useThemeColorStore must be used within ThemeColorProvider");
  }
  return context;
}

// Initialize the theme on app load
const savedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeColor) || "theme1";
document.documentElement.setAttribute("data-theme", savedTheme);
