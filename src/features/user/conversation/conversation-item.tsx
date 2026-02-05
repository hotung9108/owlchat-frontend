import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
    id: string;
    imageUrl: string;
    username: string;
};

export default function ConversationItem({ id, imageUrl, username }: Props) {
    return (
        <Link to={`/conversations/${id}`} className="w-full">
            <Card className="p-2 flex flex-row items-center gap-4 truncate">
                <div className="flex flex-row items-center gap-4 truncate">
                    <Avatar>
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <h4 className="truncate">{username}</h4>
                        <p className="text-sm text-muted-foreground tuncate">
                            Start the conversation!
                        </p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
