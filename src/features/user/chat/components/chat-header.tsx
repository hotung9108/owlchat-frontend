import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Icons } from "@/utils/constants";
import { CircleArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
    imageUrl?: string;
    name: string;
};
export default function ChatHeader({ imageUrl, name }: Props) {
    return (
        <Card
            className="w-full flex
            flex-row
            rounded-lg
            items-center
            p-2
            justify-between"
        >
            <div className="flex items-center gap-2">
                <Link to={`/conversations`} className="block lg:hidden">
                    <CircleArrowLeft />
                </Link>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={imageUrl}></AvatarImage>
                    <AvatarFallback>
                        {/* <User /> */}
                        {name.substring(0,1)}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">{name}</h2>
            </div>
            <div className="flex items-center gap-5">
                <Icons.Phone/>
                <Icons.Video />
                <Info/>
            </div>
        </Card>
    );
}