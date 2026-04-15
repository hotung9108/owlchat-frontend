import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import type { Message } from "@/types/message.type";
import { messageUserService } from "@/services/message-user-service";
import UserAvatar from "@/components/shared/user-avatar";
import { LocationMessage } from "@/components/shared/location-message";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import { FileText, Download, Film, Clock, MoreVertical, Pencil, Trash2, X, Check, Flag } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MessageReportDialog from "./message-report-dialog";

type ChatBodyProps = {
    messages: Message[];
    conversationId?: string;
    currentUserId?: string;
    onScroll?: (isNearTop: boolean) => void;
    isLoadingMore?: boolean;
    otherUserName?: string;
    otherUserImage?: string;
    isGroupChat?: boolean;
    onUpdateMessage?: (id: string, newContent: string) => void;
    onDeleteMessage?: (id: string) => void;
};

const ChatBody = React.memo(React.forwardRef<HTMLDivElement, ChatBodyProps>(
    ({ messages, conversationId, currentUserId, onScroll, isLoadingMore, otherUserName, otherUserImage, isGroupChat, onUpdateMessage, onDeleteMessage }, ref) => {
        const { fetchProfileById } = useUserProfile();
        const { getChatMembersByChatId } = useChatMemberUser();
        const [assetCache, setAssetCache] = useState<Record<string, { url: string; type: string }>>({});
        const [senderCache, setSenderCache] = useState<Record<string, { name: string; nickname?: string }>>({});
        const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
        const [editContent, setEditContent] = useState<string>("");
        const scrollHeightRef = useRef<number>(0);
        const lastScrollTopRef = useRef<number>(0);
        const lastMessageIdRef = useRef<string | null>(null);
        const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
        const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; messageId: string | null }>({ open: false, messageId: null });
        const fetchingSenderIds = useRef<Set<string>>(new Set());

        const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
            const target = e.target as HTMLDivElement;
            lastScrollTopRef.current = target.scrollTop;
            const isNearTop = Math.abs(target.scrollTop) + target.clientHeight >= target.scrollHeight - 50;
            if (isNearTop && onScroll) {
                onScroll(true);
            }
        }, [onScroll]);

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

        const fetchAsset = useCallback(async (messageId: string) => {
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
        }, [assetCache]);

        useEffect(() => {
            const pendingAssets = messages.filter(m => 
                (m.type === "IMG" || m.type === "VID" || m.type === "GENERIC_FILE") && 
                !assetCache[m.id]
            );
            pendingAssets.forEach((m) => fetchAsset(m.id));
        }, [messages, assetCache]);

        const fetchSenderName = useCallback(async (senderId: string) => {
            if (fetchingSenderIds.current.has(senderId) || senderCache[senderId]) return;
            
            if (!isGroupChat || senderId === currentUserId) return;
            
            fetchingSenderIds.current.add(senderId);
            try {
                // First try to get chat member with nickname
                if (conversationId) {
                    try {
                        const membersResponse = await getChatMembersByChatId(null, null, conversationId, "", 0, 100, true);
                        const members = Array.isArray(membersResponse?.content) ? membersResponse.content : Array.isArray(membersResponse) ? membersResponse : [];
                        const member = members.find((m: any) => m.memberId === senderId || m.userId === senderId);
                        
                        if (member) {
                            const displayName = member.nickname || member.memberName || member.userName;
                            setSenderCache((prev) => ({
                                ...prev,
                                [senderId]: {
                                    name: displayName,
                                    nickname: member.nickname
                                }
                            }));
                            return;
                        }
                    } catch (error) {
                        console.error(`Failed to load chat member info for ${senderId}:`, error);
                    }
                }
                
                // Fallback to profile if member info not available
                const profile = await fetchProfileById(senderId);
                if (profile?.name) {
                    setSenderCache((prev) => ({
                        ...prev,
                        [senderId]: {
                            name: profile.name
                        }
                    }));
                }
            } catch (error) {
                console.error(`Failed to load sender profile ${senderId}:`, error);
            } finally {
                fetchingSenderIds.current.delete(senderId);
            }
        }, [isGroupChat, currentUserId, senderCache, conversationId, fetchProfileById, getChatMembersByChatId]);

        useEffect(() => {
            if (!isGroupChat) return;
            
            const pendingSenders = messages.filter(m => 
                m.senderId !== currentUserId && !senderCache[m.senderId]
            );
            pendingSenders.forEach((m) => fetchSenderName(m.senderId));
        }, [messages, isGroupChat, currentUserId, senderCache, fetchSenderName]);

        const handleDownload = useCallback((messageId: string, filename: string) => {
            const asset = assetCache[messageId];
            if (!asset) return;
            
            const link = document.createElement('a');
            link.href = asset.url;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, [assetCache]);

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
                    const isDeleted = message.state === "REMOVED";
                    const isEdited = message.state === "EDITED";

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

                    // Render deleted messages
                    if (isDeleted) {
                        return (
                            <div
                                key={message.id}
                                className={`group flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {!isMe && (
                                    <UserAvatar 
                                        name={otherUserName || "User"} 
                                        imageUrl={otherUserImage} 
                                        size="sm" 
                                        className="mb-1 shrink-0"
                                    />
                                )}
                                <div className={`p-3 rounded-2xl text-sm italic opacity-60 ${isMe ? "bg-primary/10" : "bg-muted/50"}`}>
                                    Tin nhắn đã bị xóa
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={message.id}
                            className={`group flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {!isMe && (
                                <UserAvatar 
                                    name={otherUserName || "User"} 
                                    imageUrl={otherUserImage} 
                                    size="sm" 
                                    className="mb-1 shrink-0"
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                {isGroupChat && !isMe && (
                                    <div className={`text-xs font-semibold text-muted-foreground px-1 ${isMe ? "text-right" : "text-left"}`}>
                                        {senderCache[message.senderId]?.nickname || senderCache[message.senderId]?.name || message.senderId}
                                    </div>
                                )}
                                <div className={`flex items-end gap-1 ${isMe ? "flex-row-reverse" : ""}`}>
                                <div
                                    className={`group relative p-3 rounded-2xl text-sm break-words shadow-sm transition-all overflow-hidden flex-1
                                        ${isMe
                                            ? "bg-primary text-primary-foreground rounded-br-none self-end max-w-[75%]"
                                            : "bg-muted text-muted-foreground rounded-bl-none self-start max-w-[75%]"
                                        }
                                    `}
                                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                                >
                                {message.type === "TEXT" && (
                                    editingMessageId === message.id ? (
                                        <div className="flex flex-col gap-2 min-w-[200px]">
                                            <textarea 
                                                autoFocus
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-background/50 border border-primary/20 rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-none"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setEditingMessageId(null)}
                                                    className="p-1.5 rounded-full hover:bg-background/20 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (editContent.trim()) {
                                                            onUpdateMessage?.(message.id, editContent.trim());
                                                            setEditingMessageId(null);
                                                        }
                                                    }}
                                                    className="p-1.5 rounded-full hover:bg-background/20 text-green-500 hover:text-green-400 transition-colors"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap leading-relaxed">
                                            {message.content}
                                            {isEdited && (
                                                <span className="text-[10px] opacity-40 ml-2 italic font-semibold">(đã chỉnh sửa)</span>
                                            )}
                                        </p>
                                    )
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

                                {message.type === "LOCATION" && (
                                    (() => {
                                        try {
                                            const location = JSON.parse(message.content);
                                            return <LocationMessage location={location} isMe={isMe} />;
                                        } catch {
                                            return <p className="text-xs opacity-60">Location data unavailable</p>;
                                        }
                                    })()
                                )}

                                <div className={`text-[10px] mt-1.5 opacity-60 font-semibold tracking-tighter ${isMe ? "text-right" : "text-left"}`}>
                                    {new Date(message.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                </div>
                                {!isSystemMessage && (
                                    <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity self-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 text-muted-foreground hover:bg-muted/50 rounded-full outline-none focus:bg-muted/50">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align={isMe ? "end" : "start"} className="w-40">
                                            {isMe ? (
                                                <>
                                                    {message.type === "TEXT" && (
                                                        <DropdownMenuItem onClick={() => {
                                                            setEditingMessageId(message.id);
                                                            setEditContent(message.content || "");
                                                        }}>
                                                            <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem 
                                                        onClick={() => setDeleteConfirmation({ open: true, messageId: message.id })} 
                                                        className="text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Xóa
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <DropdownMenuItem onClick={() => setReportingMessageId(message.id)}>
                                                    <Flag className="w-4 h-4 mr-2" /> Báo cáo
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                )}
                                </div>
                            </div>

                        </div>
                    );
                })}
                <MessageReportDialog
                    messageId={reportingMessageId}
                    open={!!reportingMessageId}
                    onOpenChange={(open) => {
                        if (!open) setReportingMessageId(null);
                    }}
                />
                <Dialog open={deleteConfirmation.open} onOpenChange={(open) => setDeleteConfirmation({ ...deleteConfirmation, open })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Xóa tin nhắn?</DialogTitle>
                            <DialogDescription>
                                Hành động này không thể hoàn tác. Tin nhắn sẽ bị xóa vĩnh viễn.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteConfirmation({ open: false, messageId: null })}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (deleteConfirmation.messageId) {
                                        onDeleteMessage?.(deleteConfirmation.messageId);
                                        setDeleteConfirmation({ open: false, messageId: null });
                                    }
                                }}
                            >
                                Xóa
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    },
));

export default ChatBody;
