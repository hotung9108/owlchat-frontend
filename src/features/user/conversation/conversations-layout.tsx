import { useEffect, useState, useCallback, useDeferredValue, useMemo } from "react";
import ItemList from "../item-list";
import UserLayout from "../user-layout";
import LoadingLogo from "@/components/shared/loading-logo";
import ConversationItem from "./conversation-item";
import CreateGroupChatDialog from "./create-group-chat-dialog";
import ChatSearchInput from "./chat-search-input";
import { useChatUser } from "@/hooks/use-chat-user";
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { useWebSocket } from "@/providers/websocket-provider";
import { showBrowserNotification } from "@/utils/notification";

type Props = React.PropsWithChildren<{}>;

type Conversation = {
    id: string;
    imageUrl: string;
    username: string;
    isGroup?: boolean;
    newestMessageId?: string;
    memberNames?: string[];
};
export default function ConversationsLayout({ children }: Props) {
    const [conversations, setConversations] = useState<Conversation[] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const { getChatsByMemberId } = useChatUser();
    const { getChatMembersByChatId } = useChatMemberUser();
    const { fetchProfileById } = useUserProfile();
    const { profile } = useUserProfileContext();
    const { subscribeToTopic } = useWebSocket();

    // Memoized fetch function
    const fetchConversationsData = useCallback(async () => {
        try {
            const data = await getChatsByMemberId(null, null, "", -1, 10, false);
            
            // Batch fetch member names - limit concurrent requests
            const conversationsWithMembers = await Promise.all(
                data.map(async (chat: any) => {
                    let memberNames: string[] = [];
                    try {
                        const membersResp = await getChatMembersByChatId(null, null, chat.id);
                        const members = membersResp.content || membersResp;
                        
                        if (Array.isArray(members) && members.length > 0) {
                            // Limit concurrent profile fetches - use cached names first
                            const namePromises = members
                                .filter((m: any) => (m.memberId ?? m.userId ?? m.id) !== profile?.id)
                                .slice(0, 3) // Limit to first 3 members
                                .map(async (member: any) => {
                                    const memberId = member.memberId ?? member.userId ?? member.id;
                                    // Use memberName from cache first to avoid extra API call
                                    if (member.memberName) return member.memberName;
                                    try {
                                        const prof = await fetchProfileById(memberId);
                                        return prof?.name || "";
                                    } catch {
                                        return "";
                                    }
                                });
                            
                            const names = await Promise.all(namePromises);
                            memberNames = names.filter(name => name);
                        }
                    } catch (err) {
                        console.error("Error fetching members for chat:", err);
                    }

                    return {
                        id: chat.id,
                        imageUrl: chat.avatar || "",
                        username: chat.name,
                        isGroup: chat.type === "GROUP",
                        newestMessageId: chat.newestMessageId,
                        memberNames,
                    };
                })
            );
            
            setConversations(conversationsWithMembers);
        } catch (err) {
            console.error("Error fetching conversations:", err);
        }
    }, [getChatsByMemberId, getChatMembersByChatId, fetchProfileById, profile?.id]);

    useEffect(() => {
        fetchConversationsData();
    }, [fetchConversationsData]);

    // Listen for realtime message updates - Lazy load subscriptions
    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        const subscriptions: any[] = [];

        // Only subscribe to visible chats (after filtering)
        conversations.slice(0, 5).forEach((chat) => {
            const destination = `/topic/chat.${chat.id}`;
            const subscription = subscribeToTopic(destination, (notification: any) => {
                if (notification?.type === "MESSAGE" && notification?.action === "CREATED") {
                    setConversations((prev) => {
                        if (!prev) return prev;
                        const chatIndex = prev.findIndex((c) => c.id === chat.id);
                        if (chatIndex === -1) return prev;
                        
                        const updated = [...prev];
                        const [movedChat] = updated.splice(chatIndex, 1);
                        movedChat.newestMessageId = notification.data?.id;
                        updated.unshift(movedChat);
                        return updated;
                    });

                    // Trigger browser notification for messages from others
                    if (notification.data?.senderId !== profile?.id) {
                        showBrowserNotification(`New message from ${chat.username}`, {
                            body: notification.data?.content || "Sent an attachment",
                            icon: chat.imageUrl || "/favicon.ico",
                        });
                    }
                }
            });
            subscriptions.push(subscription);
        });

        return () => {
            subscriptions.forEach((sub) => {
                if (sub) sub.unsubscribe();
            });
        };
    }, [conversations, subscribeToTopic]);

    // Memoized search filtering with deferred value
    const filteredConversations = useMemo(() => {
        if (!conversations) return null;
        if (!deferredSearchQuery.trim()) return conversations;

        const query = deferredSearchQuery.toLowerCase();
        return conversations.filter((conv) => {
            if (conv.username.toLowerCase().includes(query)) return true;
            if (conv.memberNames?.some(name => name.toLowerCase().includes(query))) return true;
            return false;
        });
    }, [conversations, deferredSearchQuery]);

    return (
        <UserLayout>
            <ItemList 
                title="Conversations"
                action={<CreateGroupChatDialog onChatCreated={handleChatCreated} />}
            >
                <ChatSearchInput 
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
                {filteredConversations === null ? (
                    <LoadingLogo />
                ) : filteredConversations.length === 0 ? (
                    <p className="text-center text-gray-500 mt-4">
                        {searchQuery ? "No conversations found" : "Oh no, there are no conversations!"}
                    </p>
                ) : (
                    filteredConversations.map((c) => (
                        <ConversationItem
                            key={c.id}
                            id={c.id}
                            imageUrl={c.imageUrl}
                            username={c.username}
                            newestMessageId={c.newestMessageId}
                            currentUserId={profile?.id}
                            isGroup={c.isGroup}
                        />
                    ))
                )}
            </ItemList>
            {children}
        </UserLayout>
    );

    function handleChatCreated() {
        // Refresh conversations when a new group chat is created
        fetchConversationsData();
    }
}
