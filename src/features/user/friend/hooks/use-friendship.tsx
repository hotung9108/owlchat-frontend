import { useState, useCallback } from "react";
import friendshipService from "../services/friendship-service";
import type { Friendship } from "../types/friendship.type";

export const useFriendship = (requesterId: string | null) => {
    const [friendships, setFriendships] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFriendships = useCallback(
        async (
            page: number = 0,
            size: number = 10,
            ascSort: boolean = true,
            createdDateStart?: string,
            createdDateEnd?: string,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await friendshipService.getFriendships(
                    requesterId,
                    page,
                    size,
                    ascSort,
                    createdDateStart,
                    createdDateEnd,
                );
                setFriendships(data);
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching friendships",
                );
            } finally {
                setLoading(false);
            }
        },
        [requesterId],
    );

    const fetchFriendshipById = useCallback(
        async (id: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await friendshipService.getFriendshipById(
                    requesterId,
                    id,
                );
                return data;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching friendship",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [requesterId],
    );

    const fetchFriendshipWithUser = useCallback(
        async (userId: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await friendshipService.getFriendshipWithUser(
                    requesterId,
                    userId,
                );
                return data;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching friendship with user",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [requesterId],
    );

    const deleteFriendship = useCallback(
        async (id: string) => {
            setLoading(true);
            setError(null);
            try {
                const message = await friendshipService.deleteFriendship(
                    requesterId,
                    id,
                );
                setFriendships((prev) =>
                    prev.filter((friendship) => friendship.id !== id),
                );
                return message;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while deleting friendship",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [requesterId],
    );

    return {
        friendships,
        loading,
        error,
        fetchFriendships,
        fetchFriendshipById,
        fetchFriendshipWithUser,
        deleteFriendship,
    };
};