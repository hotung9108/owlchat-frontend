import FriendLayout from "./friend-layout";

const mockFriends = [
    { id: "1", name: "John Doe", imageUrl: "/images/user1.jpg" },
    { id: "2", name: "Jane Smith", imageUrl: "/images/user2.jpg" },
    { id: "3", name: "Alice Johnson", imageUrl: "/images/user3.jpg" },
];

export default function FriendUserFriendPage() {
    return (
        <FriendLayout>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Bạn của bạn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockFriends.map((friend) => (
                        <div
                            key={friend.id}
                            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
                        >
                            <img
                                src={friend.imageUrl}
                                alt={friend.name}
                                className="h-12 w-12 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{friend.name}</p>
                                <button className="text-sm text-red-500 hover:underline">
                                    Hủy kết bạn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FriendLayout>
    );
}