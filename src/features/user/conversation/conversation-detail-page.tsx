import { useParams } from "react-router-dom";
import ConversationContainer from "./conversation-container";
import ConversationsLayout from "./conversations-layout";
import ChatHeader from "../chat/components/chat-header";
import ChatBody from "../chat/components/chat-body";
import ChatInput from "../chat/components/chat-input";
import { useEffect, useRef, useState, useCallback } from "react";
import { useMessageUser } from "@/hooks/use-chat-message-user";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useChatUser } from "@/hooks/use-chat-user";
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import type { MessageType } from "@/types/enum/mesage-type";

export default function ConversationDetailPage() {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(0); 
    const [hasMore, setHasMore] = useState(true);
    const [chatMetadata, setChatMetadata] = useState<{
        name: string;
        avatar?: string;
        isOnline?: boolean;
    }>({ name: "Loading..." });

    const { conversationId } = useParams();
    const {
        messages,
        loading,
        getMessagesByChatId,
        postNewTextMessage,
        postNewFileMessage,
    } = useMessageUser();
    
    const { profile, fetchUserProfile } = useUserProfile();
    const { getChatByChatId } = useChatUser();
    const { getChatMembersByChatId } = useChatMemberUser();

    // 1. Fetch current user profile
    useEffect(() => {
        fetchUserProfile(null);
    }, [fetchUserProfile]);

    // 2. Fetch Chat Metadata & Identify Other User if Private
    useEffect(() => {
        if (!conversationId) return;

        const initChatContext = async () => {
            try {
                const chat = await getChatByChatId(null, null, conversationId);
                
                if (chat.type === "PRIVATE") {
                    const membersResp = await getChatMembersByChatId(null, null, conversationId);
                    const members = membersResp.content || membersResp; // Handle potential page object
                    
                    if (Array.isArray(members)) {
                        // Find the member who is NOT me
                        const otherMember = members.find(m => {
                            const mId = m.memberId ?? m.userId ?? m.id;
                            return mId && mId !== profile?.id;
                        });
                        
                        if (otherMember) {
                            setChatMetadata({
                                name: otherMember.nickname || otherMember.memberName || chat.name,
                                avatar: otherMember.memberAvatar || chat.avatar,
                                isOnline: true, 
                            });
                            return;
                        }
                    }
                }
                
                // Fallback to chat defaults (Group chat uses chat name)
                setChatMetadata({
                    name: chat.name,
                    avatar: chat.avatar,
                    isOnline: chat.status,
                });
            } catch (err) {
                console.error("Failed to fetch chat context:", err);
                setChatMetadata({ name: "Chat" });
            }
        };

        if (profile?.id) {
            initChatContext();
        }
    }, [conversationId, profile?.id, getChatByChatId, getChatMembersByChatId]);

    // 3. Pagination & Initial Messages
    const fetchMessages = useCallback(async (targetPage: number) => {
        if (!conversationId) return;
        try {
            const size = 20;
            const data = await getMessagesByChatId(
                null,
                null,
                conversationId,
                "",
                targetPage,
                size,
            );
            if (data && data.length < size) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [conversationId, getMessagesByChatId]);

    // Reset pagination on chat change
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        fetchMessages(0);
    }, [conversationId, fetchMessages]);

    // Trigger pagination from scroll
    const handleScroll = async (isNearTop: boolean) => {
        if (isNearTop && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(nextPage);
        }
    };

    const handleSendMessage = async (message: string) => {
        try {
            await postNewTextMessage(null, null, {
                chatId: conversationId!,
                content: message,
            });
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    const handleSendFile = async (file: File, type: MessageType) => {
        try {
            await postNewFileMessage(null, null, conversationId!, type, file);
        } catch (err) {
            console.error("Failed to send file:", err);
        }
    };

    return (
        <ConversationsLayout>
            <ConversationContainer>
                <ChatHeader
                    imageUrl={chatMetadata.avatar}
                    name={chatMetadata.name}
                    isOnline={chatMetadata.isOnline}
                />
                <ChatBody
                    key={conversationId}
                    ref={chatBodyRef}
                    messages={messages}
                    currentUserId={profile?.id}
                    onScroll={handleScroll}
                    isLoadingMore={loading && page > 0}
                    otherUserName={chatMetadata.name}
                    otherUserImage={chatMetadata.avatar}
                />
                <ChatInput
                    onSendMessage={handleSendMessage}
                    onSendFile={handleSendFile}
                />
            </ConversationContainer>
        </ConversationsLayout>
    );
}
