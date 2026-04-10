import { useState, useImperativeHandle, forwardRef } from "react"
import { useNavigate } from "react-router-dom"
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
type MessageType    = "CHAT_NOTIFICATION" | "TEXT" | "IMG" | "VID" | "DOC"

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

const MOCK_CHAT: Chat = {
  id: "CH002",
  status: true,
  type: "GROUP",
  name: "Nhóm dự án Alpha",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G1",
  initiator_id: "ACC000000000007",
  newest_message_id: "MSG205",
  newest_message_date: "2024-11-01T18:20:00",
  created_date: "2023-06-01T08:00:00",
  updated_date: "2024-11-01T18:20:00",
}

const MOCK_MEMBERS: ChatMember[] = [
  { member_id: "ACC000000000007", member_name: "Đặng Quốc Giang",  member_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  chat_id: "CH002", role: "OWNER",  nickname: "Giang Boss",  inviter_id: null,              inviter_name: null,             join_date: "2023-06-01T08:00:00" },
  { member_id: "ACC000000000001", member_name: "Nguyễn Văn An",    member_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",  chat_id: "CH002", role: "ADMIN",  nickname: null,          inviter_id: "ACC000000000007", inviter_name: "Đặng Quốc Giang", join_date: "2023-06-01T08:05:00" },
  { member_id: "ACC000000000002", member_name: "Trần Thị Bình",    member_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",  chat_id: "CH002", role: "MEMBER", nickname: "Bình dev",    inviter_id: "ACC000000000001", inviter_name: "Nguyễn Văn An",   join_date: "2023-06-02T09:00:00" },
  { member_id: "ACC000000000009", member_name: "Ngô Thanh Hùng",   member_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",  chat_id: "CH002", role: "MEMBER", nickname: null,          inviter_id: "ACC000000000007", inviter_name: "Đặng Quốc Giang", join_date: "2023-06-03T10:30:00" },
  { member_id: "ACC000000000004", member_name: "Phạm Thị Dung",    member_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",  chat_id: "CH002", role: "MEMBER", nickname: "Dung UI",     inviter_id: "ACC000000000002", inviter_name: "Trần Thị Bình",   join_date: "2023-06-05T14:00:00" },
]

const MOCK_MESSAGES: Message[] = [
  { id: "MSG201", chat_id: "CH002", status: true,  state: "ORIGIN",      type: "TEXT",  content: "Chào mọi người! Bắt đầu dự án thôi nào.",            sender_id: "ACC000000000007", sender_name: "Đặng Quốc Giang", sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", predecessor_id: null,     sent_date: "2023-06-01T08:10:00", removed_date: null, created_date: "2023-06-01T08:10:00" },
  { id: "MSG202", chat_id: "CH002", status: true,  state: "ORIGIN",      type: "TEXT",  content: "Có mặt! Mình sẵn sàng rồi.",                          sender_id: "ACC000000000001", sender_name: "Nguyễn Văn An",   sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", predecessor_id: "MSG201", sent_date: "2023-06-01T08:12:00", removed_date: null, created_date: "2023-06-01T08:12:00" },
  { id: "MSG203", chat_id: "CH002", status: true,  state: "REMOVED",      type: "IMG", content: "[Hình ảnh: mockup_v1.png]",                           sender_id: "ACC000000000002", sender_name: "Trần Thị Bình",   sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2", predecessor_id: "MSG202", sent_date: "2023-06-01T09:00:00", removed_date: null, created_date: "2023-06-01T09:00:00" },
  { id: "MSG204", chat_id: "CH002", status: false, state: "ORIGIN", type: "TEXT",  content: "[Tin nhắn đã bị xóa]",                                sender_id: "ACC000000000009", sender_name: "Ngô Thanh Hùng",  sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9", predecessor_id: "MSG203", sent_date: "2023-06-02T10:15:00", removed_date: "2023-06-02T10:20:00", created_date: "2023-06-02T10:15:00" },
  { id: "MSG205", chat_id: "CH002", status: true,  state: "ORIGIN", type: "TEXT",  content: "Deadline tuần tới mọi người nhớ chuẩn bị báo cáo nhé.", sender_id: "ACC000000000007", sender_name: "Đặng Quốc Giang", sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", predecessor_id: "MSG204", sent_date: "2024-11-01T18:20:00", removed_date: null, created_date: "2024-11-01T18:20:00" },
]

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
    CHAT_NOTIFICATION: "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  }
  return <Badge variant="outline" className={`text-xs ${map[type]}`}>{type}</Badge>
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminChatDetails = forwardRef<ChatDetailHandle, { chat?: Chat; initialMembers?: ChatMember[]; initialMessages?: Message[] }>(
  ({ chat: initialChat = MOCK_CHAT, initialMembers = MOCK_MEMBERS, initialMessages = MOCK_MESSAGES }, ref) => {
    const navigate = useNavigate()
    const [chat, setChat] = useState<Chat>(initialChat)
    const [members,  setMembers]  = useState<ChatMember[]>(initialMembers)
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [toggleOpen, setToggleOpen] = useState(false)

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
            onClick: () => setChat(prev => ({ ...prev, status: !prev.status }))
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
        <Tabs defaultValue="members" className="flex flex-col flex-1 min-h-0 px-6 py-4 gap-3">
          <TabsList className="w-full justify-start bg-muted/40 border border-border shrink-0">
            <TabsTrigger value="members" className="gap-2 text-xs">
              <Users size={13} />
              Members
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{members.length}</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2 text-xs">
              <MessageSquare size={13} />
              Messages
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{messages.length}</span>
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
                  {members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 text-sm text-muted-foreground">No members</TableCell>
                    </TableRow>
                  ) : members.map((m, i) => (
                    <TableRow key={m.member_id} onClick={() => navigate(`/admin/user/${m.member_id}`)} className={`border-b border-border hover:bg-accent transition-colors cursor-pointer ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                      {/* Member */}
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7 border border-border shrink-0">
                            <AvatarImage src={m.member_avatar} />
                            <AvatarFallback className="text-xs bg-muted">{m.member_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">{m.member_name}</p>
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
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">{m.inviter_name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{m.inviter_id}</p>
                          </div>
                        ) : <span className="text-xs text-muted-foreground/40">—</span>}
                      </TableCell>
                      {/* Join date */}
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(m.join_date), "dd MMM yyyy, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-16 text-sm text-muted-foreground">No messages</TableCell>
                    </TableRow>
                  ) : messages.map((msg, i) => (
                    <TableRow key={msg.id} onClick={() => navigate(`/admin/message/${msg.id}`)} className={`border-b border-border hover:bg-accent transition-colors cursor-pointer ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                      {/* ID */}
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{msg.id}</span>
                      </TableCell>
                      {/* Sender */}
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-border shrink-0">
                            <AvatarImage src={msg.sender_avatar} />
                            <AvatarFallback className="text-xs bg-muted">{msg.sender_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">{msg.sender_name}</p>
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
                  ))}
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
