import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon } from "lucide-react";
import type {
    FriendRequest,
    FriendRequestResponseRequest,
} from "@/types/friend.type";
import { useEffect, useState } from "react";
import { useFriend } from "@/hooks/use-friend";
import type { FriendRequestStatus } from "@/types/enum/friend-request-status";
import ErrorLogo from "@/components/shared/error-logo";
import LoadingLogo from "@/components/shared/loading-logo";

type Props = {};

export default function FriendAddFriendPage(props: Props) {
    const {
        getReceiveFriendRequests,
        patchFriendRequestStatus,
        loading,
        error,
    } = useFriend();
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const requests = await getReceiveFriendRequests();
                setFriendRequests(requests);
            } catch (err) {
                console.error("Error fetching friend requests:", err);
            }
        };
        fetchFriendRequests();
    }, [getReceiveFriendRequests]);
    const handleAcceptFriendRequest = async (id: string) => {
        try {
            const request: FriendRequestResponseRequest = {
                response: "ACCEPTED" as FriendRequestStatus,
            };
            await patchFriendRequestStatus(null, null, id, request);
            setFriendRequests((prevRequests) =>
                prevRequests.filter((request) => request.id !== id),
            );
            console.log(`Accepted friend request with ID: ${id}`);
        } catch (err) {
            console.error("Error accepting friend request:", err);
        }
    };
    const handleDeclineFriendRequest = async (id: string) => {
        try {
            const request: FriendRequestResponseRequest = {
                response: "DECLINED" as FriendRequestStatus,
            };
            await patchFriendRequestStatus(null, null, id, request);
            setFriendRequests((prevRequests) =>
                prevRequests.filter((request) => request.id !== id),
            );
            console.log(`Declined friend request with ID: ${id}`);
        } catch (err) {
            console.error("Error declining friend request:", err);
        }
    };
    const filteredRequests = friendRequests.filter((request) =>
        request.senderId.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (loading) return <LoadingLogo />;
    if (error) return <ErrorLogo errorMessage={`Error: ${error}`} />;

    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friend requests..."
                    className="w-full"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {filteredRequests.length === 0 ? (
                <div className="text-center">
                    <p>No friend requests found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredRequests.map((request) => (
                        <Card
                            key={request.id}
                            className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                    <AudioWaveformIcon />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold">
                                        {request.senderId}
                                    </h3>
                                    <p className="text-sm">
                                        {request.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <Button
                                        className="px-4 py-2"
                                        onClick={() =>
                                            handleAcceptFriendRequest(
                                                request.id,
                                            )
                                        }
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        className="px-4 py-2"
                                        onClick={() =>
                                            handleDeclineFriendRequest(
                                                request.id,
                                            )
                                        }
                                    >
                                        Decline
                                    </Button>
                                </div>
                                <div>
                                    <Button variant="ghost" className="p-2">
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
