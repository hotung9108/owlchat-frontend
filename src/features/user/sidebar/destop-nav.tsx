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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { useNotification } from "@/hooks/use-notification";
import { MessageSquare, UserPlus, Users, ShieldBan, Bell, CheckCheck } from "lucide-react";

function getTypeIcon(type: string) {
    switch (type) {
        case "FRIEND_REQUEST":
            return <UserPlus className="w-4 h-4 text-blue-500" />;
        case "FRIENDSHIP":
            return <Users className="w-4 h-4 text-green-500" />;
        case "BLOCK":
            return <ShieldBan className="w-4 h-4 text-red-500" />;
        case "MESSAGE":
            return <MessageSquare className="w-4 h-4 text-purple-500" />;
        default:
            return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
}

export default function DesktopNav() {
    const paths = useUserNavigation();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {
        notifications,
        unreadCount,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
    } = useNotification();

    useEffect(() => {
        fetchNotifications(0, 5);
        fetchUnreadCount();
        // Refresh every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications(0, 5);
            fetchUnreadCount();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline" className="relative">
                            <Icons.Notification />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-destructive text-white">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="flex items-center justify-between px-3 py-2">
                            <span className="font-semibold text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs gap-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAllAsRead();
                                    }}
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Read all
                                </Button>
                            )}
                        </div>
                        <DropdownMenuSeparator />
                        {notifications.length > 0 ? (
                            <>
                                {notifications.slice(0, 5).map((n) => (
                                    <DropdownMenuItem
                                        key={n.id}
                                        className="flex items-start gap-2 py-2.5 cursor-pointer"
                                        onClick={() => {
                                            if (!n.isRead) markAsRead(n.id);
                                            navigate("/notifications");
                                        }}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getTypeIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug truncate ${!n.isRead ? "font-semibold" : "text-muted-foreground"}`}>
                                                {n.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {n.createdDate}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-center text-sm text-primary font-medium justify-center cursor-pointer"
                                    onClick={() => navigate("/notifications")}
                                >
                                    View all notifications
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No notifications
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
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
