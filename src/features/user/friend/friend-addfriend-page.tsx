import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFriend } from "@/hooks/use-friend";
import type { FriendRequest } from "@/types/friend.type";
import type { FriendRequestStatus } from "@/types/enum/friend-request-status";
import ErrorLogo from "@/components/shared/error-logo";
import LoadingLogo from "@/components/shared/loading-logo";
import FriendRequestCard from "./friend-addfriend-card";

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
                const requests = await getReceiveFriendRequests(
                    null,
                    null,
                    0, 
                    10,
                    true,
                    undefined,
                    "PENDING"
                );
                setFriendRequests(requests);
            } catch (err) {
                console.error("Error fetching friend requests:", err);
            }
        };
        fetchFriendRequests();
    }, []);

    const handleAcceptFriendRequest = async (id: string) => {
        try {
            const request = { response: "ACCEPTED" as FriendRequestStatus };
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
            const request = { response: "REJECTED" as FriendRequestStatus };
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
                        <FriendRequestCard
                            key={request.id}
                            requestId={request.id}
                            friendId={request.senderId}
                            status={request.status}
                            onAccept={handleAcceptFriendRequest}
                            onDecline={handleDeclineFriendRequest}
                        />
                    ))}
                </div>
            )}
        </>
    );
}