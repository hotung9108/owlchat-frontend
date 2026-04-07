import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Icons } from "@/utils/constants"; // Import các icon từ constants.tsx
import type { MessageType } from "@/types/enum/mesage-type";
type ChatInputProps = {
    onSendMessage: (message: string) => void;
    onSendFile: (file: File, type: MessageType) => void;
};

export default function ChatInput({
    onSendMessage,
    onSendFile,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [showMoreOptions, setShowMoreOptions] = useState(false); // Trạng thái hiển thị thêm nút
    const fileInputRef = useRef<HTMLInputElement>(null);

    const detectFileType = (file: File): MessageType => {
        if (file.type.startsWith("image/")) return "IMG";
        if (file.type.startsWith("video/")) return "VID";
        return "GENERIC_FILE";
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const type = detectFileType(file);

        onSendFile(file, type);
        e.target.value = "";
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === "file") {
                const file = item.getAsFile();
                if (!file) continue;

                const type = detectFileType(file);
                onSendFile(file, type);
                e.preventDefault();
                return;
            }
        }
    };
    const handleSend = () => {
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
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
                    <button
                        className="p-2 rounded-full hover:bg-secondary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Icons.Attachment />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
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
                    onPaste={handlePaste}
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
