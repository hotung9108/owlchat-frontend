import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon, User } from "lucide-react";
import { useFriend } from "@/hooks/use-friend";
import { useUserProfile } from "@/hooks/use-user-profile";
import { use, useEffect, useState } from "react";
import ErrorLogo from "@/components/shared/error-logo";
import LoadingLogo from "@/components/shared/loading-logo";

type Props = {};

export default function FriendDiscoveryFriendPage(props: Props) {
    const {
        profiles,
        profile,
        fetchProfiles,
        fetchUserProfile,
        fetchProfileById,
        loading: profilesLoading,
        error: profilesError,
    } = useUserProfile();
    const {
        postFriendRequest,
        loading: friendLoading,
        error: friendError,
    } = useFriend();

    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
        fetchUserProfile();
    }, []);
    useEffect(() => {
        console.log(profiles);
    });
    // handle add friend
    const handleAddFriend = async (userId: string) => {
        try {
            await postFriendRequest(null, null, { receiverId: userId });
            setErrorMessage("Failed to send friend request.");
        } catch (error) {
            setErrorMessage("Failed to send friend request.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };
    const filteredProfiles = profiles.filter(
        (p) =>
            p.id !== profile?.id &&
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    // if (profilesLoading || friendLoading) {
    //     return <LoadingLogo />;
    // }

    // if (profilesError || friendError) {
    //     return (
    //         <ErrorLogo
    //             errorMessage={
    //                 profilesError || friendError || "An error occurred."
    //             }
    //         />
    //     );
    // }
    // if (errorMessage) {
    //     return <ErrorLogo errorMessage={errorMessage} />;
    // }
    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friends..."
                    className="w-full"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {profilesLoading || friendLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredProfiles.map((profile) => (
                        <Card
                            key={profile.id}
                            className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-full h-full rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <User className="w-10 h-10" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-primary">
                                        {profile.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.phoneNumber ||
                                            "No phone number"}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <Button
                                        className="px-4 py-2"
                                        onClick={() =>
                                            handleAddFriend(profile.id)
                                        }
                                    >
                                        Add Friend
                                    </Button>
                                    <Button className="px-4 py-2">
                                        Profile
                                    </Button>
                                </div>
                                <div>
                                    <Button variant="ghost" className="">
                                        ...
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
