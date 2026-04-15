import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFriend } from "@/hooks/use-friend";
import type { FriendRequest } from "@/types/friend.type";
import type { FriendRequestStatus } from "@/types/enum/friend-request-status";
import ErrorLogo from "@/components/shared/error-logo";
import LoadingLogo from "@/components/shared/loading-logo";
import FriendRequestCard from "./friend-addfriend-card";
import SentRequestCard from "./friend-sentrequest-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FriendAddFriendPage() {
    const {
        getReceiveFriendRequests,
        getSendFriendRequests,
        patchFriendRequestStatus,
        loading,
        error,
    } = useFriend();
    const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("received");

    useEffect(() => {
        const fetchAllRequests = async () => {
            try {
                // Fetch received requests (all statuses)
                const received = await getReceiveFriendRequests(
                    null,
                    null,
                    0, 
                    100,
                    true,
                    undefined,
                    undefined  // No status filter - get all
                );
                setReceivedRequests(received);

                // Fetch sent requests (all statuses)
                const sent = await getSendFriendRequests(
                    null,
                    null,
                    0, 
                    100,
                    true,
                    undefined,
                    undefined  // No status filter - get all
                );
                setSentRequests(sent);
            } catch (err) {
                console.error("Error fetching friend requests:", err);
            }
        };
        fetchAllRequests();
    }, [getReceiveFriendRequests, getSendFriendRequests]);

    const handleAcceptFriendRequest = async (id: string) => {
        try {
            const request = { response: "ACCEPTED" as FriendRequestStatus };
            await patchFriendRequestStatus(null, null, id, request);
            setReceivedRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === id ? { ...req, status: "ACCEPTED" as FriendRequestStatus } : req
                ),
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
            setReceivedRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.id === id ? { ...req, status: "REJECTED" as FriendRequestStatus } : req
                ),
            );
            console.log(`Declined friend request with ID: ${id}`);
        } catch (err) {
            console.error("Error declining friend request:", err);
        }
    };

    const filteredReceivedRequests = receivedRequests.filter((request) =>
        request.senderId.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const filteredSentRequests = sentRequests.filter((request) =>
        request.receiverId.toLowerCase().includes(searchTerm.toLowerCase()),
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="received">
                        Received ({filteredReceivedRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="sent">
                        Sent ({filteredSentRequests.length})
                    </TabsTrigger>
                </TabsList>

                {/* Received Requests Tab */}
                <div className="mt-6">
                    {activeTab === "received" && (
                        <>
                            {filteredReceivedRequests.length === 0 ? (
                                <div className="text-center">
                                    <p>No received friend requests.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredReceivedRequests.map((request) => (
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
                    )}

                    {/* Sent Requests Tab */}
                    {activeTab === "sent" && (
                        <>
                            {filteredSentRequests.length === 0 ? (
                                <div className="text-center">
                                    <p>No sent friend requests.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredSentRequests.map((request) => (
                                        <SentRequestCard
                                            key={request.id}
                                            receiverId={request.receiverId}
                                            status={request.status}
                                            createdDate={request.createdDate}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Tabs>
        </>
    );
}