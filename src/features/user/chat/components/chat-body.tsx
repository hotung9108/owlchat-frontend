import React, { useEffect, useRef, useState } from "react";
import type { Message } from "@/types/message.type";

type ChatBodyProps = {
    messages: Message[];
    currentUserId?: string;
    onScroll?: (isAtBottom: boolean) => void;
};

const ChatBody = React.forwardRef<HTMLDivElement, ChatBodyProps>(
    ({ messages, currentUserId, onScroll }, ref) => {
        const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
        const isScrolling = useRef(false); 

        const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement;

            // Lưu giá trị scrollTop cũ
            setPrevScrollTop(target.scrollTop);

            if (onScroll) {
                if (target.scrollTop * -1 >= target.scrollHeight * 0.2) {
                    onScroll(true);
                }
            }
        };

        // Tự động cuộn xuống cuối khi có tin nhắn mới
        useEffect(() => {
            if (ref && "current" in ref && ref.current) {
                const chatBody = ref.current;

                // Nếu không phải đang cuộn, đặt lại scrollTop cũ
                if (!isScrolling.current) {
                    chatBody.scrollTop = prevScrollTop;
                }

                // Reset trạng thái cuộn
                isScrolling.current = false;
            }
        }, [messages, ref, prevScrollTop]);

        return (
            <div
                ref={ref}
                onScroll={(e) => {
                    isScrolling.current = true; // Đánh dấu đang cuộn
                    handleScroll(e);
                }}
                className="flex-1 w-full 
                flex overflow-y-scroll 
                flex-col-reverse gap-2 p-3 
                no-scrollbar"
            >
                {messages.map((message) => {
                    const isMe = message.senderId === currentUserId;

                    return (
                        <div
                            key={message.id}
                            className={`p-2 rounded-lg text-sm break-words
                                ${isMe
                                    ? "bg-primary text-primary-foreground self-end max-w-[75%]"
                                    : "bg-muted text-muted-foreground self-start max-w-[60%]"
                                }
                            `}
                        >
                            <p>{message.content}</p>
                            <small className="text-xs">
                                {new Date(message.sentDate).toLocaleString()}
                            </small>
                        </div>
                    );
                })}
            </div>
        );
    }
);

export default ChatBody;