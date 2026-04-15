import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useUserProfileContext } from "@/providers/user-profile-provider";

type SentRequestCardProps = {
    receiverId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdDate: string;
};

export default function SentRequestCard({
    receiverId,
    status,
    createdDate,
}: SentRequestCardProps) {
    const { fetchProfileById } = useUserProfileContext();
    const [profile, setProfile] = useState<any | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        setLoading(true);
        fetchProfileById(receiverId)
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile");
                setLoading(false);
            });
    }, [receiverId, fetchProfileById]);

    useEffect(() => {
        if (profile?.avatar) {
            import("@/services/user-profile-service").then(({ userProfileService }) => {
                userProfileService.getUserAvatar(receiverId)
                    .then(blob => {
                        if (blob && blob.size > 0) {
                            setAvatarUrl(URL.createObjectURL(blob));
                        }
                    })
                    .catch(err => console.error("Error fetching avatar:", err));
            });
        }
    }, [profile?.avatar, receiverId]);

    useEffect(() => {
        return () => {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl);
        };
    }, [avatarUrl]);

    if (loading) {
        return (
            <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50 bg-card text-card-foreground">
                <p className="text-muted text-center">Loading...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50 bg-card text-card-foreground">
                <p className="text-destructive text-center">Error loading profile</p>
            </Card>
        );
    }

    return (
        <Card className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50 bg-card text-card-foreground">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={`${profile?.name || 'User'}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User className="w-6 h-6" />
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary truncate">
                        {profile?.name || receiverId}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {profile?.email || "No email"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                            Sent: {new Date(createdDate).toLocaleDateString()}
                        </p>
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${
                                status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                                    : status === "ACCEPTED"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                    : "bg-red-500/20 text-red-700 dark:text-red-300"
                            }`}
                        >
                            {status}
                        </span>
                    </div>
                    {status !== "PENDING" && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {status === "ACCEPTED"
                                ? "Request accepted"
                                : "Request rejected"}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
