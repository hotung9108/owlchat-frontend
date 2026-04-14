import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar"
import {
  MessageSquare, Search, CalendarIcon, X, ChevronLeft, ChevronRight,
  Plus,
} from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"
import { chatAdminService } from "@/services/chat-admin-service"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useChatAdminService } from "@/hooks/use-chat-admin"
import { useUserProfile } from "@/hooks/use-user-profile"

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatType = "PRIVATE" | "GROUP"

type Chat = {
  id: string
  status: boolean
  type: ChatType
  name: string
  avatar?: string
  initiatorId: string
  newestMessageId?: string | null
  newestMessageDate?: string | null
  createdDate: string
  updatedDate: string
}

const PAGE_SIZE = 10

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminContentChats() {
  const navigate = useNavigate()
  const { createChat } = useChatAdminService()
  const { profile: initiatorProfile, loading: initiatorLoading, error: initiatorError, fetchProfileById } = useUserProfile()
  const [chats, setChats]                     = useState<Chat[]>([])
  const [loading, setLoading]                 = useState(true)
  const [search, setSearch]                   = useState("")
  const [statusFilter, setStatus]             = useState("all")
  const [typeFilter, setType]                 = useState("all")
  const [createdRange, setCreatedRange]       = useState<DateRange | undefined>()
  const [newestMsgRange, setNewestMsgRange]   = useState<DateRange | undefined>()
  const [page, setPage]                       = useState(1)
  const [hasMore, setHasMore]                 = useState(true)

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true)
      try {
        const s = statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined;
        const t = typeFilter !== "all" ? typeFilter : undefined;
        // The API only has createdDateStart/createdDateEnd inside ChatQueryParams currently
        const cdStart = createdRange?.from ? format(createdRange.from, "yyyy-MM-dd") : undefined;
        const cdEnd = createdRange?.to ? format(createdRange.to, "yyyy-MM-dd") : undefined;

        const res = await chatAdminService.getChats({
          keywords: search,
          page: page - 1,
          size: PAGE_SIZE,
          status: s,
          type: t,
          createdDateStart: cdStart,
          createdDateEnd: cdEnd
        });

        if (active) {
          const data = res.data || res;
          setChats(data);
          setHasMore(data.length === PAGE_SIZE);
        }
      } catch (err) {
        console.error("Failed to load chats", err)
      } finally {
        if (active) setLoading(false)
      }
    })();
    return () => { active = false }
  }, [search, statusFilter, typeFilter, createdRange, newestMsgRange, page])

  const hasFilters = search || statusFilter !== "all" || typeFilter !== "all" || createdRange || newestMsgRange

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
    setType("all")
    setCreatedRange(undefined)
    setNewestMsgRange(undefined)
    setPage(1)
  }

  const [createChatDialogOpen, setCreateChatDialogOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    type: "" as "GROUP" | "PRIVATE" | "",
    name: "",
    initiatorId: "",
  });

  useEffect(() => {
    const id = createForm.initiatorId?.trim();

    if (!id) {
      return;
    }

    const timeout = setTimeout(() => {
      fetchProfileById(id);
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [createForm.initiatorId, fetchProfileById]);

  const handleCreateChat = async () => {
    if (!createForm.type || !createForm.name) return;

    try {
      const res = await createChat({
        type: createForm.type,
        name: createForm.name,
        initiatorId: createForm.initiatorId || "",
      });

      const newChatId = res.data?.id ?? res.data;

      // reset form
      setCreateForm({
        type: "",
        name: "",
        initiatorId: "",
      });

      setCreateChatDialogOpen(false);

      // redirect to the newly created chat
      navigate(`/admin/chat/${newChatId}`);

    } catch (err) {
      console.error("Create chat failed", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-border bg-background">

      {/* ── Header ── */}
      <AdminContentTopBar
        icon={<MessageSquare size={18} />}
        title="Chats Manager"
        subtitle={``}
        buttons={[
          ...(hasFilters ? [
          {
            label: "Clear filters",
            icon: <X size={13} />,
            colorClass: "border-transparent shadow-none bg-transparent hover:bg-transparent text-primary hover:text-primary",
            onClick: resetFilters
          }
        ] : []),
        {
          label: "Create Chat",
          icon: <Plus size={14} />,
          colorClass: "bg-primary text-primary hover:text-primary cursor-pointer",
          onClick: () => {
            setCreateChatDialogOpen(true)
          },
        },
      ]}
      />

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-muted/10">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ID, name, initiator..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Status */}
        <Select value={statusFilter} onValueChange={v => { setStatus(v); setPage(1) }}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Type */}
        <Select value={typeFilter} onValueChange={v => { setType(v); setPage(1) }}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
            <SelectItem value="GROUP">Group</SelectItem>
          </SelectContent>
        </Select>

        {/* Created date range */}
        <DateRangePicker
          label="Created Date"
          value={createdRange}
          onChange={r => { setCreatedRange(r); setPage(1) }}
        />

        {/* Newest message date range */}
        <DateRangePicker
          label="Newest Message"
          value={newestMsgRange}
          onChange={r => { setNewestMsgRange(r); setPage(1) }}
        />
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              {["ID", "Chat", "Type", "Status", "Initiator ID", "Newest Message ID", "Newest Message Date", "Created Date", "Updated Date"].map(h => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-20 text-sm text-muted-foreground">
                  Loading chats...
                </TableCell>
              </TableRow>
            ) : chats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-20 text-sm text-muted-foreground">
                  No chats match your filters
                </TableCell>
              </TableRow>
            ) : (
              chats.map((c, i) => (
                <TableRow
                  key={c.id}
                  onClick={() => navigate(`/admin/chat/${c.id}`)}
                  className={`border-b border-border hover:bg-accent transition-colors cursor-pointer ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                >
                  {/* ID */}
                  <TableCell className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap">
                      {c.id}
                    </span>
                  </TableCell>

                  {/* Chat name + avatar */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-8 h-8 border border-border shrink-0">
                        <AvatarImage src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`} />
                        <AvatarFallback className="text-xs bg-muted">{c.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground whitespace-nowrap max-w-[180px] truncate">
                        {c.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs whitespace-nowrap ${
                      c.type === "GROUP"
                        ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}>
                      {c.type}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs whitespace-nowrap ${
                      c.status
                        ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                    }`}>
                      {c.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Initiator ID */}
                  <TableCell className="px-4 py-3">
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {c.initiatorId}
                    </span>
                  </TableCell>

                  {/* Newest message ID */}
                  <TableCell className="px-4 py-3">
                    {c.newestMessageId
                      ? <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{c.newestMessageId}</span>
                      : <span className="text-xs text-muted-foreground/50">—</span>
                    }
                  </TableCell>

                  {/* Newest message date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.newestMessageDate
                      ? format(new Date(c.newestMessageDate), "dd MMM yyyy, HH:mm")
                      : <span className="text-muted-foreground/50">—</span>
                    }
                  </TableCell>

                  {/* Created date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.createdDate ? format(new Date(c.createdDate), "dd MMM yyyy, HH:mm") : <span className="text-muted-foreground/50">—</span>}
                  </TableCell>

                  {/* Updated date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.updatedDate ? format(new Date(c.updatedDate), "dd MMM yyyy, HH:mm") : <span className="text-muted-foreground/50">—</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/10">
        <span className="text-xs text-muted-foreground">
          Page {page}
        </span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          >
            <ChevronLeft size={14} />
          </Button>

          <Button variant="default" size="icon" className="h-7 w-7 text-xs">
            {page}
          </Button>

          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => p + 1)} disabled={!hasMore}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <Dialog open={createChatDialogOpen} onOpenChange={setCreateChatDialogOpen}>
        <DialogContent className="max-w-md flex flex-col">
          <DialogHeader>
            <DialogTitle>Create new chat</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">

            {/* Chat type */}
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Chat type *</Label>
              <Select
                value={createForm.type}
                onValueChange={(v) =>
                  setCreateForm((f) => ({ ...f, type: v as "GROUP" | "PRIVATE" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GROUP">Group</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chat name */}
            <div className="grid gap-1.5">
              <Label className="text-xs">Chat name *</Label>
              <Input
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Chat name"
              />
            </div>

            {/* Initiator Id */}
            <div className="grid gap-1.5">
              <Label className="text-xs">Initiator Id</Label>
              <Input
                value={createForm.initiatorId}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, initiatorId: e.target.value }))
                }
                placeholder="User ID (optional)"
              />

              {/* User preview */}
              {createForm.initiatorId && (
                <div className="text-xs mt-1">
                  {initiatorLoading ? (
                    <span className="text-muted-foreground">Loading...</span>
                  ) : initiatorProfile ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {initiatorProfile.name.trim()}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {initiatorProfile.id}
                      </span>
                    </div>
                  ) : initiatorError ? (
                    <span className="text-destructive">User not found</span>
                  ) : null}
                </div>
              )}
            </div>

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateChatDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              disabled={!createForm.type || !createForm.name}
              onClick={handleCreateChat}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── DateRangePicker helper ────────────────────────────────────────────────────

function DateRangePicker({
  label, value, onChange,
}: {
  label: string
  value: DateRange | undefined
  onChange: (r: DateRange | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline" size="sm"
          className={`h-8 gap-2 text-xs font-normal ${value ? "text-primary" : "text-muted-foreground"}`}
        >
          <CalendarIcon size={13} />
          {value?.from
            ? value.to
              ? `${format(value.from, "dd/MM/yy")} – ${format(value.to, "dd/MM/yy")}`
              : format(value.from, "dd/MM/yyyy")
            : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
        {value && (
          <div className="p-2 border-t border-border flex justify-end">
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onChange(undefined)}>
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
