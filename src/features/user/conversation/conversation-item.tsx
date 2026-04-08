import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User, Users } from "lucide-react";
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
    isGroup?: boolean;
};

export default function ConversationItem({
    id,
    imageUrl,
    username,
    newestMessageId,
    currentUserId,
    isGroup = false,
}: Props) {
    const { getChatMembersByChatId } = useChatMemberUser();
    const { getMessageById } = useMessageUser();
    const [displayName, setDisplayName] = useState(username);
    const [displayAvatar, setDisplayAvatar] = useState(imageUrl);
    const [preview, setPreview] = useState("Start the conversation!");
    const [timeStamp, setTimeStamp] = useState<string | null>(null);
    const { fetchProfileById } = useUserProfile();
    
    useEffect(() => {
        // For group chats, keep the group name and avatar
        if (isGroup) {
            setDisplayName(username);
            setDisplayAvatar(imageUrl);
            return;
        }

        // For one-on-one chats, load the other member's info
        const loadMembers = async () => {
            if (!id || !currentUserId) return;
            try {
                const membersResp = await getChatMembersByChatId(null, null, id);
                const members = membersResp.content || membersResp; // Handle page object

                if (Array.isArray(members)) {
                    // Find the member who is NOT me
                    const other = members.find((m: any) => {
                        const mId = m.memberId ?? m.userId ?? m.id;
                        return mId && mId !== currentUserId;
                    });

                    if (other) {
                        const otherId = other.memberId ?? other.userId ?? other.id;
                        const otherProfile = await fetchProfileById(otherId);
                        if (otherProfile?.name) {
                            setDisplayName(otherProfile.name);
                        }
                        if (otherProfile?.avatar || other.memberAvatar) {
                            setDisplayAvatar(otherProfile?.avatar || other.memberAvatar);
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading chat members for preview:", err);
            }
        };

        loadMembers();
    }, [id, currentUserId, isGroup, getChatMembersByChatId, fetchProfileById]);

    useEffect(() => {
        const loadNewestMessage = async () => {
            if (!newestMessageId) {
                setPreview("No messages yet");
                setTimeStamp(null);
                return;
            }
            try {
                const msg = await getMessageById(null, null, newestMessageId);
                if (!msg) return;

                let content = msg.content || "";
                if (msg.type === "IMG") content = "Đã gửi một ảnh";
                else if (msg.type === "VID") content = "Đã gửi một video";
                else if (msg.type === "GENERIC_FILE") content = "Đã gửi một tệp đính kèm";

                if (msg.senderId === currentUserId) {
                    setPreview(`You: ${content}`);
                } else {
                    setPreview(content);
                }

                if (msg.sentDate) {
                    const date = new Date(msg.sentDate);
                    setTimeStamp(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                }
            } catch (err) {
                console.error("Error loading newest message preview:", err);
            }
        };

        loadNewestMessage();
    }, [newestMessageId, currentUserId, getMessageById]);

    return (
        <Link to={`/conversations/${id}`} className="w-full">
            <Card className="p-2 flex flex-row items-center gap-4 truncate w-[95%] mx-auto transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50">
                <div className="flex flex-row items-center gap-4 truncate w-full">
                    <Avatar>
                        <AvatarImage src={displayAvatar} />
                        <AvatarFallback>
                            {isGroup ? <Users className="size-5" /> : <User className="size-5" />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate flex-1">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex items-center gap-2 truncate">
                                <h4 className="truncate font-semibold">{displayName}</h4>
                                {isGroup && (
                                    <Users className="size-4 text-muted-foreground flex-shrink-0" />
                                )}
                            </div>
                            {timeStamp && (
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {timeStamp}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                            {preview}
                        </p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
