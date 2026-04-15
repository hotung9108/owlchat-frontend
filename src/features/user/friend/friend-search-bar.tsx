import { useState } from "react";
import { Input } from "../../../components/ui/input";
type Props = {
    onSearch: (query: string) => void;
};

export default function FriendSearchBar({ onSearch }: Props) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="mb-4">
            <Input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
            />
        </div>
    );
}