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

    // Auto-refresh conversations every 3 seconds to catch new messages
    useEffect(() => {
        const interval = setInterval(() => {
            fetchConversationsData();
        }, 3000);

        return () => clearInterval(interval);
    }, [getChatsByMemberId, getChatMembersByChatId, fetchProfileById, profile?.id]);

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
