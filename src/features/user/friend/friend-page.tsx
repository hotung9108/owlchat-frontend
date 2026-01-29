import ConversationsFallback from "../conversation/Conversation-fallback";
import ItemList from "../item-list";
import UserLayout from "../user-layout";
import FriendLayout from "./friend-layout";
type Props = {};
export default function FriendPage(props: Props) {
    return (
        <div>
            {/* <UserLayout>
                <ItemList title="Friends">
                    Friend Page
                </ItemList>
                <ConversationsFallback/>
            </UserLayout> */}
            <FriendLayout>
                <ConversationsFallback />
            </FriendLayout>
        </div>
    );
}
