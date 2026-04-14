import { useState, useCallback } from "react";
import type { NotificationItem } from "@/types/notification.type";
import { notificationService } from "@/services/notification-service";

export const useNotification = (
    accountId: string | null = null,
    requesterId: string | null = null,
) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(
        async (page: number = 0, size: number = 20) => {
            setLoading(true);
            setError(null);
            try {
                const data = await notificationService.getNotifications(
                    accountId,
                    requesterId,
                    page,
                    size,
                );
                setNotifications(data);
            } catch (err: any) {
                setError(
                    err.message || "An error occurred while fetching notifications",
                );
            } finally {
                setLoading(false);
            }
        },
        [accountId, requesterId],
    );

    const fetchUnreadNotifications = useCallback(
        async (page: number = 0, size: number = 20) => {
            setLoading(true);
            setError(null);
            try {
                const data = await notificationService.getUnreadNotifications(
                    accountId,
                    requesterId,
                    page,
                    size,
                );
                setNotifications(data);
            } catch (err: any) {
                setError(
                    err.message || "An error occurred while fetching unread notifications",
                );
            } finally {
                setLoading(false);
            }
        },
        [accountId, requesterId],
    );

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationService.getUnreadCount(
                accountId,
                requesterId,
            );
            setUnreadCount(count);
        } catch (err: any) {
            console.error("Failed to fetch unread count:", err);
        }
    }, [accountId, requesterId]);

    const markAsRead = useCallback(
        async (id: string) => {
            try {
                await notificationService.markAsRead(accountId, requesterId, id);
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (err: any) {
                setError(
                    err.message || "An error occurred while marking notification as read",
                );
            }
        },
        [accountId, requesterId],
    );

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead(accountId, requesterId);
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true })),
            );
            setUnreadCount(0);
        } catch (err: any) {
            setError(
                err.message || "An error occurred while marking all as read",
            );
        }
    }, [accountId, requesterId]);

    const deleteNotification = useCallback(
        async (id: string) => {
            try {
                await notificationService.deleteNotification(
                    accountId,
                    requesterId,
                    id,
                );
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (err: any) {
                setError(
                    err.message || "An error occurred while deleting notification",
                );
            }
        },
        [accountId, requesterId],
    );

    return {
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
    };
};
