import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import LoadingLogo from "@/components/shared/loading-logo";
import ErrorLogo from "@/components/shared/error-logo";
import { useFriendship } from "@/hooks/use-friendship";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import FriendCard from "./friend-listfriend-card";
import { eventBus } from "@/lib/event-bus";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function FriendListFriendPage() {
    const {
        profile,
        loading: userLoading,
    } = useUserProfileContext();
    const { friendships, loading, error, fetchFriendships } = useFriendship();
    const { fetchProfileById } = useUserProfile();
    const [searchQuery, setSearchQuery] = useState("");
    const [friendNamesMap, setFriendNamesMap] = useState<Record<string, string>>({});

    useEffect(() => {
        // Fetch all friendships using page = -1
        fetchFriendships(-1, 10);
        
        const handleSocial = () => {
            fetchFriendships(-1, 10000);
        };
        eventBus.on("social", handleSocial);
        return () => {
            eventBus.off("social", handleSocial);
        };
    }, [fetchFriendships]);

    // Fetch friend names for search filtering
    useEffect(() => {
        const loadFriendNames = async () => {
            const namesMap: Record<string, string> = {};
            for (const friendship of friendships) {
                const friendId =
                    friendship.firstUserId === profile?.id
                        ? friendship.secondUserId
                        : friendship.firstUserId;
                
                if (!namesMap[friendId]) {
                    try {
                        const friendProfile = await fetchProfileById(friendId);
                        namesMap[friendId] = friendProfile?.name || "Unknown";
                    } catch (err) {
                        namesMap[friendId] = "Unknown";
                    }
                }
            }
            setFriendNamesMap(namesMap);
        };

        if (friendships.length > 0 && profile?.id) {
            loadFriendNames();
        }
    }, [friendships, profile?.id, fetchProfileById]);
    if (loading || userLoading) return <LoadingLogo />;
    if (error) return <ErrorLogo errorMessage={`Error: ${error}`} />;

    // Filter friendships by search query
    const filteredFriendships = useMemo(() => {
        if (!searchQuery.trim()) return friendships;
        
        const query = searchQuery.toLowerCase();
        return friendships.filter((friendship) => {
            const friendId =
                friendship.firstUserId === profile?.id
                    ? friendship.secondUserId
                    : friendship.firstUserId;
            
            const friendName = friendNamesMap[friendId] || "Unknown";
            return friendName.toLowerCase().includes(query);
        });
    }, [friendships, searchQuery, profile?.id, friendNamesMap]);

    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friends..."
                    className="w-full"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {filteredFriendships.length === 0 ? (
                <div className="text-center">
                    <p>{searchQuery ? "No friends match your search." : "No friends found. Start adding some friends!"}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredFriendships.map((friend) => {
                        // Determine the friend's ID (not the current user's ID)
                        const friendId =
                            friend.firstUserId === profile?.id
                                ? friend.secondUserId
                                : friend.firstUserId;

                        return <FriendCard key={friend.id} friendId={friendId} friendshipId={friend.id} />;
                    })}
                </div>
            )}
        </>
    );
}