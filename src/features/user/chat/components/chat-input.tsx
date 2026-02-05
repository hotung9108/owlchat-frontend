import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Icons } from "@/utils/constants"; // Import các icon từ constants.tsx

type ChatInputProps = {
    onSendMessage: (message: string) => void;
};

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [showMoreOptions, setShowMoreOptions] = useState(false); // Trạng thái hiển thị thêm nút

    const handleSend = () => {
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage(""); // Reset input sau khi gửi
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card className="w-full p-2 rounded-lg relative bg-muted">
            <div className="flex gap-2 items-center w-full">
                <div className="flex items-center">
                    <div className="relative">
                        <button
                            className="p-2 rounded-full hover:bg-secondary"
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                        >
                            <Icons.MoreHorizontal />
                        </button>
                        {showMoreOptions && (
                            <div className="absolute right-0 bottom-full mb-2 bg-card border border-border rounded-lg shadow-lg p-2 flex flex-col gap-2">
                                {/* Icon Microphone */}
                                <button className="p-2 rounded-full hover:bg-secondary flex items-center gap-2">
                                    <Icons.Microphone />
                                    <span className="text-sm text-card-foreground">
                                        Mic
                                    </span>
                                </button>
                                <button className="p-2 rounded-full hover:bg-secondary flex items-center gap-2">
                                    <Icons.Chat />
                                    <span className="text-sm text-card-foreground">
                                        Note
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="p-2 rounded-full hover:bg-secondary">
                        <Icons.Attachment />
                    </button>
                    {/* <button className="p-2 rounded-full hover:bg-secondary">
                        
                    </button> */}
                </div>
                <textarea
                    className="flex-1 border border-border rounded-lg p-2 bg-card text-card-foreground"
                    rows={1}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-secondary hover:text-secondary-foreground"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </Card>
    );
}
