import { useEffect, useState } from "react";
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
    const [conversations, setConversations] = useState<Conversation[] | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredConversations, setFilteredConversations] = useState<Conversation[] | null>(null);
    const { getChatsByMemberId } = useChatUser();
    const { getChatMembersByChatId } = useChatMemberUser();
    const { fetchProfileById } = useUserProfile();
    const { profile } = useUserProfileContext();
    const { subscribeToTopic } = useWebSocket();

    const fetchConversationsData = async () => {
        try {
            const data = await getChatsByMemberId(
                null,
                null,
                "",
                0,
                10,
                false,
            );
            
            // Fetch member names for each conversation
            const conversationsWithMembers = await Promise.all(
                data.map(async (chat: any) => {
                    let memberNames: string[] = [];
                    try {
                        const membersResp = await getChatMembersByChatId(null, null, chat.id);
                        const members = membersResp.content || membersResp;
                        
                        if (Array.isArray(members)) {
                            memberNames = await Promise.all(
                                members.map(async (member: any) => {
                                    const memberId = member.memberId ?? member.userId ?? member.id;
                                    if (memberId && memberId !== profile?.id) {
                                        try {
                                            const profile = await fetchProfileById(memberId);
                                            return profile?.name || member.memberName || "";
                                        } catch {
                                            return member.memberName || "";
                                        }
                                    }
                                    return "";
                                })
                            );
                            memberNames = memberNames.filter(name => name);
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
    };

    useEffect(() => {
        fetchConversationsData();
    }, [getChatsByMemberId, getChatMembersByChatId, fetchProfileById, profile?.id]);

    // Listen for realtime message updates and move conversation to top
    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        const subscriptions: any[] = [];

        // Subscribe to each conversation's topic to listen for new messages
        conversations.forEach((chat) => {
            const destination = `/topic/chat.${chat.id}`;
            const subscription = subscribeToTopic(destination, (notification: any) => {
                console.log(`[Sidebar] Message notification for chat ${chat.id}:`, notification);
                
                // When a message is created in any chat, move that conversation to top
                if (notification?.type === "MESSAGE" && notification?.action === "CREATED") {
                    setConversations((prev) => {
                        if (!prev) return prev;
                        
                        // Find the chat that received the message
                        const chatIndex = prev.findIndex((c) => c.id === chat.id);
                        if (chatIndex === -1) return prev;
                        
                        // Move conversation to top (index 0)
                        const updated = [...prev];
                        const [movedChat] = updated.splice(chatIndex, 1);
                        movedChat.newestMessageId = notification.data?.id;
                        updated.unshift(movedChat);
                        
                        console.log(`[Sidebar] ✓ Moved chat ${chat.id} to top`);
                        return updated;
                    });
                }
            });
            
            subscriptions.push(subscription);
        });

        // Cleanup subscriptions when component unmounts or conversations change
        return () => {
            subscriptions.forEach((sub) => {
                if (sub) sub.unsubscribe();
            });
        };
    }, [conversations, subscribeToTopic]);

    // Filter conversations based on search query
    useEffect(() => {
        if (!conversations) {
            setFilteredConversations(null);
            return;
        }

        if (!searchQuery.trim()) {
            setFilteredConversations(conversations);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = conversations.filter((conv) => {
            // Search in chat name
            if (conv.username.toLowerCase().includes(query)) {
                return true;
            }
            
            // Search in member names
            if (conv.memberNames?.some(name => name.toLowerCase().includes(query))) {
                return true;
            }
            
            return false;
        });

        setFilteredConversations(filtered);
    }, [searchQuery, conversations]);

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
