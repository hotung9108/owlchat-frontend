import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import { useMessageUser } from "@/hooks/use-chat-message-user";
import { useUserProfile } from "@/hooks/use-user-profile";

type Props = {
    id: string;
    imageUrl: string;
    username: string;
    newestMessageId?: string;
    currentUserId?: string;
};

export default function ConversationItem({
    id,
    imageUrl,
    username,
    newestMessageId,
    currentUserId,
}: Props) {
    const { getChatMembersByChatId } = useChatMemberUser();
    const { getMessageById } = useMessageUser();
    const [displayName, setDisplayName] = useState(username);
    const [preview, setPreview] = useState("Start the conversation!");
    const { fetchProfileById } = useUserProfile();
    useEffect(() => {
        const loadMembers = async () => {
            try {
                const members = await getChatMembersByChatId(null, null, id);
                if (
                    Array.isArray(members) &&
                    members.length === 2 &&
                    currentUserId
                ) {
                    const other = members.find((m: any) => {
                        const memberId = m.memberId ?? m.userId ?? m.id;
                        return memberId !== currentUserId;
                    });
                    const otherId =
                        other?.memberId ?? other?.userId ?? other?.id;
                    if (otherId) {
                        const otherProfile = await fetchProfileById(otherId);
                        const otherName =
                            otherProfile?.name ??
                            // otherProfile?.displayName ??
                            // otherProfile?.username ??
                            otherId;
                        setDisplayName(otherName);
                    }
                }
            } catch {
                // ignore
            }
        };

        loadMembers();
    }, []);

    useEffect(() => {
        const loadNewestMessage = async () => {
            if (!newestMessageId) return;
            try {
                const msg = await getMessageById(null, null, newestMessageId);
                if (!msg) return;

                if (msg?.senderId === currentUserId) {
                    if (msg?.content) setPreview(`You: ${msg.content}`);
                    return;
                }

                const senderProfile = await fetchProfileById(msg.senderId);
                const senderName =
                    senderProfile?.name ??
                    // senderProfile?.displayName ??
                    // senderProfile?.username ??
                    msg.senderId;

                if (msg?.type === "IMG") {
                    setPreview(`${senderName}: Đã gửi một ảnh`);
                } else if (msg?.content) {
                    setPreview(`${senderName}: ${msg.content}`);
                }
            } catch {
                // ignore
            }
        };

        loadNewestMessage();
    }, []);

    return (
        <Link to={`/conversations/${id}`} className="w-full">
            <Card className="p-2 flex flex-row items-center gap-4 truncate w-[95%] mx-auto transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50">
                <div className="flex flex-row items-center gap-4 truncate">
                    <Avatar>
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <h4 className="truncate">{displayName}</h4>
                        <p className="text-sm text-muted-foreground tuncate">
                            {preview}
                        </p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
