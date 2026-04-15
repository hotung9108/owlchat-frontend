import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    ScrollArea,
} from "@/components/ui/scroll-area";
import { useChatUser } from "@/hooks/use-chat-user";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { userProfileService } from "@/services/user-profile-service";
import friendshipService from "@/services/friendship-service";
import { Loader2, Plus } from "lucide-react";

type Props = {
    onChatCreated?: (chatId: string) => void;
};

interface FriendOption {
    userId: string;
    userName: string;
}

export default function CreateGroupChatDialog({ onChatCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [friendOptions, setFriendOptions] = useState<FriendOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { postChat } = useChatUser();
    const { profile } = useUserProfileContext();

    useEffect(() => {
        if (open) {
            loadFriends();
        }
    }, [open]);

    const loadFriends = async () => {
        setFriendsLoading(true);
        setError(null);
        try {
            // Get friendships for the current user
            const friendshipResponse = await friendshipService.getFriendships(
                profile?.id || null,
                profile?.id || null,
                0,
                100,
                true
            );

            // Handle both array and paginated response
            const friendshipData = Array.isArray(friendshipResponse)
                ? friendshipResponse
                : friendshipResponse?.content || [];

            if (!Array.isArray(friendshipData)) {
                throw new Error("Invalid friendship data structure");
            }

            // Extract friend IDs from friendships
            const friendsWithNames: FriendOption[] = [];

            for (const friendship of friendshipData) {
                // Get the friend ID (the one that's not the current user)
                const friendUserId = friendship.firstUserId === profile?.id
                    ? friendship.secondUserId
                    : friendship.firstUserId;

                try {
                    const friendProfile = await userProfileService.getProfileById(friendUserId);
                    friendsWithNames.push({
                        userId: friendUserId,
                        userName: friendProfile.name || friendUserId,
                    });
                } catch (err) {
                    // Fallback to ID if profile fetch fails
                    friendsWithNames.push({
                        userId: friendUserId,
                        userName: friendUserId,
                    });
                }
            }

            setFriendOptions(friendsWithNames);
        } catch (err: any) {
            setError("Failed to load friends");
            console.error("Error loading friends:", err);
            setFriendOptions([]);
        } finally {
            setFriendsLoading(false);
        }
    };

    const handleToggleFriend = (friendId: string) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleCreateGroupChat = async () => {
        if (!groupName.trim()) {
            setError("Please enter a group name");
            return;
        }

        if (selectedFriends.length < 2) {
            setError("Please select at least 2 friends");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Add current user to the members list
            const chatMembersId = [profile?.id, ...selectedFriends].filter(Boolean) as string[];

            const response = await postChat(
                profile?.id || null,
                profile?.id || null,
                {
                    name: groupName,
                    chatMembersId: chatMembersId,
                }
            );

            if (response && response.id) {
                setGroupName("");
                setSelectedFriends([]);
                setOpen(false);
                onChatCreated?.(response.id);
                // Optionally show a success toast
            }
        } catch (err: any) {
            setError(err.message || "Failed to create group chat");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                title="Create a new group chat"
            >
                <Plus className="size-4" />
            </Button>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Group Chat</DialogTitle>
                    <DialogDescription>
                        Create a new group chat with your friends. Select at least 2 friends to proceed.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Group Name Input */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="groupName"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Group Name
                        </label>
                        <Input
                            id="groupName"
                            placeholder="Enter group chat name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Friends Selection */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none">
                            Select Friends ({selectedFriends.length})
                        </label>

                        {friendsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="size-4 animate-spin" />
                            </div>
                        ) : friendOptions.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No friends to add
                            </p>
                        ) : (
                            <ScrollArea className="border rounded-md p-3 h-64">
                                <div className="space-y-2">
                                    {friendOptions.map((friend) => (
                                        <div
                                            key={friend.userId}
                                            className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                                            onClick={() =>
                                                handleToggleFriend(friend.userId)
                                            }
                                        >
                                            <Checkbox
                                                checked={selectedFriends.includes(
                                                    friend.userId
                                                )}
                                                onCheckedChange={() =>
                                                    handleToggleFriend(friend.userId)
                                                }
                                            />
                                            <span className="text-sm">
                                                {friend.userName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateGroupChat}
                        disabled={loading || selectedFriends.length < 2 || !groupName.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Group"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
