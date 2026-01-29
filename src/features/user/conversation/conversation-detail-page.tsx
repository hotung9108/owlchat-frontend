import { useParams } from "react-router-dom";
import LoadingLogo from "@/components/shared/LoadingLogo";
import ConversationContainer from "./conversation-container";
import ConversationsLayout from "./conversations-layout";
import { Loader2 } from "lucide-react";
import ChatHeader from "../chat/components/chat-header";
import ChatBody from "../chat/components/chat-body";
import ChatInput from "../chat/components/chat-input";
import { useState } from "react";

// Mock data
const mockConversations = [
    {
        id: "1",
        imageUrl: "/images/user1.jpg",
        username: "John Doe",
        messages: [
            { id: "1", text: "Hello!", sender: "John Doe" },
            { id: "2", text: "Hi, how are you?", sender: "You" },
            { id: "3", text: "I'm good, thanks!", sender: "John Doe" },
        ],
    },
    {
        id: "2",
        imageUrl: "/images/user2.jpg",
        username: "Jane Smith",
        messages: [
            { id: "1", text: "Hey there!", sender: "Jane Smith" },
            { id: "2", text: "Hi Jane, how's it going?", sender: "You" },
            { id: "3", text: "All good! What about you?", sender: "Jane Smith" },
        ],
    },
    {
        id: "3",
        imageUrl: "/images/user3.jpg",
        username: "Alice Johnson",
        messages: [
            { id: "1", text: "Good morning!", sender: "Alice Johnson" },
            { id: "2", text: "Morning! How are you?", sender: "You" },
            { id: "3", text: "I'm doing great, thanks for asking!", sender: "Alice Johnson" },
        ],
    },
];

export default function ConversationDetailPage() {
    const { conversationId } = useParams(); 
    const conversation = mockConversations.find(
        (conv) => conv.id === conversationId
    );
    const [messages, setMessages] = useState(conversation?.messages || []);

    const handleSendMessage = (message: string) => {
        const newMessage = {
            id: (messages.length + 1).toString(),
            text: message,
            sender: "You",
        };
        setMessages([newMessage, ...messages]); 
    };

    return (
        <ConversationsLayout>
            {conversation === undefined ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8" />
                </div>
            ) : conversation === null ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p>Conversation not found</p>
                </div>
            ) : (
                <ConversationContainer>
                    <ChatHeader
                        imageUrl={conversation.imageUrl}
                        name={conversation.username}
                    />
                    <ChatBody messages={messages} />
                    <ChatInput onSendMessage={handleSendMessage} />
                </ConversationContainer>
            )}
        </ConversationsLayout>
    );
}