import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Palette } from "lucide-react";
import { useUserNavigation } from "../chat/hooks/userUserNavigation";
import { useUserConversation } from "../chat/hooks/useUserConversation";
import { ModeToggle } from "@/components/mode-toggle";
import { Icons } from "@/utils/constants";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/use-notification";

export default function MobileNav() {
    const paths = useUserNavigation();
    const { isActive } = useUserConversation();
    const { logout } = useAuth();
    const navigate = useNavigate();
    if (isActive) return null;
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { unreadCount, fetchUnreadCount } = useNotification();

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleSettings = () => {
        setIsSettingsOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
            <nav className="w-full">
                <ul className="flex justify-evenly items-center gap-4">
                    {paths.map((path, id) => {
                        return (
                            <li key={id} className="relative">
                                <Link to={path.href}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant={
                                                    path.active
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {path.icon}
                                            </Button>
                                        </TooltipTrigger>
                                    </Tooltip>
                                </Link>
                            </li>
                        );
                    })}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={toggleSettings}
                        aria-label="Settings"
                    >
                        <Icons.Settings />
                    </Button>
                    {isSettingsOpen && (
                        <div
                            className={`absolute bottom-20 right-4 bg-popover text-popover-foreground border border-border rounded-md p-4 shadow-lg flex flex-col items-center gap-4
                            transition-all duration-300 ease-in-out transform ${
                                isSettingsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                        >
                            {/* Mode Toggle */}
                            <ModeToggle />

                            {/* Theme Settings */}
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Theme Settings"
                                onClick={() => {
                                    navigate("/theme-settings");
                                    setIsSettingsOpen(false);
                                }}
                                title="Theme Settings"
                            >
                                <Palette className="w-5 h-5" />
                            </Button>

                            {/* Notification Icon */}
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Notifications"
                                className="relative"
                                onClick={() => {
                                    navigate("/notifications");
                                    setIsSettingsOpen(false);
                                }}
                            >
                                <Icons.Notification />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold rounded-full bg-destructive text-white">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </Button>
                            
                            {/* My Profile */}
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="My Profile"
                                onClick={() => {
                                    navigate("/profile");
                                    setIsSettingsOpen(false);
                                }}
                            >
                                <User />
                            </Button>

                            {/* Logout */}
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Logout"
                                onClick={handleLogout}
                            >
                                <Icons.Logout/>
                            </Button>

                            {/* Avatar */}
                            {/* <Avatar className="w-10 h-10" /> */}
                        </div>
                    )}
                </ul>
            </nav>
        </Card>
    );
}

