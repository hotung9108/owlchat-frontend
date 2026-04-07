import { Icons } from "@/utils/constants";
import { CircleArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "@/components/shared/user-avatar";

type ChatHeaderProps = {
    imageUrl?: string;
    name: string;
    isOnline?: boolean;
};

export default function ChatHeader({ imageUrl, name, isOnline }: ChatHeaderProps) {
    return (
        <div
            className="w-full flex flex-row items-center justify-between p-3 border-b bg-card/60 backdrop-blur-md sticky top-0 z-10"
        >
            <div className="flex items-center gap-3">
                <Link to={`/conversations`} className="block lg:hidden hover:text-primary transition-colors">
                    <CircleArrowLeft className="w-6 h-6" />
                </Link>
                <div className="relative">
                    <UserAvatar name={name} imageUrl={imageUrl} size="md" />
                    {isOnline && (
                        <span className="absolute bottom-2 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <h2 className="font-semibold text-foreground text-sm md:text-base leading-tight truncate">{name}</h2>
                    <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none mt-0.5">
                        {isOnline ? "Active now" : "Offline"}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 text-muted-foreground px-2">
                <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                    <Icons.Phone />
                </button>
                <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                    <Icons.Video />
                </button>
                <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}