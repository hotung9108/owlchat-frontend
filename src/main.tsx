import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { TooltipProvider } from "@radix-ui/react-tooltip";
createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <TooltipProvider>
            <StrictMode>
                <App />
            </StrictMode>
        </TooltipProvider>
    </ThemeProvider>
);
