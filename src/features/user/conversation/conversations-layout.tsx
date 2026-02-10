import { useEffect, useState } from "react";
import ItemList from "../item-list";
import UserLayout from "../user-layout";
import LoadingLogo from "@/components/shared/loading-logo";
import ConversationItem from "./conversation-item";
import { User } from "lucide-react";
import { useChatUser } from "@/hooks/use-chat-user";
import { data } from "react-router-dom";

type Props = React.PropsWithChildren<{}>;

type Conversation = {
    id: string;
    imageUrl: string;
    username: string;
    isGroup?: boolean;
};
export default function ConversationsLayout({ children }: Props) {
    const [conversations, setConversations] = useState<Conversation[] | null>(
        null,
    );
    const { loading, error, getChatsByMemberId } = useChatUser();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getChatsByMemberId(
                    "accountId", 
                    "requesterId", 
                    "", 
                    0,
                    10, 
                    false, 
                );
                const mappedConversations = data.map((chat: any) => ({
                    id: chat.id,
                    imageUrl: chat.avatar || <User/>,
                    username: chat.name,
                    isGroup: chat.type === "GROUP",
                }));
                console.log(data);

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
                    conversations.map((conversations) =>
                        conversations.isGroup ? null : (
                            <ConversationItem
                                key={conversations.id}
                                id={conversations.id}
                                imageUrl={conversations.imageUrl}
                                username={conversations.username}
                            />
                        ),
                    )
                )}
            </ItemList>
            {children}
        </UserLayout>
    );
}
