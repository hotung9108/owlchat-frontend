import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useUserNavigation } from "../chat/hooks/userUserNavigation";
import { useUserConversation } from "../chat/hooks/useUserConversation";
import { ModeToggle } from "@/components/mode-toggle";
import { Icons } from "@/utils/constants";
import { useState } from "react";
export default function MobileNav() {
    const paths = useUserNavigation();
    const { isActive } = useUserConversation();
    if (isActive) return null;
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const toggleSettings = () => {
        setIsSettingsOpen((prev) => !prev);
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
                                        <TooltipTrigger>
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
                    {/* <li>
                        <ModeToggle />
                    </li>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button size="icon" variant="outline">
                                <Icons.Notification />
                            </Button>
                        </TooltipTrigger>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button size="icon" variant="outline">
                                <Icons.Settings />
                            </Button>
                        </TooltipTrigger>
                    </Tooltip> */}
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

                            {/* Notification Icon */}
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Notifications"
                            >
                                <Icons.Notification />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                aria-label="Logout"
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
