import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import type { Message } from "@/types/message.type";
import { messageUserService } from "@/services/message-user-service";
import UserAvatar from "@/components/shared/user-avatar";
import { FileText, Download, Film, Clock } from "lucide-react";

type ChatBodyProps = {
    messages: Message[];
    currentUserId?: string;
    onScroll?: (isNearTop: boolean) => void;
    isLoadingMore?: boolean;
    otherUserName?: string;
    otherUserImage?: string;
};

const ChatBody = React.forwardRef<HTMLDivElement, ChatBodyProps>(
    ({ messages, currentUserId, onScroll, isLoadingMore, otherUserName, otherUserImage }, ref) => {
        const [assetCache, setAssetCache] = useState<Record<string, { url: string; type: string }>>({});
        const scrollHeightRef = useRef<number>(0);
        const lastScrollTopRef = useRef<number>(0);
        const lastMessageIdRef = useRef<string | null>(null);

        const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement;
            lastScrollTopRef.current = target.scrollTop;
            const isNearTop = Math.abs(target.scrollTop) + target.clientHeight >= target.scrollHeight - 50;
            if (isNearTop && onScroll) {
                onScroll(true);
            }
        };

        useLayoutEffect(() => {
            if (ref && "current" in ref && ref.current) {
                const container = ref.current;
                const hasNewMessage = messages.length > 0 && 
                                     lastMessageIdRef.current && 
                                     messages[0].id !== lastMessageIdRef.current;

                if (scrollHeightRef.current === 0 || (hasNewMessage && messages[0].senderId === currentUserId)) {
                    container.scrollTop = 0;
                } 
                else if (scrollHeightRef.current > 0 && messages.length > 0 && !hasNewMessage) {
                    container.style.scrollBehavior = 'auto';
                    container.scrollTop = lastScrollTopRef.current;
                }
                else if (hasNewMessage && messages[0].senderId !== currentUserId) {
                    const isNearBottom = Math.abs(container.scrollTop) < 100;
                    if (isNearBottom) {
                        container.scrollTop = 0;
                    }
                }

                scrollHeightRef.current = container.scrollHeight;
                lastMessageIdRef.current = messages.length > 0 ? messages[0].id : null;
            }
        }, [messages, currentUserId, ref]);

        const fetchingIds = useRef<Set<string>>(new Set());

        const fetchAsset = async (messageId: string) => {
            if (fetchingIds.current.has(messageId) || assetCache[messageId]) return;
            
            fetchingIds.current.add(messageId);
            try {
                const data = await messageUserService.getMessageFile(null, null, messageId);
                const url = URL.createObjectURL(data.resource);
                setAssetCache((prev) => ({ ...prev, [messageId]: { url, type: data.contentType } }));
            } catch (error: any) {
                if (error?.response?.status !== 400) {
                    console.error(`Failed to load asset ${messageId}:`, error);
                }
            } finally {
                fetchingIds.current.delete(messageId);
            }
        };

        useEffect(() => {
            const pendingAssets = messages.filter(m => 
                (m.type === "IMG" || m.type === "VID" || m.type === "GENERIC_FILE") && 
                !assetCache[m.id]
            );
            pendingAssets.forEach((m) => fetchAsset(m.id));
        }, [messages, assetCache]);

        const handleDownload = (messageId: string, filename: string) => {
            const asset = assetCache[messageId];
            if (!asset) return;
            
            const link = document.createElement('a');
            link.href = asset.url;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return (
            <div
                ref={ref}
                onScroll={handleScroll}
                className="flex-1 w-full flex overflow-y-auto flex-col-reverse gap-4 p-4 no-scrollbar scroll-smooth"
                style={{ overflowAnchor: "auto" }}
            >
                {isLoadingMore && (
                    <div className="flex justify-center items-center py-4 opacity-75" style={{ overflowAnchor: "none" }}>
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {messages.map((message) => {
                    const isMe = message.senderId === currentUserId;
                    const asset = assetCache[message.id];
                    const isSystemMessage = message.type === "SYSTEM_MESSAGE";

                    // Render system messages differently
                    if (isSystemMessage) {
                        return (
                            <div
                                key={message.id}
                                className="flex justify-center items-center py-2"
                            >
                                <div className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium text-center max-w-[80%]">
                                    {message.content}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {!isMe && (
                                <UserAvatar 
                                    name={otherUserName || "User"} 
                                    imageUrl={otherUserImage} 
                                    size="sm" 
                                    className="mb-1 shrink-0"
                                />
                            )}
                            <div
                                className={`group relative p-3 rounded-2xl text-sm break-words shadow-sm transition-all
                                    ${isMe
                                        ? "bg-primary text-primary-foreground rounded-br-none self-end max-w-[75%]"
                                        : "bg-muted text-muted-foreground rounded-bl-none self-start max-w-[75%]"
                                    }
                                `}
                            >
                                {message.type === "TEXT" && (
                                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                )}

                                {message.type === "IMG" && (asset ? (
                                    <div className="overflow-hidden rounded-lg mt-1 group-hover:shadow-md transition-shadow">
                                        <img
                                            src={asset.url} 
                                            alt="content"
                                            className="max-w-full max-h-[400px] object-cover hover:scale-[1.02] transition-transform cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-48 h-32 bg-background/20 animate-pulse rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 opacity-20" />
                                    </div>
                                ))}

                                {message.type === "VID" && (asset ? (
                                    <div className="relative rounded-lg overflow-hidden mt-1 group overflow-hidden">
                                        <video
                                            controls
                                            src={asset.url}
                                            className="max-w-full max-h-[400px] bg-black/10"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-64 h-40 bg-background/20 animate-pulse rounded-lg flex items-center justify-center">
                                        <Film className="w-8 h-8 opacity-20" />
                                    </div>
                                ))}

                                {message.type === "GENERIC_FILE" && (
                                    <div className="flex flex-col gap-2 p-2 min-w-[200px]">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/10 backdrop-blur-sm border border-white/10">
                                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate">
                                                    {message.content || "Document"}
                                                </p>
                                                <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest mt-0.5">
                                                    {asset?.type?.split('/')[1] || "FILE"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={!asset}
                                            onClick={() => handleDownload(message.id, message.content)}
                                            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-foreground transition-colors disabled:opacity-50"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">Download</span>
                                        </button>
                                    </div>
                                )}

                                <div className={`text-[10px] mt-1.5 opacity-60 font-semibold tracking-tighter ${isMe ? "text-right" : "text-left"}`}>
                                    {new Date(message.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    },
);

export default ChatBody;
