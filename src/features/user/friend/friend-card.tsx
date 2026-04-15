import React from 'react';
import { Card } from '../../../components/ui/card';

type FriendCardProps = {
    name: string;
    avatarUrl: string;
    onClick: () => void;
};

const FriendCard: React.FC<FriendCardProps> = ({ name, avatarUrl, onClick }) => {
    return (
        <Card onClick={onClick} className="flex items-center p-4 cursor-pointer hover:bg-gray-100 transition">
            <img src={avatarUrl} alt={`${name}'s avatar`} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
        </Card>
    );
};

export default FriendCard;