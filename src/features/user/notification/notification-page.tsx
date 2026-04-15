import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/use-notification";
import LoadingLogo from "@/components/shared/loading-logo";
import ErrorLogo from "@/components/shared/error-logo";
import UserLayout from "../user-layout";
import ChatFullView from "../chat-fullview";
import owlLogo from "@/assets/owl-logo/black/owl-512.png";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { NotificationItem } from "@/types/notification.type";
import { CheckCheck, Trash2, Bell, BellOff, MessageSquare, UserPlus, Users, ShieldBan } from "lucide-react";

// Icon mapping for notification types
function getNotificationIcon(type: string) {
    switch (type) {
        case "FRIEND_REQUEST":
            return <UserPlus className="w-5 h-5 text-blue-500" />;
        case "FRIENDSHIP":
            return <Users className="w-5 h-5 text-green-500" />;
        case "BLOCK":
            return <ShieldBan className="w-5 h-5 text-red-500" />;
        case "MESSAGE":
            return <MessageSquare className="w-5 h-5 text-purple-500" />;
        default:
            return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
}

// Badge color mapping for notification actions
function getActionBadge(action: string) {
    switch (action) {
        case "CREATED":
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    New
                </span>
            );
        case "UPDATED":
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Updated
                </span>
            );
        case "DELETED":
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Removed
                </span>
            );
        default:
            return null;
    }
}

function NotificationCard({
    notification,
    onMarkRead,
    onDelete,
}: {
    notification: NotificationItem;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <Card
            className={`p-4 transition-all duration-200 hover:shadow-md ${
                notification.isRead
                    ? "opacity-70 bg-card"
                    : "bg-card border-l-4 border-l-primary"
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5 p-2 rounded-full bg-muted">
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {notification.type.replace("_", " ")}
                        </span>
                        {getActionBadge(notification.action)}
                        {!notification.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">
                        {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {notification.createdDate}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                    {!notification.isRead && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => onMarkRead(notification.id)}
                            title="Mark as read"
                        >
                            <CheckCheck className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(notification.id)}
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default function NotificationPage() {
    const [activeTab, setActiveTab] = useState("all");
    const {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotification();

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    useEffect(() => {
        if (activeTab === "all") {
            fetchNotifications();
        } else {
            fetchUnreadNotifications();
        }
    }, [activeTab]);

    if (loading) return <LoadingLogo />;
    if (error) return <ErrorLogo errorMessage={`Error: ${error}`} />;

    return (
        <UserLayout>
            <ChatFullView>
                {/* Header */}
                <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-4 lg:mt-6 lg:px-10">
                    <div className="flex items-center gap-4 mb-6 lg:mb-0">
                        <div
                            style={{
                                filter: `var(--logo-filter, invert(0.8) sepia(0.5) saturate(1.5))`,
                            }}
                        >
                            <img
                                src={owlLogo}
                                alt="Owl Logo"
                                className="w-10 h-10"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                                Notifications
                            </h1>
                            <p className="text-sm lg:text-base">
                                {unreadCount > 0
                                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                    : "All caught up!"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) => setActiveTab(value)}
                        >
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="unread">
                                    Unread
                                    {unreadCount > 0 && (
                                        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                                            {unreadCount > 99 ? "99+" : unreadCount}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="gap-1.5"
                            >
                                <CheckCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    Mark all read
                                </span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notification list */}
                <div className="w-full h-full overflow-y-auto lg:px-10 mt-4">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <BellOff className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">
                                {activeTab === "unread"
                                    ? "No unread notifications"
                                    : "No notifications yet"}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                {activeTab === "unread"
                                    ? "You're all caught up!"
                                    : "Notifications from friends and chats will appear here"}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pb-6">
                            {notifications.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onMarkRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </ChatFullView>
        </UserLayout>
    );
}
