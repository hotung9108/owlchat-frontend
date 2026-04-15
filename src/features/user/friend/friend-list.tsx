import FriendCard from './friend-card';
import FriendSearchBar from './friend-search-bar';
import { useState } from 'react';

const friendsData = [
    { id: 1, name: 'Alice', status: 'Online' },
    { id: 2, name: 'Bob', status: 'Offline' },
    { id: 3, name: 'Charlie', status: 'Online' },
    { id: 4, name: 'David', status: 'Offline' },
    { id: 5, name: 'Eve', status: 'Online' },
];

export default function FriendList() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFriends = friendsData.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    return (
        <div className="flex flex-col p-4">
            <FriendSearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {filteredFriends.map(friend => (
                    <FriendCard key={friend.id} name={friend.name} avatarUrl={''} onClick={() => {}} />
                ))}
            </div>
        </div>
    );
}