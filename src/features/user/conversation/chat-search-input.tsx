import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export default function ChatSearchInput({
    value,
    onChange,
    placeholder = "Tìm kiếm chat hoặc người dùng...",
}: Props) {
    return (
        <div className="relative w-full mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-10"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                    <X size={16} />
                </Button>
            )}
        </div>
    );
}
