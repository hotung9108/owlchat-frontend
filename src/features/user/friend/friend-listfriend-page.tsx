import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import LoadingLogo from "@/components/shared/loading-logo";
import ErrorLogo from "@/components/shared/error-logo";
import { useFriendship } from "@/hooks/use-friendship";
import { useUserProfile } from "@/hooks/use-user-profile";
// import FriendCard from "./FriendCard";
import FriendCard from "./friend-listfriend-card";

export default function FriendListFriendPage() {
    const {
        profile,
        fetchUserProfile,
        loading: userLoading,
    } = useUserProfile();
    const { friendships, loading, error, fetchFriendships } = useFriendship();

    useEffect(() => {
        fetchFriendships();
        fetchUserProfile(); // Fetch user profile to get the current user's ID
    }, []);
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

                        return <FriendCard key={friend.id} friendId={friendId} />;
                    })}
                </div>
            )}
        </>
    );
}