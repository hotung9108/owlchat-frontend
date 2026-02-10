import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon } from "lucide-react";
// import { useFriendship } from "../../user-profile/use-friendship";
import { useFriendship } from "@/hooks/use-friendship";
import LoadingLogo from "@/components/shared/loading-logo";
import ErrorLogo from "@/components/shared/error-logo";

type Props = {};

export default function FriendListFriendPage(props: Props) {
    const { friendships, loading, error, fetchFriendships } = useFriendship();
    useEffect(() => {
        fetchFriendships();
    }, [fetchFriendships]);
    // useEffect(() => {
    //     console.log(friendships);
    // }, [friendships]);
    if (loading) return <LoadingLogo />;
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
                    {friendships.map((friend) => (
                        <Card
                            key={friend.id}
                            className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                    <AudioWaveformIcon />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold">
                                        {friend.secondUserId}
                                    </h3>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <Button className="px-4 py-2">
                                        Message
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
