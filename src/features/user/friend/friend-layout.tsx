import ConversationsFallback from "../conversation/Conversation-fallback";
import ItemList from "../item-list";
import UserLayout from "../user-layout";
type Props = React.PropsWithChildren<{}>;
export default function FriendLayout({children}: Props) {
    return (
        <div>
            <UserLayout>
                <ItemList title="Friends">Friend Page</ItemList>
                {children}
               
            </UserLayout>
        </div>
    );
}
