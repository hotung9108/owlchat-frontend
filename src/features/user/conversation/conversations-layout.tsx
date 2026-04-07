import { useEffect, useState } from "react";
import ItemList from "../item-list";
import UserLayout from "../user-layout";
import LoadingLogo from "@/components/shared/loading-logo";
import ConversationItem from "./conversation-item";
import { User } from "lucide-react";
import { useChatUser } from "@/hooks/use-chat-user";
import { data } from "react-router-dom";
import { useUserProfileContext } from "@/providers/user-profile-provider";

type Props = React.PropsWithChildren<{}>;

type Conversation = {
    id: string;
    imageUrl: string;
    username: string;
    isGroup?: boolean;
    newestMessageId?: string;
};
export default function ConversationsLayout({ children }: Props) {
    const [conversations, setConversations] = useState<Conversation[] | null>(
        null,
    );
    const { getChatsByMemberId } = useChatUser();
    const { profile } = useUserProfileContext();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getChatsByMemberId(
                    null,
                    null,
                    "",
                    0,
                    10,
                    false,
                );
                const mappedConversations = data.map((chat: any) => ({
                    id: chat.id,
                    imageUrl: chat.avatar || "",
                    username: chat.name,
                    isGroup: chat.type === "GROUP",
                    newestMessageId: chat.newestMessageId,
                }));
                setConversations(mappedConversations);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            }
        };

        fetchConversations();
    }, []);

    return (
        <UserLayout>
            <ItemList title="Conversations">
                {conversations === null ? (
                    <LoadingLogo />
                ) : conversations.length === 0 ? (
                    <p className="text-center text-gray-500 mt-4">
                        Oh no, there are no conversations!
                    </p>
                ) : (
                    conversations.map((c) =>
                        c.isGroup ? null : (
                            <ConversationItem
                                key={c.id}
                                id={c.id}
                                imageUrl={c.imageUrl}
                                username={c.username}
                                newestMessageId={c.newestMessageId}
                                currentUserId={profile?.id}
                            />
                        ),
                    )
                )}
            </ItemList>
            {children}
        </UserLayout>
    );
}
