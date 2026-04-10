import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";

type FriendCardProps = {
    friendId: string;
};

export default function FriendCard({ friendId }: FriendCardProps) {
    const { profile, fetchProfileById, fetchAvatar, loading, error } = useUserProfile();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchProfileById(friendId);
    }, [friendId, fetchProfileById]);

    useEffect(() => {
        if (profile?.avatar) {
            fetchAvatar(friendId)
                .then(blob => {
                    if (blob && blob.size > 0) {
                        setAvatarUrl(URL.createObjectURL(blob));
                    }
                })
                .catch(err => console.error("Error fetching avatar:", err));
        }
    }, [profile?.avatar, friendId, fetchAvatar]);

    useEffect(() => {
        return () => {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
        };
    }, [avatarUrl]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading friend profile</p>;

    return (
        <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-muted">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={`${profile?.name || 'Friend'}'s profile`}
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
                        {profile?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{profile?.email || "No email"}</p>
                    <p className="text-sm text-muted-foreground">
                        {profile?.gender === true
                            ? "Male"
                            : profile?.gender === false
                              ? "Female"
                              : "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {profile?.phoneNumber || "No phone number"}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center ">
                <div className="flex gap-2">
                    <Button className="px-4 py-2  bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary">Message</Button>
                    <Button className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Profile</Button>
                </div>
                <div>
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                        ...
                    </Button>
                </div>
            </div>
        </Card>
    );
}
