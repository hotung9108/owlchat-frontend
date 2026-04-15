// import ConversationsFallback from "../conversation-fallback";
import ChatFallback from "../chat-fallback";
import ConversationsLayout from "./conversations-layout";
export default function ConversationPage() {
    return (
        <ConversationsLayout>
            <ChatFallback/>
        </ConversationsLayout>
    );
}
