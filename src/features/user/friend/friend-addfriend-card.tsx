import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";

type FriendRequestCardProps = {
    friendId: string;
    requestId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED"; // Thêm trạng thái
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
};

export default function FriendRequestCard({
    friendId,
    requestId,
    status,
    onAccept,
    onDecline,
}: FriendRequestCardProps) {
    const { profile, fetchProfileById, loading, error } = useUserProfile();
    
    useEffect(() => {
        fetchProfileById(friendId); // Fetch profile của bạn bè
    }, [friendId, fetchProfileById]);
    useEffect(() => {
        console.log(friendId);
    })
    if (loading) {
        return <p className="text-muted text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-destructive text-center">Error loading friend profile</p>;
    }

    return (
        <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50 bg-card text-card-foreground">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {profile?.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={`${profile?.name}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User className="w-10 h-10" />
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div>
                    <h3 className="text-lg font-bold text-primary">
                        {profile?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {profile?.email || "No email"}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                    {profile?.name || "This user"} wants to be your friend!
                </p>
                </div>
            </div>

            {/* Message */}
            
            {/* Actions */}
            <div className="mt-6 flex justify-between items-center">
                {status === "PENDING" && (
                    <div className="flex gap-2">
                        <Button
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary-foreground hover:text-primary"
                            onClick={() => onAccept(requestId)}
                        >
                            Accept
                        </Button>
                        <Button
                            className="px-4 py-2 bg-destructive text-white rounded-lg shadow-md hover:bg-red-600"
                            onClick={() => onDecline(requestId)}
                        >
                            Decline
                        </Button>
                    </div>
                )}
                {status === "ACCEPTED" && (
                    <div className="flex gap-2">
                        <Button
                            className="px-4 py-2 bg-destructive text-white rounded-lg shadow-md hover:bg-red-600"
                            onClick={() => onDecline(requestId)}
                        >
                            Decline
                        </Button>
                    </div>
                )}
                {status === "REJECTED" && (
                    <div className="flex gap-2">
                        <Button
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary-foreground hover:text-primary"
                            onClick={() => onAccept(friendId)}
                        >
                            Accept
                        </Button>
                    </div>
                )}
                <div>
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                        ...
                    </Button>
                </div>
            </div>
        </Card>
    );
}