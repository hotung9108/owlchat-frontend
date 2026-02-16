import React, { useEffect, useRef, useState } from "react";
import type { Message } from "@/types/message.type";
import { messageUserService } from "@/services/message-user-service";

type ChatBodyProps = {
    messages: Message[];
    currentUserId?: string;
    onScroll?: (isAtBottom: boolean) => void;
};

const ChatBody = React.forwardRef<HTMLDivElement, ChatBodyProps>(
    ({ messages, currentUserId, onScroll }, ref) => {
        const [imageCache, setImageCache] = useState<Record<string, string>>(
            {},
        );
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
        const fetchImage = async (messageId: string) => {
            try {
                const imageData: { contentType: string; resource: Blob } =
                    await messageUserService.getMessageFile(
                        null,
                        null,
                        messageId,
                    );

                // Tạo URL từ Blob
                const imageUrl = URL.createObjectURL(imageData.resource);

                // Lưu vào cache
                setImageCache((prevCache) => ({
                    ...prevCache,
                    [messageId]: imageUrl,
                }));
            } catch (error) {
                console.error(
                    `Failed to fetch image for messageId: ${messageId}`,
                    error,
                );
            }
        };
        useEffect(() => {
            messages.forEach((message) => {
                if (message.type === "IMG" && !imageCache[message.id]) {
                    fetchImage(message.id);
                }
            });
        }, [messages]);
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
                ${
                    isMe
                        ? "bg-primary text-primary-foreground self-end max-w-[60%]"
                        : "bg-muted text-muted-foreground self-start max-w-[60%]"
                }
            `}
                        >
                            {message.type === "TEXT" && (
                                <p>{message.content}</p>
                            )}

                            {message.type === "IMG" && (
                                <img
                                    src={imageCache[message.id]} 
                                    alt="sent-img"
                                    className="rounded-lg max-w-[350px] max-h-[350px] object-cover"
                                />
                            )}

                            {message.type === "VID" && (
                                <video
                                    controls
                                    src={message.content}
                                    className="rounded-lg max-w-full"
                                />
                            )}

                            {message.type === "GENERIC_FILE" && (
                                <a
                                    href={message.content}
                                    target="_blank"
                                    className="underline"
                                >
                                    Download File
                                </a>
                            )}
                            {message.type === "SYSTEM_MESSAGE" &&(
                                <p>{message.content}</p>
                            )}

                            <small className="text-xs block mt-1">
                                {new Date(message.sentDate).toLocaleString()}
                            </small>
                        </div>
                    );
                })}
            </div>
        );
    },
);
export default ChatBody;
