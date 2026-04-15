import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Trash2 } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useFriendship } from "@/hooks/use-friendship";

type FriendCardProps = {
    friendId: string;
    friendshipId?: string;
};

export default function FriendCard({ friendId, friendshipId }: FriendCardProps) {
    const { fetchProfileById, fetchAvatar, loading, error } = useUserProfile();
    const { deleteFriendship, fetchFriendshipWithUser } = useFriendship();
    const [friendProfile, setFriendProfile] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isUnfriending, setIsUnfriending] = useState(false);

    useEffect(() => {
        const loadFriendProfile = async () => {
            const data = await fetchProfileById(friendId);
            if (data) {
                setFriendProfile(data);
            }
        };
        loadFriendProfile();
    }, [friendId, fetchProfileById]);

    useEffect(() => {
        if (friendProfile?.avatar) {
            fetchAvatar(friendId)
                .then(blob => {
                    if (blob && blob.size > 0) {
                        setAvatarUrl(URL.createObjectURL(blob));
                    }
                })
                .catch(err => console.error("Error fetching avatar:", err));
        }
    }, [friendProfile?.avatar, friendId, fetchAvatar]);

    useEffect(() => {
        return () => {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
        };
    }, [avatarUrl]);

    const handleUnfriend = async () => {
        try {
            setIsUnfriending(true);
            
            // If we don't have the friendship ID, fetch it
            let fshipId = friendshipId;
            if (!fshipId) {
                const friendship = await fetchFriendshipWithUser(friendId);
                fshipId = friendship?.id;
            }
            
            if (fshipId) {
                await deleteFriendship(fshipId);
            }
            setIsUnfriending(false);
        } catch (err) {
            console.error("Error unfriending:", err);
            setIsUnfriending(false);
        }
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading friend profile</p>;

    return (
        <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-muted">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={`${friendProfile?.name || 'Friend'}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User className="w-10 h-10" />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-bold text-primary">
                        {friendProfile?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{friendProfile?.email || "No email"}</p>
                    <p className="text-sm text-muted-foreground">
                        {friendProfile?.gender === true
                            ? "Male"
                            : friendProfile?.gender === false
                              ? "Female"
                              : "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {friendProfile?.phoneNumber || "No phone number"}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center gap-2">
                <div className="flex gap-2">
                    <Button className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Profile</Button>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleUnfriend}
                    disabled={isUnfriending}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}
