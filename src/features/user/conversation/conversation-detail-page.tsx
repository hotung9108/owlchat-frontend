import { useParams } from "react-router-dom";
import ConversationContainer from "./conversation-container";
import ConversationsLayout from "./conversations-layout";
import ChatHeader from "../chat/components/chat-header";
import ChatBody from "../chat/components/chat-body";
import ChatInput from "../chat/components/chat-input";
import ChatInfoSidebar from "../chat/components/chat-info-sidebar";
import { useEffect, useRef, useState, useCallback } from "react";
import { useMessageUser } from "@/hooks/use-chat-message-user";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { useChatUser } from "@/hooks/use-chat-user";
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import { useWebSocket } from "@/providers/websocket-provider";
import type { MessageType } from "@/types/enum/mesage-type";
import { websocketMessageService } from "@/services/websocket-message-service";

export default function ConversationDetailPage() {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(0); 
    const [hasMore, setHasMore] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [chatMetadata, setChatMetadata] = useState<{
        name: string;
        avatar?: string;
        isOnline?: boolean;
    }>({ name: "Loading..." });

    const { conversationId } = useParams();
    const {
        messages,
        setMessages,
        loading,
        getMessagesByChatId,
        // postNewTextMessage,
        postNewFileMessage,
        putTextMessage,
        softDeleteMessage,
    } = useMessageUser();
    
    const { subscribeToTopic, sendMessage } = useWebSocket();
    
    const { profile } = useUserProfileContext();
    const { fetchProfileById } = useUserProfile();
    const { getChatByChatId } = useChatUser();
    const { getChatMembersByChatId } = useChatMemberUser();
    const [chatType, setChatType] = useState("")

    // Profile is already loaded by UserProfileProvider, no need to fetch here

    // 2. Fetch Chat Metadata & Identify Other User if Private
    useEffect(() => {
        if (!conversationId) return;

        const initChatContext = async () => {
            try {
                const chat = await getChatByChatId(null, null, conversationId);
                console.log("[Chat] Chat metadata:", { id: chat?.id, type: chat?.type, name: chat?.name });
                setChatType(chat.type)
                if (chat.type === "PRIVATE") {
                    try {
                        const membersResp = await getChatMembersByChatId(null, null, conversationId);
                        console.log("[Chat] Members response:", membersResp);
                        
                        // Safely extract members array
                        let members: any[] = [];
                        if (Array.isArray(membersResp)) {
                            members = membersResp;
                        } else if (membersResp?.content && Array.isArray(membersResp.content)) {
                            members = membersResp.content;
                        }
                        
                        console.log("[Chat] Parsed members:", members);
                        
                        if (Array.isArray(members) && members.length > 0) {
                            // Find the member who is NOT me
                            const otherMember = members.find(m => {
                                const mId = m.memberId ?? m.userId ?? m.id;
                                console.log(`[Chat] Checking member mId=${mId} vs profile=${profile?.id}`);
                                return mId && mId !== profile?.id;
                            });
                            
                            console.log("[Chat] Other member found:", otherMember);
                            
                            if (otherMember) {
                                const otherUserId = otherMember.memberId || otherMember.userId || otherMember.id;
                                console.log("[Chat] Fetching profile for userId:", otherUserId);
                                
                                // Fetch the actual profile of the other user
                                const otherUserProfile = await fetchProfileById(otherUserId);
                                console.log("[Chat] Fetched profile:", otherUserProfile);
                                
                                if (otherUserProfile?.name) {
                                    setChatMetadata({
                                        name: otherUserProfile.name,
                                        avatar: otherUserProfile.avatar || chat.avatar,
                                        isOnline: true, 
                                    });
                                    console.log("[Chat] ✓ Set profile name:", otherUserProfile.name);
                                    return;
                                }
                            }
                        }
                        
                        console.warn("[Chat] ⚠️ Could not fetch PRIVATE chat member profile");
                    } catch (memberErr) {
                        console.error("[Chat] ❌ Error fetching members:", memberErr);
                    }
                }
                
                // Fallback to chat defaults (Group chat uses chat name)
                setChatMetadata({
                    name: chat.name || "Chat",
                    avatar: chat.avatar,
                    isOnline: chat.status,
                });
                console.log("[Chat] Set fallback name:", chat.name || "Chat");
            } catch (err) {
                console.error("[Chat] ❌ Failed to fetch chat context:", err);
                setChatMetadata({ name: "Chat" });
            }
        };

        if (profile?.id) {
            initChatContext();
        }
    }, [conversationId, profile?.id, getChatByChatId, getChatMembersByChatId, fetchProfileById]);

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

    // Subscribe to WebSocket for real-time messages - Setup once per conversation
    // Optimized: Add messages directly to UI instead of reloading page 0
    useEffect(() => {
        if (!conversationId) return;
        
        let subscription: any = null;
        let retryCount = 0;
        const maxRetries = 5;
        
        const setupSubscription = () => {
            const destination = `/topic/chat.${conversationId}`;
            subscription = subscribeToTopic(destination, (notification: any) => {
                console.log("[WebSocket] Message notification received:", notification);
                
                // Handle different notification types
                if (notification?.type === "MESSAGE" && notification?.action === "CREATED") {
                    // NEW MESSAGE - Replace optimistic message or add if new
                    const transformedMessage = websocketMessageService.transformWebSocketMessage(
                        notification.data
                    );
                    
                    setMessages((prev) => {
                        // Check if optimistic message already exists (with same content/sender)
                        const optimisticIndex = prev.findIndex(
                            (msg) => msg.type === "TEXT" && 
                                   msg.content === transformedMessage.content &&
                                   msg.senderId === transformedMessage.senderId &&
                                   msg.id.startsWith("temp-")
                        );
                        
                        if (optimisticIndex !== -1) {
                            // Replace optimistic message with real one
                            const updated = [...prev];
                            updated[optimisticIndex] = transformedMessage;
                            console.log("[WebSocket] ✓ Optimistic message replaced with real ID");
                            return updated;
                        } else {
                            // New message from another user or refresh - add it
                            console.log("[WebSocket] ✓ New message added to UI");
                            return [transformedMessage, ...prev];
                        }
                    });
                } else if (notification?.type === "MESSAGE" && notification?.action === "UPDATED") {
                    // EDITED MESSAGE - Update in place
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === notification.data.id
                                ? websocketMessageService.transformWebSocketMessage(notification.data)
                                : msg
                        )
                    );
                    console.log("[WebSocket] ✓ Message updated in UI");
                } else if (notification?.type === "MESSAGE" && notification?.action === "DELETED") {
                    // DELETED MESSAGE - Mark as removed
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === notification.data.id
                                ? { ...msg, state: "REMOVED", content: null }
                                : msg
                        )
                    );
                    console.log("[WebSocket] ✓ Message marked as deleted");
                } else {
                    // Fallback: Re-fetch page 0 for unknown notifications
                    console.log("[WebSocket] Unknown notification type, refreshing messages...");
                    getMessagesByChatId(null, null, conversationId, "", 0, 20).catch(
                        (error) => console.debug("Real-time refresh error:", error)
                    );
                }
            });
            
            console.log("WebSocket subscription setup for:", destination);
        };

        // Try to setup subscription, with retry if not connected yet
        const attemptSubscription = () => {
            if (retryCount < maxRetries) {
                try {
                    setupSubscription();
                    retryCount = 0;
                } catch (error) {
                    console.warn("Failed to setup subscription, retrying...", error);
                    retryCount++;
                    setTimeout(attemptSubscription, 1000); // Retry after 1 second
                }
            }
        };

        attemptSubscription();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
                console.log("WebSocket subscription unsubscribed");
            }
        };
    }, [conversationId, subscribeToTopic, getMessagesByChatId]);

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
        if (!profile?.id) {
            console.error("User profile not loaded");
            return;
        }

        try {
            // Create temp ID for optimistic message
            const tempId = `temp-${Date.now()}-${Math.random()}`;
            
            // Create optimistic message before sending
            const optimisticMessage = {
                id: tempId,
                chatId: conversationId!,
                content: message,
                senderId: profile.id,
                sentDate: new Date().toISOString(),
                createdDate: new Date().toISOString(),
                state: "ORIGIN",
                type: "TEXT",
            };
            
            // Add to UI first (optimistic)
            setMessages((prev) => [optimisticMessage, ...prev]);

            // Send via WebSocket - server will broadcast back and replace temp message
            websocketMessageService.sendViaWebSocket(
                sendMessage,
                conversationId!,
                message,
                profile.id
            );

            console.log("[Chat] ✓ Message sent via WebSocket (optimistic ID: " + tempId + ")");
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

    const handleUpdateMessage = async (messageId: string, newContent: string) => {
        try {
            await putTextMessage(null, null, messageId, { content: newContent });
        } catch (err) {
            console.error("Failed to update message:", err);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await softDeleteMessage(null, null, messageId);
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    return (
        <ConversationsLayout>
            <div className="flex w-full h-full gap-2 relative">
                <ConversationContainer>
                    <ChatHeader
                        imageUrl={chatMetadata.avatar}
                        name={chatMetadata.name}
                        isOnline={chatMetadata.isOnline}
                        onToggleInfo={() => setIsSidebarOpen(!isSidebarOpen)}
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
                        isGroupChat={chatType === "GROUP"}
                        onUpdateMessage={handleUpdateMessage}
                        onDeleteMessage={handleDeleteMessage}
                    />
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        onSendFile={handleSendFile}
                    />
                </ConversationContainer>
                
                {isSidebarOpen && conversationId && (
                    <ChatInfoSidebar 
                        type={chatType}
                        conversationId={conversationId} 
                        currentUserId={profile?.id} 
                        onClose={() => setIsSidebarOpen(false)} 
                    />
                )}
            </div>
        </ConversationsLayout>
    );
}
