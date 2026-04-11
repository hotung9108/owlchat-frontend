import { useState, useImperativeHandle, forwardRef, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useChatAdminService } from "@/hooks/use-chat-admin"
import { useMemberAdminService } from "@/hooks/use-chat-member-admin"
import { useMessageService } from "@/hooks/use-message-admin"
import { useUserProfile } from "@/hooks/use-user-profile"
import type { UserProfile } from "@/types/user-profile.type"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar"
import {
  MessageSquare, Users, Hash, Clock, User, Crown, Shield,
  CheckCheck, Check, Eye, Trash2, Power, PowerOff,
} from "lucide-react"
import { format } from "date-fns"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatType       = "PRIVATE" | "GROUP"
type MemberRole     = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
type MessageState   = "ORIGIN" | "EDITED" | "REMOVED"
type MessageType    = "SYSTEM_MESSAGE" | "TEXT" | "IMG" | "VID" | "DOC"

type Chat = {
  id: string
  status: boolean
  type: ChatType
  name: string
  avatar: string
  initiator_id: string
  newest_message_id: string | null
  newest_message_date: string | null
  created_date: string
  updated_date: string
}

type ChatMember = {
  member_id: string
  member_name: string
  member_avatar: string
  chat_id: string
  role: MemberRole
  nickname: string | null
  inviter_id: string | null
  inviter_name: string | null
  join_date: string
}

type Message = {
  id: string
  chat_id: string
  status: boolean
  state: MessageState
  type: MessageType
  content: string
  sender_id: string
  sender_name: string
  sender_avatar: string
  predecessor_id: string | null
  sent_date: string | null
  removed_date: string | null
  created_date: string
}

// ── Exposed methods via ref ───────────────────────────────────────────────────

export type ChatDetailHandle = {
  addMessage:     (msg: Message)    => void
  updateMessage:  (msg: Message)    => void
  removeMessage:  (id: string)      => void
  addMember:      (m: ChatMember)   => void
  updateMember:   (m: ChatMember)   => void
  removeMember:   (memberId: string) => void
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
// Removed as API hook is integrated

// ── Helper sub-components ─────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-sm text-foreground break-all">{value}</span>
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: MemberRole }) {
  if (role === "OWNER") return (
    <Badge variant="outline" className="text-xs gap-1 border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
      <Crown size={10} /> Owner
    </Badge>
  )
  if (role === "ADMIN") return (
    <Badge variant="outline" className="text-xs gap-1 border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400">
      <Shield size={10} /> Admin
    </Badge>
  )
  return (
    <Badge variant="outline" className="text-xs gap-1 border-border bg-muted text-muted-foreground">
      <User size={10} /> Member
    </Badge>
  )
}

function MessageStateBadge({ state }: { state: MessageState }) {
  if (state === "EDITED")    return <Badge variant="outline" className="text-xs gap-1 border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"><Check size={10} />Edited</Badge>
  if (state === "REMOVED")   return <Badge variant="outline" className="text-xs gap-1 border-destructive/40 bg-destructive/10 text-destructive"><Trash2 size={10} />Removed</Badge>
  return <Badge variant="outline" className="text-xs gap-1 border-border bg-muted text-muted-foreground"><CheckCheck size={10} />Origin</Badge>
}

function MessageTypeBadge({ type }: { type: MessageType }) {
  const map: Record<MessageType, string> = {
    TEXT: "border-border bg-muted text-muted-foreground",
    IMG: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    DOC: "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
    VID: "border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-400",
    SYSTEM_MESSAGE: "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  }
  return <Badge variant="outline" className={`text-xs ${map[type]}`}>{type}</Badge>
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminChatDetails = forwardRef<ChatDetailHandle>(({}, ref) => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { chatDetail, fetchChatById, updateStatus, loading } = useChatAdminService()
    const { members: rawMembers, fetchMembersByChat, loading: membersLoading } = useMemberAdminService()
    const { messages: rawMessages, fetchByChat, loading: messagesLoading } = useMessageService()
    const { profiles: rawUsers, fetchProfiles } = useUserProfile()

    const [chat, setChat] = useState<Chat | null>(null)
    const [members, setMembers] = useState<ChatMember[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [toggleOpen, setToggleOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("members")
    const [membersLoaded, setMembersLoaded] = useState(false)
    const [messagesLoaded, setMessagesLoaded] = useState(false)

    // Build a userId → UserProfile lookup map shared across both tabs
    const usersById = useMemo<Record<string, UserProfile>>(() => {
      return rawUsers.reduce((acc, u) => ({ ...acc, [u.id]: u }), {})
    }, [rawUsers])

    // Fetch chat details and all users on mount
    useEffect(() => {
      if (id) fetchChatById(id)
      fetchProfiles("", 0, 1000) // load all users for lookup
    }, [id])

    // Map chat detail to local state
    useEffect(() => {
      if (chatDetail) {
        const c = chatDetail.chat || chatDetail
        setChat({
          id: c.id,
          status: c.status ?? true,
          type: c.type || "PRIVATE",
          name: c.name || "",
          avatar: c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`,
          initiator_id: c.initiatorId || c.initiator_id,
          newest_message_id: c.newestMessageId || c.newest_message_id,
          newest_message_date: c.newestMessageDate || c.newest_message_date,
          created_date: c.createdDate || c.created_date,
          updated_date: c.updatedDate || c.updated_date,
        })
      }
    }, [chatDetail])

    // Load members on mount (default tab)
    useEffect(() => {
      if (id && !membersLoaded) {
        fetchMembersByChat(id).then(() => setMembersLoaded(true))
      }
    }, [id])

    // Lazy-load messages on first visit to messages tab
    useEffect(() => {
      if (activeTab === "messages" && !messagesLoaded && id) {
        fetchByChat(id).then(() => setMessagesLoaded(true))
      }
    }, [activeTab, messagesLoaded, id])

    // Map raw members API response to local type
    useEffect(() => {
      if (rawMembers.length > 0) {
        setMembers(rawMembers.map((m: any) => ({
          member_id: m.memberId || m.member_id,
          member_name: m.memberName || m.member_name || "Unknown",
          member_avatar: m.memberAvatar || m.member_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.memberId || m.member_id}`,
          chat_id: m.chatId || m.chat_id,
          role: m.role,
          nickname: m.nickname ?? null,
          inviter_id: m.inviterId || m.inviter_id || null,
          inviter_name: m.inviterName || m.inviter_name || null,
          join_date: m.joinDate || m.join_date,
        })))
      }
    }, [rawMembers])

    // Map raw messages API response to local type
    useEffect(() => {
      if (rawMessages.length > 0) {
        setMessages(rawMessages.map((ms: any) => ({
          id: ms.id,
          chat_id: ms.chatId || ms.chat_id,
          status: ms.status ?? true,
          state: ms.state || "ORIGIN",
          type: ms.type || "TEXT",
          content: ms.content || "",
          sender_id: ms.senderId || ms.sender_id,
          sender_name: ms.senderName || ms.sender_name || "Unknown",
          sender_avatar: ms.senderAvatar || ms.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ms.senderId || ms.sender_id}`,
          predecessor_id: ms.predecessorId || ms.predecessor_id || null,
          sent_date: ms.sentDate || ms.sent_date || null,
          removed_date: ms.removedDate || ms.removed_date || null,
          created_date: ms.createdDate || ms.created_date,
        })))
      }
    }, [rawMessages])

    // ── Exposed WebSocket update methods ────────────────────────────────────
    useImperativeHandle(ref, () => ({

      addMessage: (msg) =>
        setMessages(prev => [...prev, msg]),

      updateMessage: (msg) =>
        setMessages(prev => prev.map(m => m.id === msg.id ? msg : m)),

      removeMessage: (id) =>
        setMessages(prev => prev.filter(m => m.id !== id)),

      addMember: (m) =>
        setMembers(prev => [...prev, m]),

      updateMember: (m) =>
        setMembers(prev => prev.map(x => x.member_id === m.member_id ? m : x)),

      removeMember: (memberId) =>
        setMembers(prev => prev.filter(m => m.member_id !== memberId)),

    }))

    if (loading || !chat) {
      return <div className="flex items-center justify-center h-full w-full bg-background"><span className="text-muted-foreground">Loading chat details...</span></div>
    }

    return (
      <div className="flex flex-col h-full w-full overflow-hidden rounded-xl bg-background">

        {/* ── Top bar ── */}
        <AdminContentTopBar
          icon={<MessageSquare size={18} />}
          title="Chat Detail"
          subtitle={chat.id}
          buttons={[
          {
            label: chat.status ? "Deactivate" : "Activate",
            icon: chat.status ? <PowerOff size={13} /> : <Power size={13} />,
            colorClass: chat.status
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "border-green-500/40 text-green-600 hover:bg-green-500/10 dark:text-green-400",
            onClick: () => {
              updateStatus(chat.id, !chat.status);
              setChat(prev => prev ? ({ ...prev, status: !prev.status }) : null)
            }
          }
        ]}
        />

        {/* ── Chat Info ── */}
        <div className="shrink-0 border-b border-border bg-muted/20">
          <div className="px-6 py-5 flex items-start gap-5">

            {/* Avatar */}
            <Avatar className="w-16 h-16 border-2 border-border shrink-0">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback className="text-xl bg-muted">{chat.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>

            {/* Info grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-bold text-foreground">{chat.name || "—"}</h2>
                <Badge variant="outline" className={`text-xs ${chat.type === "GROUP"
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}>
                  {chat.type}
                </Badge>
                <Badge variant="outline" className={`text-xs ${chat.status
                  ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}>
                  {chat.status ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 mt-3">
                <InfoRow icon={<Hash size={13} />}         label="Chat ID"           value={<span className="font-mono text-xs">{chat.id}</span>} />
                <InfoRow icon={<User size={13} />}         label="Initiator"         value={<span className="font-mono text-xs">{chat.initiator_id}</span>} />
                <InfoRow icon={<MessageSquare size={13} />} label="Newest Message"   value={chat.newest_message_id ? <span className="font-mono text-xs">{chat.newest_message_id}</span> : "—"} />
                <InfoRow icon={<Clock size={13} />}        label="Newest Msg Date"   value={chat.newest_message_date ? format(new Date(chat.newest_message_date), "dd MMM yyyy, HH:mm") : "—"} />
                <InfoRow icon={<Clock size={13} />}        label="Created"           value={format(new Date(chat.created_date), "dd MMM yyyy, HH:mm")} />
                <InfoRow icon={<Clock size={13} />}        label="Updated"           value={format(new Date(chat.updated_date), "dd MMM yyyy, HH:mm")} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0 px-6 py-4 gap-3">
          <TabsList className="w-full justify-start bg-muted/40 border border-border shrink-0">
            <TabsTrigger value="members" className="gap-2 text-xs">
              <Users size={13} />
              Members
              {membersLoaded && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{members.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2 text-xs">
              <MessageSquare size={13} />
              Messages
              {messagesLoaded && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{messages.length}</span>}
            </TabsTrigger>
          </TabsList>

          {/* ── Members Table ── */}
          <TabsContent value="members" className="flex-1 min-h-0 mt-0">
            <div className="h-full rounded-xl border border-border overflow-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                    {["Member", "Role", "Nickname", "Inviter", "Join Date"].map(h => (
                      <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 text-sm text-muted-foreground">Loading members...</TableCell>
                    </TableRow>
                  ) : members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 text-sm text-muted-foreground">No members</TableCell>
                    </TableRow>
                  ) : members.map((m, i) => {
                    const userProfile = usersById[m.member_id]
                    const displayName   = userProfile?.name    || m.member_name
                    const displayAvatar = userProfile?.avatar  || m.member_avatar
                    const inviterProfile = m.inviter_id ? usersById[m.inviter_id] : null
                    const inviterName   = inviterProfile?.name  || m.inviter_name
                    return (
                    <TableRow key={m.member_id} onClick={() => navigate(`/admin/user/${m.member_id}`)} className={`border-b border-border hover:bg-accent transition-colors cursor-pointer ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                      {/* Member */}
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7 border border-border shrink-0">
                            <AvatarImage src={displayAvatar} />
                            <AvatarFallback className="text-xs bg-muted">{displayName?.[0] ?? '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">{displayName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{m.member_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      {/* Role */}
                      <TableCell className="px-4 py-3"><RoleBadge role={m.role} /></TableCell>
                      {/* Nickname */}
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {m.nickname ?? <span className="text-muted-foreground/40">—</span>}
                      </TableCell>
                      {/* Inviter */}
                      <TableCell className="px-4 py-3">
                        {m.inviter_id ? (
                          <div>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">{inviterName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{m.inviter_id}</p>
                          </div>
                        ) : <span className="text-xs text-muted-foreground/40">—</span>}
                      </TableCell>
                      {/* Join date */}
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {m.join_date ? format(new Date(m.join_date), "dd MMM yyyy, HH:mm") : "—"}
                      </TableCell>
                    </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Messages Table ── */}
          <TabsContent value="messages" className="flex-1 min-h-0 mt-0">
            <div className="h-full rounded-xl border border-border overflow-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                    {["ID", "Sender", "Type", "Content", "Status", "State", "Reply To", "Sent Date", "Removed Date", "Created Date"].map(h => (
                      <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messagesLoading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-16 text-sm text-muted-foreground">Loading messages...</TableCell>
                    </TableRow>
                  ) : messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-16 text-sm text-muted-foreground">No messages</TableCell>
                    </TableRow>
                  ) : messages.map((msg, i) => {
                    const senderProfile = usersById[msg.sender_id]
                    const senderName   = senderProfile?.name   || msg.sender_name
                    const senderAvatar = senderProfile?.avatar || msg.sender_avatar
                    return (
                    <TableRow key={msg.id} onClick={() => navigate(`/admin/message/${msg.id}`)} className={`border-b border-border hover:bg-accent transition-colors cursor-pointer ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                      {/* ID */}
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{msg.id}</span>
                      </TableCell>
                      {/* Sender */}
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-border shrink-0">
                            <AvatarImage src={senderAvatar} />
                            <AvatarFallback className="text-xs bg-muted">{senderName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">{senderName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{msg.sender_id}</p>

                          </div>
                        </div>
                      </TableCell>
                      {/* Type */}
                      <TableCell className="px-4 py-3"><MessageTypeBadge type={msg.type} /></TableCell>
                      {/* Content */}
                      <TableCell className="px-4 py-3 max-w-[240px]">
                        <p className={`text-xs truncate ${!msg.status ? "text-muted-foreground/50 italic" : "text-foreground"}`}>
                          {msg.content}
                        </p>
                      </TableCell>
                      {/* Status */}
                      <TableCell className="px-4 py-3">
                        {msg.status
                          ? <Badge variant="outline" className="text-xs border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400">Active</Badge>
                          : <Badge variant="outline" className="text-xs border-destructive/40 bg-destructive/10 text-destructive gap-1">Inactive</Badge>
                        }
                      </TableCell>
                      {/* State */}
                      <TableCell className="px-4 py-3"><MessageStateBadge state={msg.state} /></TableCell>
                      {/* Reply to */}
                      <TableCell className="px-4 py-3">
                        {msg.predecessor_id
                          ? <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{msg.predecessor_id}</span>
                          : <span className="text-xs text-muted-foreground/40">—</span>
                        }
                      </TableCell>
                      {/* Sent date */}
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {msg.sent_date ? format(new Date(msg.sent_date), "dd MMM yyyy, HH:mm") : "—"}
                      </TableCell>
                      {/* Removed date */}
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {msg.removed_date ? format(new Date(msg.removed_date), "dd MMM yyyy, HH:mm") : <span className="text-muted-foreground/40">—</span>}
                      </TableCell>
                      {/* Created date */}
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(msg.created_date), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                    </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    )
  }
)

AdminChatDetails.displayName = "ChatDetail"
export default AdminChatDetails
