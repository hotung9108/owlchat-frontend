import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useUserNavigation } from "../chat/hooks/userUserNavigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/utils/constants";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWebSocket } from "@/providers/websocket-provider";
import { useState, useEffect } from "react";
export default function DesktopNav() {
    const paths = useUserNavigation();
    const { logout } = useAuth();
    const navigate = useNavigate();
    // const { subscribeToTopic } = useWebSocket();
    const [notifications, setNotifications] = useState<any[]>([]);
    // useEffect(() => {
    //     // Subscribe to the WebSocket topic for notifications
    //     subscribeToTopic(
    //         "/topic/chat.ad47a1db-a7c2-4f3e-a619-f113cff91212",
    //         (message) => {
    //             console.log("New notification received:", message.type);
    //             // const parsedMessage = JSON.parse(message.data);
    //             // console.log(parsedMessage);
    //             const payload =
    //                 typeof message === "string" ? JSON.parse(message) : message;
    //             setNotifications((prevNotifications) => [
    //                 message,
    //                 ...prevNotifications,
    //             ]);
    //         },
    //     );

    //     return () => {};
    // }, );

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <Card
            className="hidden lg:flex 
        lg:flex-col lg:justify-between 
        lg:items-center lg:h-full 
        lg:w-16 lg:px-2 lg:py-4"
        >
            <nav>
                <ul className="flex flex-col items-center gap-4">
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
                                        <TooltipContent
                                            side="left"
                                            align="center"
                                        >
                                            <div className="">{path.name}</div>
                                        </TooltipContent>
                                    </Tooltip>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="flex flex-col items-center gap-4">
                <ModeToggle />
                {/* <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Icons.Notification />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center">
                        <div className="">Notification</div>
                    </TooltipContent>
                </Tooltip> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Icons.Notification />
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {notifications.length > 0 ? (
                            notifications.map((n, index) => (
                                <DropdownMenuItem key={index}>
                                    <span className="font-medium">
                                        {n.data?.content ?? "New message"}
                                    </span>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem>
                                No notifications
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Icons.Settings />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center">
                        <div className="">Setting</div>
                    </TooltipContent>
                </Tooltip> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Icons.Settings />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate("/theme-settings")}>
                            Theme Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            My Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}
