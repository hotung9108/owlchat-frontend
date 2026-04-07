import { useState } from "react"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft, User, Mail, Phone, Calendar, Shield, Users, UserPlus,
  Ban, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle,
  Pencil, PowerOff, Power, Upload
} from "lucide-react"
import { format } from "date-fns"


// ── Types ─────────────────────────────────────────────────────────────────────

type UserProfile = {
  id: string
  status: boolean
  role: "ADMIN" | "USER" | "MODERATOR"
  name: string
  gender: boolean
  date_of_birth: string
  avatar: string
  email: string
  phone_number: string
  created_date: string
  updated_date: string
}

type Friendship = {
  id: string
  first_user_id: string; first_user_name: string; first_user_avatar: string
  second_user_id: string; second_user_name: string; second_user_avatar: string
  created_date: string
}

type FriendRequest = {
  id: string
  sender_id: string; sender_name: string; sender_avatar: string
  receiver_id: string; receiver_name: string; receiver_avatar: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
  created_date: string; updated_date: string
}

type Block = {
  id: string
  blocker_id: string; blocker_name: string; blocker_avatar: string
  blocked_id: string; blocked_name: string; blocked_avatar: string
  created_date: string
}

type Chat = {
  id: string; status: boolean; type: "PRIVATE" | "GROUP"
  name: string; avatar: string; initiator_id: string
  newest_message_id: string; newest_message_date: string
  created_date: string; updated_date: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const INITIAL_USER: UserProfile = {
  id: "ACC000000000007", status: true, role: "USER",
  name: "Đặng Quốc Giang", gender: true, date_of_birth: "1988-12-22",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
  email: "giang.dang@email.com", phone_number: "0901234567",
  created_date: "2023-01-15T08:30:00", updated_date: "2024-11-02T14:20:00",
}

const FRIENDS: Friendship[] = [
  { id: "FR001", first_user_id: "ACC000000000007", first_user_name: "Đặng Quốc Giang", first_user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  second_user_id: "ACC000000000001", second_user_name: "Nguyễn Văn An",   second_user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",  created_date: "2023-03-10T10:00:00" },
  { id: "FR002", first_user_id: "ACC000000000002", first_user_name: "Trần Thị Bình",   first_user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",  second_user_id: "ACC000000000007", second_user_name: "Đặng Quốc Giang", second_user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  created_date: "2023-05-18T15:30:00" },
  { id: "FR003", first_user_id: "ACC000000000007", first_user_name: "Đặng Quốc Giang", first_user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  second_user_id: "ACC000000000009", second_user_name: "Ngô Thanh Hùng",  second_user_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",  created_date: "2024-01-05T09:15:00" },
]

const FRIEND_REQUESTS: FriendRequest[] = [
  { id: "RQ001", sender_id: "ACC000000000007", sender_name: "Đặng Quốc Giang", sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  receiver_id: "ACC000000000004", receiver_name: "Phạm Thị Dung",   receiver_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",  status: "PENDING",  created_date: "2024-11-01T09:00:00", updated_date: "2024-11-01T09:00:00" },
  { id: "RQ002", sender_id: "ACC000000000010", sender_name: "Đinh Thị Lan",    sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=10", receiver_id: "ACC000000000007", receiver_name: "Đặng Quốc Giang", receiver_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  status: "PENDING",  created_date: "2024-10-28T14:00:00", updated_date: "2024-10-28T14:00:00" },
  { id: "RQ003", sender_id: "ACC000000000007", sender_name: "Đặng Quốc Giang", sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  receiver_id: "ACC000000000012", receiver_name: "Lý Thị Ngọc",    receiver_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=12", status: "ACCEPTED", created_date: "2024-09-15T11:00:00", updated_date: "2024-09-16T08:30:00" },
  { id: "RQ004", sender_id: "ACC000000000005", sender_name: "Hoàng Văn Em",    sender_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",  receiver_id: "ACC000000000007", receiver_name: "Đặng Quốc Giang", receiver_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  status: "REJECTED", created_date: "2024-08-20T16:00:00", updated_date: "2024-08-21T10:00:00" },
]

const BLOCKS: Block[] = [
  { id: "BL001", blocker_id: "ACC000000000007", blocker_name: "Đặng Quốc Giang", blocker_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", blocked_id: "ACC000000000003", blocked_name: "Lê Minh Cường",   blocked_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", created_date: "2024-06-10T12:00:00" },
  { id: "BL002", blocker_id: "ACC000000000008", blocker_name: "Bùi Thị Hoa",     blocker_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8", blocked_id: "ACC000000000007", blocked_name: "Đặng Quốc Giang", blocked_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", created_date: "2024-07-22T09:30:00" },
]

const CHATS: Chat[] = [
  { id: "CH001", status: true,  type: "PRIVATE", name: "Nguyễn Văn An",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",  initiator_id: "ACC000000000007", newest_message_id: "MSG100", newest_message_date: "2024-11-02T13:45:00", created_date: "2023-03-10T10:05:00", updated_date: "2024-11-02T13:45:00" },
  { id: "CH002", status: true,  type: "GROUP",   name: "Nhóm dự án Alpha", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G1", initiator_id: "ACC000000000007", newest_message_id: "MSG200", newest_message_date: "2024-11-01T18:20:00", created_date: "2023-06-01T08:00:00", updated_date: "2024-11-01T18:20:00" },
  { id: "CH003", status: false, type: "PRIVATE", name: "Trần Thị Bình",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",  initiator_id: "ACC000000000002", newest_message_id: "MSG300", newest_message_date: "2024-09-30T11:10:00", created_date: "2023-05-18T15:35:00", updated_date: "2024-09-30T11:10:00" },
  { id: "CH004", status: true,  type: "GROUP",   name: "Gia đình",          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G2", initiator_id: "ACC000000000001", newest_message_id: "MSG400", newest_message_date: "2024-10-15T20:00:00", created_date: "2022-12-25T00:00:00", updated_date: "2024-10-15T20:00:00" },
]

// ── Helper Components ─────────────────────────────────────────────────────────

function UserCell({ name, avatar, id }: { name: string; avatar: string; id: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="w-7 h-7 border border-border">
        <AvatarImage src={avatar} />
        <AvatarFallback className="text-xs bg-muted">{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-xs font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{id}</p>
      </div>
    </div>
  )
}

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-foreground pl-5">{value}</p>
    </div>
  )
}

function RequestStatusBadge({ status }: { status: FriendRequest["status"] }) {
  if (status === "PENDING")  return <Badge variant="outline" className="text-xs gap-1 border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"><AlertCircle size={10} />Pending</Badge>
  if (status === "ACCEPTED") return <Badge variant="outline" className="text-xs gap-1 border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"><CheckCircle2 size={10} />Accepted</Badge>
  return <Badge variant="outline" className="text-xs gap-1 border-destructive/40 bg-destructive/10 text-destructive"><XCircle size={10} />Rejected</Badge>
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminContentUser() {
  const { id } = useParams<{ id: string }>()

  // ── State ──────────────────────────────────────────────────────────────────
  const [user, setUser]                   = useState<UserProfile>(INITIAL_USER)
  const [activeTab, setActiveTab]         = useState("friends")

  // Edit dialog
  const [editOpen, setEditOpen]           = useState(false)
  const [editForm, setEditForm]           = useState<Omit<UserProfile, "id" | "created_date" | "updated_date">>({
    status:        user.status,
    role:          user.role,
    name:          user.name,
    gender:        user.gender,
    date_of_birth: user.date_of_birth,
    avatar:        user.avatar,
    email:         user.email,
    phone_number:  user.phone_number,
  })

  // Activate/deactivate confirm dialog
  const [toggleOpen, setToggleOpen]       = useState(false)

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openEdit = () => {
    // reset form to current user values each time dialog opens
    setEditForm({
      status:        user.status,
      role:          user.role,
      name:          user.name,
      gender:        user.gender,
      date_of_birth: user.date_of_birth,
      avatar:        user.avatar,
      email:         user.email,
      phone_number:  user.phone_number,
    })
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    setUser(prev => ({
      ...prev,
      ...editForm,
      updated_date: new Date().toISOString(),
    }))
    setEditOpen(false)
  }

  const handleToggleStatus = () => {
    setUser(prev => ({
      ...prev,
      status: !prev.status,
      updated_date: new Date().toISOString(),
    }))
    setToggleOpen(false)
  }

  const [avatarError, setAvatarError] = useState("")

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft size={16} />
        </Button>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-foreground">User Detail</h1>
          <p className="text-xs text-muted-foreground font-mono">{id}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={openEdit}>
            <Pencil size={13} />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 text-xs ${user.status
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "border-green-500/40 text-green-600 hover:bg-green-500/10 dark:text-green-400"
            }`}
            onClick={() => setToggleOpen(true)}
          >
            {user.status ? <><PowerOff size={13} /> Deactivate</> : <><Power size={13} /> Activate</>}
          </Button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

          {/* ── Profile Card ── */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <Avatar className="w-20 h-20 border-4 border-background shadow-md">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xl bg-muted">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 pb-1">
                  <Badge variant="outline" className={user.status
                    ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-destructive/40 bg-destructive/10 text-destructive"}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                    {user.role}
                  </Badge>
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{user.id}</p>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoField icon={<Mail size={14} />}     label="Email"         value={user.email || "—"} />
                <InfoField icon={<Phone size={14} />}    label="Phone"         value={user.phone_number} />
                <InfoField icon={<User size={14} />}     label="Gender"        value={user.gender ? "Male" : "Female"} />
                <InfoField icon={<Calendar size={14} />} label="Date of Birth" value={format(new Date(user.date_of_birth), "dd MMM yyyy")} />
                <InfoField icon={<Shield size={14} />}   label="Role"          value={user.role} />
                <InfoField icon={<Clock size={14} />}    label="Created"       value={format(new Date(user.created_date), "dd MMM yyyy, HH:mm")} />
                <InfoField icon={<Clock size={14} />}    label="Last Updated"  value={format(new Date(user.updated_date), "dd MMM yyyy, HH:mm")} />
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-muted/40 border border-border">
              <TabsTrigger value="friends"  className="gap-2 text-xs"><Users size={13} /> Friends <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{FRIENDS.length}</span></TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 text-xs"><UserPlus size={13} /> Requests <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{FRIEND_REQUESTS.length}</span></TabsTrigger>
              <TabsTrigger value="blocks"   className="gap-2 text-xs"><Ban size={13} /> Blocks <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{BLOCKS.length}</span></TabsTrigger>
              <TabsTrigger value="chats"    className="gap-2 text-xs"><MessageSquare size={13} /> Chats <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{CHATS.length}</span></TabsTrigger>
            </TabsList>

            {/* Friends */}
            <TabsContent value="friends" className="mt-4">
              <div className="rounded-xl border border-border overflow-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                      {["ID", "First User", "Second User", "Created Date"].map(h => (
                        <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {FRIENDS.map((f, i) => (
                      <TableRow key={f.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{f.id}</span></TableCell>
                        <TableCell className="px-4 py-3"><UserCell name={f.first_user_name}  avatar={f.first_user_avatar}  id={f.first_user_id} /></TableCell>
                        <TableCell className="px-4 py-3"><UserCell name={f.second_user_name} avatar={f.second_user_avatar} id={f.second_user_id} /></TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(f.created_date), "dd MMM yyyy, HH:mm")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Friend Requests */}
            <TabsContent value="requests" className="mt-4">
              <div className="rounded-xl border border-border overflow-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                      {["ID", "Sender", "Receiver", "Status", "Created Date", "Updated Date"].map(h => (
                        <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {FRIEND_REQUESTS.map((r, i) => (
                      <TableRow key={r.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{r.id}</span></TableCell>
                        <TableCell className="px-4 py-3"><UserCell name={r.sender_name}   avatar={r.sender_avatar}   id={r.sender_id} /></TableCell>
                        <TableCell className="px-4 py-3"><UserCell name={r.receiver_name} avatar={r.receiver_avatar} id={r.receiver_id} /></TableCell>
                        <TableCell className="px-4 py-3"><RequestStatusBadge status={r.status} /></TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(r.created_date), "dd MMM yyyy, HH:mm")}</TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(r.updated_date), "dd MMM yyyy, HH:mm")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Blocks */}
            <TabsContent value="blocks" className="mt-4">
              <div className="rounded-xl border border-border overflow-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                      {["ID", "Blocker", "Blocked", "Created Date"].map(h => (
                        <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BLOCKS.map((b, i) => (
                      <TableRow key={b.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{b.id}</span></TableCell>
                        <TableCell className="px-4 py-3"><UserCell name={b.blocker_name} avatar={b.blocker_avatar} id={b.blocker_id} /></TableCell>
                        <TableCell className="px-4 py-3"><UserCell name={b.blocked_name} avatar={b.blocked_avatar} id={b.blocked_id} /></TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(b.created_date), "dd MMM yyyy, HH:mm")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Chats */}
            <TabsContent value="chats" className="mt-4">
              <div className="rounded-xl border border-border overflow-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                      {["ID", "Chat", "Type", "Status", "Initiator", "Latest Message", "Created Date"].map(h => (
                        <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CHATS.map((c, i) => (
                      <TableRow key={c.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{c.id}</span></TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7 border border-border">
                              <AvatarImage src={c.avatar} />
                              <AvatarFallback className="text-xs bg-muted">{c.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground whitespace-nowrap">{c.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs ${c.type === "GROUP" ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"}`}>{c.type}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className={`text-xs ${c.status ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400" : "border-destructive/40 bg-destructive/10 text-destructive"}`}>{c.status ? "Active" : "Inactive"}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3"><span className="text-xs font-mono text-muted-foreground">{c.initiator_id}</span></TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.newest_message_date ? format(new Date(c.newest_message_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(c.created_date), "dd MMM yyyy, HH:mm")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Edit Profile Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update user information. ID cannot be changed.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* ID — readonly */}
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">ID (read-only)</Label>
              <Input value={user.id} disabled className="font-mono text-xs bg-muted" />
            </div>

            {/* Name */}
            <div className="grid gap-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
              />
            </div>

            {/* Email */}
            <div className="grid gap-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                value={editForm.email}
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                type="email"
              />
            </div>

            {/* Phone */}
            <div className="grid gap-1.5">
              <Label className="text-xs">Phone Number</Label>
              <Input
                value={editForm.phone_number}
                onChange={e => setEditForm(f => ({ ...f, phone_number: e.target.value }))}
                placeholder="0901234567"
              />
            </div>

            {/* Date of Birth */}
            <div className="grid gap-1.5">
              <Label className="text-xs">Date of Birth</Label>
              <Input
                type="date"
                value={editForm.date_of_birth}
                onChange={e => setEditForm(f => ({ ...f, date_of_birth: e.target.value }))}
              />
            </div>

            {/* Gender + Role row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Gender</Label>
                <Select
                  value={editForm.gender ? "male" : "female"}
                  onValueChange={v => setEditForm(f => ({ ...f, gender: v === "male" }))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="grid gap-1.5">
                <Label className="text-xs">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={v => setEditForm(f => ({ ...f, role: v as UserProfile["role"] }))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="MODERATOR">MODERATOR</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            {/* Avatar Upload */}
            <div className="grid gap-1.5">
                <Label className="text-xs">Avatar</Label>
                <div className="flex gap-3 items-center">

                    {/* Avatar preview */}
                    <Avatar className="w-14 h-14 border border-border shrink-0">
                    <AvatarImage src={editForm.avatar} />
                    <AvatarFallback className="text-lg bg-muted">{editForm.name[0]}</AvatarFallback>
                    </Avatar>

                    {/* Upload area */}
                    <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        className="hidden"
                        onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        // check max size 25MB
                        if (file.size > 25 * 1024 * 1024) {
                            setAvatarError("Image must be under 25MB")
                            e.target.value = ""
                            return
                        }

                        setAvatarError("")

                        // convert to base64 so we can preview it
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                            setEditForm(f => ({ ...f, avatar: ev.target?.result as string }))
                        }
                        reader.readAsDataURL(file)
                        e.target.value = ""
                        }}
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="flex flex-col items-center justify-center w-full h-20 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/60 cursor-pointer transition-colors"
                    >
                        <Upload size={16} className="text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Click to upload</span>
                        <span className="text-xs text-muted-foreground/60">PNG, JPG, GIF — max 25MB</span>
                    </label>

                    {/* Error message */}
                    {avatarError && (
                        <p className="text-xs text-destructive mt-1">{avatarError}</p>
                    )}
                    </div>
                </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Activate / Deactivate Confirm Dialog ── */}
      <AlertDialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.status ? "Deactivate User?" : "Activate User?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.status
                ? `This will deactivate ${user.name}'s account. They will lose access to the platform immediately.`
                : `This will reactivate ${user.name}'s account and restore their access to the platform.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={user.status ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-green-600 hover:bg-green-700 text-white"}
              onClick={handleToggleStatus}
            >
              {user.status ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
