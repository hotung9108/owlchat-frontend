import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { userProfileService } from "@/services/user-profile-service"
import { chatAdminService } from "@/services/chat-admin-service"
import { useAccountService } from "@/hooks/use-account"
import { useFriendshipAdminService } from "@/hooks/use-friendship-admin"
import { useFriendRequestService } from "@/hooks/use-friend-request-admin"
import { useBlockService } from "@/hooks/use-block-admin"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useMemberAdminService } from "@/hooks/use-chat-member-admin"
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
  User, Mail, Phone, Calendar, Shield, Users, UserPlus,
  Ban, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle,
  Pencil, PowerOff, Power, Upload,
  Plus
} from "lucide-react"
import { format } from "date-fns"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"

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
  const navigate = useNavigate()
  const { updateStatus, updateRole } = useAccountService()
  {/* NEW HOOK */}
  const { fetchProfileById } = useUserProfile()
  const { remove: removeChatMember } = useMemberAdminService()

  // ── State ──────────────────────────────────────────────────────────────────
  const [user, setUser]                   = useState<UserProfile>(INITIAL_USER)
  const [activeTab, setActiveTab]         = useState("friends")
  const [isLoading, setIsLoading]         = useState(true)

  // Shared Users Cache
  const [userCache, setUserCache] = useState<Record<string, any>>({})

  const loadMissingUsers = async (ids: string[]) => {
    const missingIds = ids.filter(userId => userId && !userCache[userId])
    if (missingIds.length === 0) return

    const uniqueMissing = Array.from(new Set(missingIds))
    const results = await Promise.allSettled(uniqueMissing.map(userId => fetchProfileById(userId as string)))
    
    const newCache: Record<string, any> = {}
    results.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value) {
        newCache[uniqueMissing[i]] = res.value
      }
    })
    
    if (Object.keys(newCache).length > 0) {
      setUserCache(prev => ({ ...prev, ...newCache }))
    }
  }

  const getCachedUser = (userId: string, fallbackName?: string, fallbackAvatar?: string) => {
    const cached = userCache[userId]
    return {
      name: cached?.name || fallbackName || "Unknown",
      avatar: cached?.avatar || fallbackAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
    }
  }

  const [chats, setChats]                 = useState<Chat[]>([])
  const [chatsLoaded, setChatsLoaded]     = useState(false)
  const [chatsLoading, setChatsLoading]   = useState(false)

  const { friendships, fetchByUser: fetchFriendships, loading: friendshipsLoading } = useFriendshipAdminService()
  const [friendshipsLoaded, setFriendshipsLoaded] = useState(false)

  const { requests, fetchByUser: fetchRequests, loading: requestsLoading } = useFriendRequestService()
  const [requestsLoaded, setRequestsLoaded] = useState(false)

  const { blocks, fetchBlockedByUser, loading: blocksLoading } = useBlockService()
  const [blocksLoaded, setBlocksLoaded] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setIsLoading(true)
        const data = await userProfileService.getProfileById(id)
        setUser({
            id: data.id,
            status: data.account?.status ?? false,
            role: (data.account?.role as any) ?? "USER",
            name: data.name,
            gender: data.gender ?? true,
            date_of_birth: data.dateOfBirth ?? "",
            avatar: data.avatar ?? "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
            email: data.email,
            phone_number: data.phoneNumber,
            created_date: data.createdDate ?? new Date().toISOString(),
            updated_date: data.updatedDate ?? new Date().toISOString(),
        })
      } catch (err) {
        console.error("Failed to load user profile:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [id])

  useEffect(() => {
    if (activeTab === "chats" && !chatsLoaded && id) {
      const fetchChats = async () => {
        try {
          setChatsLoading(true)
          const response = await chatAdminService.getChats({ initiatorId: id })
          const chatData = response.data?.content || response.data || []
          setChats(chatData.map((c: any) => ({
            id: c.id,
            status: c.status ?? true,
            type: c.type || "PRIVATE",
            name: c.name || "Unknown",
            avatar: c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`,
            initiator_id: c.initiatorId || c.initiator_id,
            newest_message_id: c.newestMessageId || c.newest_message_id,
            newest_message_date: c.newestMessageDate || c.newest_message_date,
            created_date: c.createdDate || c.created_date,
            updated_date: c.updatedDate || c.updated_date,
          })))
          setChatsLoaded(true)
        } catch (err) {
          console.error("Failed to load user chats", err)
        } finally {
          setChatsLoading(false)
        }
      }
      fetchChats()
    }
  }, [activeTab, chatsLoaded, id])

  useEffect(() => {
    if (activeTab === "friends" && !friendshipsLoaded && id) {
      fetchFriendships(id).then(() => setFriendshipsLoaded(true))
    }
  }, [activeTab, friendshipsLoaded, id])

  useEffect(() => {
    if (activeTab === "requests" && !requestsLoaded && id) {
      fetchRequests(id).then(() => setRequestsLoaded(true))
    }
  }, [activeTab, requestsLoaded, id])

  useEffect(() => {
    if (activeTab === "blocks" && !blocksLoaded && id) {
      fetchBlockedByUser(id).then(() => setBlocksLoaded(true))
    }
  }, [activeTab, blocksLoaded, id])

  useEffect(() => {
    if (friendships.length > 0) {
      const ids = friendships.flatMap(f => [f.firstUserId || f.first_user_id, f.secondUserId || f.second_user_id])
      loadMissingUsers(ids)
    }
  }, [friendships])

  useEffect(() => {
    if (requests.length > 0) {
      const ids = requests.flatMap(r => [r.senderId || r.sender_id, r.receiverId || r.receiver_id])
      loadMissingUsers(ids)
    }
  }, [requests])

  useEffect(() => {
    if (blocks.length > 0) {
      const ids = blocks.flatMap(b => [b.blockerId || b.blocker_id, b.blockedId || b.blocked_id])
      loadMissingUsers(ids)
    }
  }, [blocks])

  useEffect(() => {
    if (chats.length > 0) {
      const ids = chats.map(c => c.initiator_id)
      loadMissingUsers(ids)
    }
  }, [chats])

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

  // Role dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole]     = useState<"ADMIN" | "USER">("USER")

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

  const handleSaveEdit = async () => {
    try {
      await userProfileService.updateProfile(user.id, {
        name: editForm.name,
        gender: editForm.gender,
        dateOfBirth: editForm.date_of_birth,
        email: editForm.email,
        phoneNumber: editForm.phone_number,
      })
      setUser(prev => ({
        ...prev,
        ...editForm,
        updated_date: new Date().toISOString(),
      }))
      setEditOpen(false)
    } catch (err) {
      console.error("Failed to update profile", err)
    }
  }

  const handleToggleStatus = async () => {
    try {
      await updateStatus(user.id, !user.status)
      setUser(prev => ({
        ...prev,
        status: !prev.status,
        updated_date: new Date().toISOString(),
      }))
      setToggleOpen(false)
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleUpdateRole = async () => {
    try {
      await updateRole(user.id, selectedRole)
      setUser(prev => ({
        ...prev,
        role: selectedRole as any,
        updated_date: new Date().toISOString(),
      }))
      setRoleDialogOpen(false)
    } catch (err) {
      console.error("Failed to update role", err)
    }
  }

  const [avatarError, setAvatarError] = useState("")

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading && user.id === INITIAL_USER.id) {
    return <div className="flex items-center justify-center h-full w-full bg-background"><span className="text-muted-foreground">Loading user data...</span></div>
  }

  const handleLeaveChat = async (chatId: string) => {
    if (!id) return;
    try {
      await removeChatMember(id, chatId);

      // update UI (remove chat)
      setChats(prev => prev.filter(c => c.id !== chatId));

    } catch (err) {
      console.error(err);
      alert("Failed to leave chat");
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl bg-background">

      {/* ── Top bar ── */}
      <AdminContentTopBar
        icon={<User size={18} />}
        title="User Detail"
        subtitle={id}
        buttons={[
          {
            label: user.status ? "Deactivate" : "Activate",
            icon: user.status ? <PowerOff size={13} /> : <Power size={13} />,
            colorClass: user.status
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "border-green-500/40 text-green-600 hover:bg-green-500/10 dark:text-green-400",
            onClick: () => setToggleOpen(true)
          },
          {
            label: "Edit Profile",
            icon: <Pencil size={13} />,
            colorClass: "bg-primary text-primary hover:text-primary cursor-pointer",
            onClick: openEdit
          },
          {
            label: "Change Role",
            icon: <Shield size={13} />,
            colorClass: "bg-primary text-blue-400 hover:text-blue cursor-pointer",
            onClick: () => {
              setSelectedRole(user.role === "ADMIN" ? "ADMIN" : "USER")
              setRoleDialogOpen(true)
            }
          },
        ]}
      />

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-auto">
        <div className="w-full px-6 py-6 space-y-6">

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
                <InfoField icon={<Calendar size={14} />} label="Date of Birth" value={user.date_of_birth ? format(new Date(user.date_of_birth), "dd MMM yyyy") : ""} />
                <InfoField icon={<Shield size={14} />}   label="Role"          value={user.role} />
                <InfoField icon={<Clock size={14} />}    label="Created"       value={format(new Date(user.created_date), "dd MMM yyyy, HH:mm")} />
                <InfoField icon={<Clock size={14} />}    label="Last Updated"  value={format(new Date(user.updated_date), "dd MMM yyyy, HH:mm")} />
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-muted/40 border border-border">
              <TabsTrigger value="friends"  className="gap-2 text-xs"><Users size={13} /> Friends {friendshipsLoaded && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{friendships.length}</span>}</TabsTrigger>
              <TabsTrigger value="requests" className="gap-2 text-xs"><UserPlus size={13} /> Requests {requestsLoaded && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{requests.length}</span>}</TabsTrigger>
              <TabsTrigger value="blocks"   className="gap-2 text-xs"><Ban size={13} /> Blocks {blocksLoaded && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{blocks.length}</span>}</TabsTrigger>
              <TabsTrigger value="chats"    className="gap-2 text-xs"><MessageSquare size={13} /> Chats {chatsLoaded && <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{chats.length}</span>}</TabsTrigger>
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
                    {friendshipsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Loading friends...</TableCell>
                      </TableRow>
                    ) : friendships.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No friends found.</TableCell>
                      </TableRow>
                    ) : (
                      friendships.map((f, i) => {
                        const firstId = f.firstUserId || f.first_user_id;
                        const secondId = f.secondUserId || f.second_user_id;
                        const u1 = getCachedUser(firstId, f.firstUserName || f.first_user_name, f.firstUserAvatar || f.first_user_avatar);
                        const u2 = getCachedUser(secondId, f.secondUserName || f.second_user_name, f.secondUserAvatar || f.second_user_avatar);
                        return (
                          <TableRow key={f.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                            <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{f.id}</span></TableCell>
                            <TableCell className="px-4 py-3"><UserCell name={u1.name} avatar={u1.avatar} id={firstId} /></TableCell>
                            <TableCell className="px-4 py-3"><UserCell name={u2.name} avatar={u2.avatar} id={secondId} /></TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{f.createdDate || f.created_date ? format(new Date(f.createdDate || f.created_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
                    {requestsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Loading requests...</TableCell>
                      </TableRow>
                    ) : requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">No child requests found.</TableCell>
                      </TableRow>
                    ) : (
                      requests.map((r, i) => {
                        const senderId = r.senderId || r.sender_id;
                        const receiverId = r.receiverId || r.receiver_id;
                        const s = getCachedUser(senderId, r.senderName || r.sender_name, r.senderAvatar || r.sender_avatar);
                        const rec = getCachedUser(receiverId, r.receiverName || r.receiver_name, r.receiverAvatar || r.receiver_avatar);
                        return (
                          <TableRow key={r.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                            <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{r.id}</span></TableCell>
                            <TableCell className="px-4 py-3"><UserCell name={s.name} avatar={s.avatar} id={senderId} /></TableCell>
                            <TableCell className="px-4 py-3"><UserCell name={rec.name} avatar={rec.avatar} id={receiverId} /></TableCell>
                            <TableCell className="px-4 py-3"><RequestStatusBadge status={r.status} /></TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.createdDate || r.created_date ? format(new Date(r.createdDate || r.created_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.updatedDate || r.updated_date ? format(new Date(r.updatedDate || r.updated_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
                    {blocksLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Loading blocks...</TableCell>
                      </TableRow>
                    ) : blocks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No blocks found.</TableCell>
                      </TableRow>
                    ) : (
                      blocks.map((b, i) => {
                        const blockerId = b.blockerId || b.blocker_id;
                        const blockedId = b.blockedId || b.blocked_id;
                        const blker = getCachedUser(blockerId, b.blockerName || b.blocker_name, b.blockerAvatar || b.blocker_avatar);
                        const blked = getCachedUser(blockedId, b.blockedName || b.blocked_name, b.blockedAvatar || b.blocked_avatar);
                        return (
                          <TableRow key={b.id} className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                            <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{b.id}</span></TableCell>
                            <TableCell className="px-4 py-3"><UserCell name={blker.name} avatar={blker.avatar} id={blockerId} /></TableCell>
                            <TableCell className="px-4 py-3"><UserCell name={blked.name} avatar={blked.avatar} id={blockedId} /></TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{b.createdDate || b.created_date ? format(new Date(b.createdDate || b.created_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
                      {["ID", "Chat", "Type", "Status", "Initiator", "Latest Message", "Created Date", "Actions"].map(h => (
                        <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">Loading chats...</TableCell>
                      </TableRow>
                    ) : chats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">No chats found.</TableCell>
                      </TableRow>
                    ) : (
                      chats.map((c, i) => {
                        const initId = c.initiator_id;
                        const initiatorUser = initId ? getCachedUser(initId) : null;
                        return (
                          <TableRow key={c.id} onClick={() => navigate(`/admin/chat/${c.id}`)} className={`border-b border-border hover:bg-accent transition-colors cursor-pointer ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                            <TableCell className="px-4 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{c.id}</span></TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7 border border-border">
                                  <AvatarImage src={c.avatar} />
                                  <AvatarFallback className="text-xs bg-muted">{c.name?.[0] || '?'}</AvatarFallback>
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
                            <TableCell className="px-4 py-3">
                              {initiatorUser ? (
                                <UserCell name={initiatorUser.name} avatar={initiatorUser.avatar} id={initId} />
                              ) : (
                                <span className="text-xs font-mono text-muted-foreground">{initId}</span>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.newest_message_date ? format(new Date(c.newest_message_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                            <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.created_date ? format(new Date(c.created_date), "dd MMM yyyy, HH:mm") : "—"}</TableCell>
                            <TableCell className="px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // 🔥 VERY IMPORTANT (prevent row click)
                                  handleLeaveChat(c.id);
                                }}
                                className="text-xs px-3 py-1.5 rounded-md border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                              >
                                Leave
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
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

      {/* ── Change Role Dialog ── */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the administrative permissions for <strong>{user.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold">Select New Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => setSelectedRole(v as "ADMIN" | "USER")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedRole === "ADMIN" 
                  ? "ADMIN users have full access to management tools and dashboard features." 
                  : "USER accounts have standard platform access without administrative privileges."}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
