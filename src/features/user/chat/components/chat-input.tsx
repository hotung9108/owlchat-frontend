import { useState } from "react";
import { Card } from "@/components/ui/card";

type ChatInputProps = {
    onSendMessage: (message: string) => void;
};

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage(""); // Reset input sau khi gửi
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Ngăn xuống dòng khi nhấn Enter
            handleSend();
        }
    };

    return (
        <Card className="w-full p-2 rounded-lg relative bg-muted">
            <div className="flex gap-2 items-center w-full">
                <textarea
                    className="flex-1 border border-border rounded-lg p-2 bg-card text-card-foreground"
                    rows={1}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown} // Thêm sự kiện onKeyDown
                />
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-foreground"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </Card>
    );
}