import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon } from "lucide-react";

type Props = {};

const suggestions = [
    {
        name: "John Doe",
        status: "Exploring the world of wisdom.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Jane Smith",
        status: "Lover of books and coffee.",
        avatar: <AudioWaveformIcon />,
    },
    {
        name: "Elon Musk",
        status: "Dreaming of Mars.",
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
        avatar: <AudioWaveformIcon />,
    },
];

export default function FriendDiscoveryFriendPage(props: Props) {
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
                {suggestions.map((suggestion, index) => (
                    <Card key={index} className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                {suggestion.avatar}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">
                                    {suggestion.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {suggestion.status}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <Button className="px-4 py-2">Add Friend</Button>
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