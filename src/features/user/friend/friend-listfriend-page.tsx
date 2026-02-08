// import Card from "../../components/ui/card";
// import Button from "../../components/ui/button";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon } from "lucide-react";
type Props = {};

const friends = [
    {
        name: "Alice Cooper",
        status: "Living the high life in the trees.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Bob Marley",
        status: "One love, one forest.",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Charlie Sheen",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Daisy Ridley",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Alice Cooper",
        status: "Living the high life in the trees.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Bob Marley",
        status: "One love, one forest.",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Charlie Sheen",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Daisy Ridley",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Alice Cooper",
        status: "Living the high life in the trees.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Bob Marley",
        status: "One love, one forest.",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Charlie Sheen",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Daisy Ridley",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Alice Cooper",
        status: "Living the high life in the trees.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Bob Marley",
        status: "One love, one forest.",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Charlie Sheen",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Daisy Ridley",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Alice Cooper",
        status: "Living the high life in the trees.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Bob Marley",
        status: "One love, one forest.",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Charlie Sheen",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Daisy Ridley",
        status: "This owl hasn't shared their wisdom yet, but they're part of the forest!",
        // avatar: "https://via.placeholder.com/150",
        avatar: <AudioWaveformIcon />,
    },
];

export default function FriendListFriendPage(props: Props) {
    return (
        <>
            <div className="mb-6">
                <Input
                    placeholder="Search friends..."
                    className="w-full"
                    type="text"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {friends.map((friend, index) => (
                    <Card key={index} className="p-4 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                {friend.avatar}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">
                                    {friend.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {friend.status}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <Button className="px-4 py-2">Message</Button>
                                {/* <Button className="px-4 py-2">Unfriend</Button> */}
                                <Button className="px-4 py-2">Profile</Button>
                            </div>
                            <div>
                                <Button variant="ghost" className="">
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
