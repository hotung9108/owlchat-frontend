import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioWaveformIcon } from "lucide-react";
import { useFriendship } from "./hooks/use-friendship";

type Props = {};

export default function FriendListFriendPage(props: Props) {
    const {
        friendships,
        loading,
        error,
        fetchFriendships,
    } = useFriendship("");
    useEffect(() => {
        fetchFriendships();
    },[fetchFriendships])
    useEffect(()=>{
        console.log(friendships);
    }, [friendships])
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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
                {friendships.map((friend) => (
                    <Card
                        key={friend.id}
                        className="p-4 justify-between transition-[color,box-shadow] hover:shadow-md hover:ring-1 hover:ring-ring/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center">
                                <AudioWaveformIcon />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">
                                    {friend.firstUserId}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Friendship created on: {friend.createdDate}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <Button className="px-4 py-2">Message</Button>
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