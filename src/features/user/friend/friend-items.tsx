import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

type Props = {
    id: string;
    imageUrl: string;
    name: string;
    actionLabel: string;
    onActionClick: (id: string) => void;
    actionClassName?: string;
};

export default function FriendItem({
    id,
    imageUrl,
    name,
    actionLabel,
    onActionClick,
    actionClassName,
}: Props) {
    return (
        <Card className="p-2 flex flex-row items-center gap-4 truncate">
            <div className="flex flex-row items-center gap-4 truncate">
                <Avatar>
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                    <h4 className="truncate">{name}</h4>
                </div>
            </div>
            <button
                onClick={() => onActionClick(id)}
                className={`text-sm ${actionClassName || "text-blue-500"} hover:underline`}
            >
                {actionLabel}
            </button>
        </Card>
    );
}