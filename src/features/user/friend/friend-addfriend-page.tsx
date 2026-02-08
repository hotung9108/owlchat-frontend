import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon } from "lucide-react";

type Props = {};

const friendRequests = [
    {
        name: "Eve Adams",
        status: "Wants to connect with you.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Frank Ocean",
        status: "Looking forward to sharing wisdom.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Grace Hopper",
        status: "This owl is ready to join your network!",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Hank Moody",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        avatar: <AudioWaveformIcon />,
    },
];

export default function FriendAddFriendPage(props: Props) {
    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friend requests..."
                    className="w-full"
                    type="text"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {friendRequests.map((request, index) => (
                    <Card key={index} className="p-4 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                {request.avatar}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">
                                    {request.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {request.status}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <Button className="px-4 py-2">Accept</Button>
                                <Button className="px-4 py-2">Decline</Button>
                            </div>
                            <div>
                                <Button variant="ghost" className="p-2">
                                    ...
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
}