import { useEffect, useState } from "react";
import ItemList from "../item-list";
import UserLayout from "../user-layout";
import LoadingLogo from "@/components/shared/LoadingLogo";
import ConversationItem from "./conversation-item";

type Props = React.PropsWithChildren<{}>;

type Conversation = {
    id: string;
    imageUrl: string;
    username: string;
    isGroup?: boolean;
};
const mockConversations: Conversation[] = [
    { id: "1", imageUrl: "/images/user1.jpg", username: "John Doe" },
    { id: "2", imageUrl: "/images/user2.jpg", username: "Jane Smith" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },

    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },

    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },

    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },
    { id: "3", imageUrl: "/images/user3.jpg", username: "Alice Johnson" },

];
export default function ConversationsLayout({ children }: Props) {
    const [conversations, setConversations] = useState<Conversation[] | null>(
        null,
    );
    useEffect(() => {
        const timer = setTimeout(() => {
            setConversations(mockConversations);
        }, 2000);
        return () => clearTimeout(timer);
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
