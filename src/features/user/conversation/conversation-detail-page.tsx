import { useParams } from "react-router-dom";
import LoadingLogo from "@/components/shared/loading-logo";
import ConversationContainer from "./conversation-container";
import ConversationsLayout from "./conversations-layout";
import ChatHeader from "../chat/components/chat-header";
import ChatBody from "../chat/components/chat-body";
import ChatInput from "../chat/components/chat-input";
import { useEffect, useRef, useState } from "react";
import { useMessageUser } from "@/hooks/use-chat-message-user";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function ConversationDetailPage() {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(0); // Quản lý số trang hiện tại
    const [hasMore, setHasMore] = useState(true);
    const { conversationId } = useParams();
    const {
        messages,
        loading,
        error,
        getMessagesByChatId,
        postNewTextMessage,
    } = useMessageUser();
    const {
        profile,
        fetchUserProfile,
        loading: profileLoading,
    } = useUserProfile();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await fetchUserProfile(null);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchProfile();
    }, [fetchUserProfile]);

    useEffect(() => {
        if (conversationId) {
            const fetchMessages = async () => {
                try {
                    const newMessages = await getMessagesByChatId(
                        null,
                        null,
                        conversationId,
                        "",
                        page,
                        15,
                    );
                    if (newMessages.length < 15) {
                        setHasMore(false); 
                    }
                    
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };

            fetchMessages();
        }
    }, [conversationId, getMessagesByChatId, page]);
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
    // if (loading) {
    //     return (
    //         <div className="w-full h-full flex items-center justify-center">
    //             <LoadingLogo />
    //         </div>
    //     );
    // }
    const handleScroll = async (isAtTop: boolean) => {
        if (isAtTop && hasMore && !loading) {
            console.log("Loading more messages...");
            setPage((prevPage) => {
                console.log("Current page:", prevPage);
                return prevPage + 1;
            });
        }
    };
    return (
        <ConversationsLayout>
            {messages.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p>No messages found</p>
                </div>
            ) : (
                <ConversationContainer>
                    <ChatHeader
                        imageUrl="/images/default-avatar.jpg"
                        name={profile?.name || `Conversation ${conversationId}`}
                    />
                    <ChatBody
                        ref={chatBodyRef}
                        messages={messages}
                        currentUserId={profile?.id}
                        onScroll={handleScroll} // Truyền hàm xử lý sự kiện cuộn
                    />
                    <ChatInput onSendMessage={handleSendMessage} />
                </ConversationContainer>
            )}
        </ConversationsLayout>
    );
}
