import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import LoadingLogo from "@/components/shared/loading-logo";
import ErrorLogo from "@/components/shared/error-logo";
import { useFriendship } from "@/hooks/use-friendship";
import { useUserProfileContext } from "@/providers/user-profile-provider";
// import FriendCard from "./FriendCard";
import FriendCard from "./friend-listfriend-card";

export default function FriendListFriendPage() {
    const {
        profile,
        loading: userLoading,
    } = useUserProfileContext();
    const { friendships, loading, error, fetchFriendships } = useFriendship();

    useEffect(() => {
        fetchFriendships();
    }, [fetchFriendships]);
    // useEffect(()=>{
    //     console.log(profile)
    // })
    if (loading || userLoading) return <LoadingLogo />;
    if (error) return <ErrorLogo errorMessage={`Error: ${error}`} />;

    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friends..."
                    className="w-full"
                    type="text"
                />
            </div>
            {friendships.length === 0 ? (
                <div className="text-center">
                    <p>No friends found. Start adding some friends!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {friendships.map((friend) => {
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