import ConversationsFallback from "./conversation-fallback";
import ConversationsLayout from "./conversations-layout";
type Props = {};
export default function ConversationPage(props: Props) {
    return (
        <ConversationsLayout>
            <ConversationsFallback/>
        </ConversationsLayout>
    );
}
