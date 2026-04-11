import { useEffect, useState, useCallback } from "react";
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { X, Search, MoreVertical, Edit2, Shield, LogOut, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type ChatInfoSidebarProps = {
    conversationId: string;
    currentUserId?: string;
    onClose: () => void;
};

const ROLE_RANK = {
    "OWNER": 4,
    "ADMIN": 3,
    "MEMBER": 2,
    "VIEWER": 1
};

export default function ChatInfoSidebar({ conversationId, currentUserId, onClose }: ChatInfoSidebarProps) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNicknameId, setEditingNicknameId] = useState<string | null>(null);
    const [editNicknameContent, setEditNicknameContent] = useState("");

    const {
        getChatMembersByChatId,
        patchChatMemberRole,
        patchChatMemberNickname,
        deleteChatMember
    } = useChatMemberUser();

    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getChatMembersByChatId(null, null, conversationId, "", 0, 50, true);
            setMembers(response?.content || response || []);
        } catch (error) {
            console.error("Failed to fetch chat members:", error);
        } finally {
            setLoading(false);
        }
    }, [conversationId, getChatMembersByChatId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Find current user's role
    const currentUserMember = members.find(m => (m.memberId === currentUserId || m.userId === currentUserId || m.id === currentUserId));
    const currentUserRole = currentUserMember?.role?.toUpperCase() || "MEMBER";
    const currentUserRank = ROLE_RANK[currentUserRole as keyof typeof ROLE_RANK] || 2;

    const handleRoleChange = async (targetId: string, newRole: string) => {
        try {
            await patchChatMemberRole(null, null, targetId, conversationId, { role: newRole });
            await fetchMembers(); // Refresh
        } catch (error) {
            console.error("Failed to change role:", error);
        }
    };

    const handleKickMember = async (targetId: string) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        try {
            await deleteChatMember(null, null, targetId, conversationId);
            await fetchMembers();
        } catch (error) {
            console.error("Failed to kick member:", error);
        }
    };

    const handleLeaveChat = async () => {
        if (!currentUserMember) return;
        const targetId = currentUserMember.memberId || currentUserMember.userId || currentUserMember.id;
        if (!window.confirm("Are you sure you want to leave this chat?")) return;
        try {
            await deleteChatMember(null, null, targetId, conversationId);
            // Optionally redirect user here, but typically socket handles removal or parent detects it
            window.location.href = "/conversations";
        } catch (error) {
            console.error("Failed to leave chat:", error);
        }
    };

    const handleUpdateNickname = async (targetId: string) => {
        if (!editNicknameContent.trim()) {
            setEditingNicknameId(null);
            return;
        }
        try {
            await patchChatMemberNickname(null, null, targetId, conversationId, { nickname: editNicknameContent.trim() });
            setEditingNicknameId(null);
            await fetchMembers();
        } catch (error) {
            console.error("Failed to update nickname:", error);
        }
    };

    const isAdminOveTarget = (targetRole: string) => {
        const targetRank = ROLE_RANK[(targetRole?.toUpperCase() || "MEMBER") as keyof typeof ROLE_RANK] || 2;
        return currentUserRank > targetRank;
    };

    const canEditNickname = (memberRank: number, isMe: boolean) => {
        return isMe || currentUserRank > memberRank;
    };

    return (
        <Card className="w-[320px] lg:w-[360px] shrink-0 h-full flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300 p-2 gap-2">
            {/* Header */}
            <div className="flex items-center justify-between p-2 pb-3 border-b">
                <h3 className="font-bold text-foreground">Chat Details</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-6">
                
                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button 
                        variant="destructive" 
                        className="w-full justify-start gap-3 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                        onClick={handleLeaveChat}
                    >
                        <LogOut className="w-4 h-4" />
                        Leave Chat
                    </Button>
                </div>

                {/* Search / Filter (Visual only for now) */}
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                        placeholder="Search members..." 
                        className="pl-9 bg-muted/50 border-none rounded-xl h-10 shadow-sm"
                    />
                </div>

                {/* Members List */}
                <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                        Members ({members.length})
                    </h4>
                    
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {members.map(member => {
                                const mId = member.memberId || member.userId || member.id;
                                const isMe = mId === currentUserId;
                                const mRole = member.role?.toUpperCase() || "MEMBER";
                                const mRank = ROLE_RANK[mRole as keyof typeof ROLE_RANK] || 2;
                                const nameToDisplay = member.nickname || member.memberName || "User";

                                return (
                                    <div key={mId} className="group flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <UserAvatar name={nameToDisplay} imageUrl={member.memberAvatar || member.avatar} size="sm" />
                                            <div className="flex flex-col overflow-hidden">
                                                {editingNicknameId === mId ? (
                                                    <div className="flex items-center gap-1">
                                                        <Input 
                                                            autoFocus
                                                            value={editNicknameContent}
                                                            onChange={(e) => setEditNicknameContent(e.target.value)}
                                                            className="h-6 w-[120px] px-2 text-xs"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateNickname(mId)}
                                                        />
                                                        <button onClick={() => handleUpdateNickname(mId)} className="text-green-500 p-1 hover:bg-green-500/20 rounded">
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                        <button onClick={() => setEditingNicknameId(null)} className="text-muted-foreground p-1 hover:bg-muted rounded">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-sm text-foreground truncate">
                                                        {nameToDisplay} {isMe && <span className="text-muted-foreground font-normal">(You)</span>}
                                                    </span>
                                                )}
                                                
                                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 text-primary flex items-center gap-1 mt-0.5">
                                                    {(mRole === "ADMIN" || mRole === "OWNER") && <Shield className="w-3 h-3" />}
                                                    {mRole}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dropdown Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                {canEditNickname(mRank, isMe) && (
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditingNicknameId(mId);
                                                        setEditNicknameContent(nameToDisplay);
                                                    }}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Change Nickname
                                                    </DropdownMenuItem>
                                                )}

                                                {isAdminOveTarget(mRole) && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel className="text-xs opacity-70">Set Role</DropdownMenuLabel>
                                                        {currentUserRank >= ROLE_RANK["OWNER"] && mRole !== "ADMIN" && (
                                                            <DropdownMenuItem onClick={() => handleRoleChange(mId, "ADMIN")}>
                                                                Promote to Admin
                                                            </DropdownMenuItem>
                                                        )}
                                                        {mRole !== "MEMBER" && mRole !== "OWNER" && (
                                                            <DropdownMenuItem onClick={() => handleRoleChange(mId, "MEMBER")}>
                                                                Set to Member
                                                            </DropdownMenuItem>
                                                        )}
                                                        {mRole !== "VIEWER" && mRole !== "OWNER" && (
                                                            <DropdownMenuItem onClick={() => handleRoleChange(mId, "VIEWER")}>
                                                                Set to Viewer
                                                            </DropdownMenuItem>
                                                        )}
                                                        
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                                                            onClick={() => handleKickMember(mId)}
                                                        >
                                                            <LogOut className="w-4 h-4 mr-2" /> Remove from Chat
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
