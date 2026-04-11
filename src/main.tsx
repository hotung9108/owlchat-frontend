import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { UserProfileProvider } from "./providers/user-profile-provider.tsx";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { WebSocketProvider } from "./providers/websocket-provider.tsx";
// import { WebSocketProvider } from "./providers/websocket-provider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WebSocketProvider>
            <ThemeProvider>
                <UserProfileProvider>
                    {/* <WebSocketProvider> */}
                    <TooltipProvider>
                        <App />
                    </TooltipProvider>
                    {/* </WebSocketProvider> */}
                </UserProfileProvider>
            </ThemeProvider>
        </WebSocketProvider>
    </StrictMode>,
);
