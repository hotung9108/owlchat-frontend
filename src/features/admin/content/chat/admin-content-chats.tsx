import { useState } from "react"
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
} from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

// ── Types ─────────────────────────────────────────────────────────────────────

type ChatType = "PRIVATE" | "GROUP"

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

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_CHATS: Chat[] = [
  { id: "CH001", status: true,  type: "PRIVATE", name: "Nguyễn Văn An & Trần Thị Bình",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",  initiator_id: "ACC000000000001", newest_message_id: "MSG101", newest_message_date: "2024-11-02T13:45:00", created_date: "2023-03-10T10:05:00", updated_date: "2024-11-02T13:45:00" },
  { id: "CH002", status: true,  type: "GROUP",   name: "Nhóm dự án Alpha",                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G1", initiator_id: "ACC000000000007", newest_message_id: "MSG201", newest_message_date: "2024-11-01T18:20:00", created_date: "2023-06-01T08:00:00", updated_date: "2024-11-01T18:20:00" },
  { id: "CH003", status: false, type: "PRIVATE", name: "Lê Minh Cường & Phạm Thị Dung",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",  initiator_id: "ACC000000000003", newest_message_id: "MSG301", newest_message_date: "2024-09-30T11:10:00", created_date: "2023-05-18T15:35:00", updated_date: "2024-09-30T11:10:00" },
  { id: "CH004", status: true,  type: "GROUP",   name: "Gia đình",                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G2", initiator_id: "ACC000000000001", newest_message_id: "MSG401", newest_message_date: "2024-10-15T20:00:00", created_date: "2022-12-25T00:00:00", updated_date: "2024-10-15T20:00:00" },
  { id: "CH005", status: true,  type: "PRIVATE", name: "Hoàng Văn Em & Vũ Thị Phương",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",  initiator_id: "ACC000000000005", newest_message_id: "MSG501", newest_message_date: "2024-10-28T09:30:00", created_date: "2023-08-14T14:00:00", updated_date: "2024-10-28T09:30:00" },
  { id: "CH006", status: false, type: "GROUP",   name: "Lớp học tiếng Anh",               avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G3", initiator_id: "ACC000000000009", newest_message_id: null,     newest_message_date: null,               created_date: "2023-01-20T07:00:00", updated_date: "2023-01-20T07:00:00" },
  { id: "CH007", status: true,  type: "PRIVATE", name: "Đặng Quốc Giang & Ngô Thanh Hùng", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", initiator_id: "ACC000000000007", newest_message_id: "MSG701", newest_message_date: "2024-11-03T08:15:00", created_date: "2024-01-05T09:15:00", updated_date: "2024-11-03T08:15:00" },
  { id: "CH008", status: true,  type: "GROUP",   name: "Ban tổ chức sự kiện",             avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G4", initiator_id: "ACC000000000002", newest_message_id: "MSG801", newest_message_date: "2024-10-31T16:00:00", created_date: "2024-03-15T10:00:00", updated_date: "2024-10-31T16:00:00" },
  { id: "CH009", status: false, type: "PRIVATE", name: "Bùi Thị Hoa & Đinh Thị Lan",     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",  initiator_id: "ACC000000000008", newest_message_id: "MSG901", newest_message_date: "2024-07-10T14:20:00", created_date: "2023-11-01T11:00:00", updated_date: "2024-07-10T14:20:00" },
  { id: "CH010", status: true,  type: "GROUP",   name: "Hội những người thích mèo",       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G5", initiator_id: "ACC000000000012", newest_message_id: "MSG1001",newest_message_date: "2024-11-02T21:00:00", created_date: "2024-06-10T12:00:00", updated_date: "2024-11-02T21:00:00" },
  { id: "CH011", status: true,  type: "PRIVATE", name: "Phan Văn Minh & Lý Thị Ngọc",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=11", initiator_id: "ACC000000000011", newest_message_id: "MSG1101",newest_message_date: "2024-10-20T10:10:00", created_date: "2024-02-28T08:30:00", updated_date: "2024-10-20T10:10:00" },
  { id: "CH012", status: false, type: "GROUP",   name: "Dự án nghiên cứu AI",             avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=G6", initiator_id: "ACC000000000013", newest_message_id: null,     newest_message_date: null,               created_date: "2023-09-01T09:00:00", updated_date: "2023-09-01T09:00:00" },
]

const PAGE_SIZE = 10

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminContentChats() {
  const [search, setSearch]                   = useState("")
  const [statusFilter, setStatus]             = useState("all")
  const [typeFilter, setType]                 = useState("all")
  const [createdRange, setCreatedRange]       = useState<DateRange | undefined>()
  const [newestMsgRange, setNewestMsgRange]   = useState<DateRange | undefined>()
  const [page, setPage]                       = useState(1)

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = MOCK_CHATS.filter(c => {
    const matchSearch =
      search === "" ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.initiator_id.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "active" ? c.status : !c.status

    const matchType =
      typeFilter === "all" ? true : c.type === typeFilter

    const created = new Date(c.created_date)
    const matchCreated =
      !createdRange ? true :
      (!createdRange.from || created >= createdRange.from) &&
      (!createdRange.to   || created <= createdRange.to)

    const matchNewest =
      !newestMsgRange ? true :
      !c.newest_message_date ? false :
      (() => {
        const d = new Date(c.newest_message_date)
        return (!newestMsgRange.from || d >= newestMsgRange.from) &&
               (!newestMsgRange.to   || d <= newestMsgRange.to)
      })()

    return matchSearch && matchStatus && matchType && matchCreated && matchNewest
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const hasFilters = search || statusFilter !== "all" || typeFilter !== "all" || createdRange || newestMsgRange

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
    setType("all")
    setCreatedRange(undefined)
    setNewestMsgRange(undefined)
    setPage(1)
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-border bg-background">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <MessageSquare size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Chats Manager</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} chats found</p>
          </div>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-xs text-primary hover:text-primary">
            <X size={13} /> Clear filters
          </Button>
        )}
      </div>

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
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-20 text-sm text-muted-foreground">
                  No chats match your filters
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((c, i) => (
                <TableRow
                  key={c.id}
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
                        <AvatarImage src={c.avatar} />
                        <AvatarFallback className="text-xs bg-muted">{c.name[0]}</AvatarFallback>
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
                      {c.initiator_id}
                    </span>
                  </TableCell>

                  {/* Newest message ID */}
                  <TableCell className="px-4 py-3">
                    {c.newest_message_id
                      ? <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{c.newest_message_id}</span>
                      : <span className="text-xs text-muted-foreground/50">—</span>
                    }
                  </TableCell>

                  {/* Newest message date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.newest_message_date
                      ? format(new Date(c.newest_message_date), "dd MMM yyyy, HH:mm")
                      : <span className="text-muted-foreground/50">—</span>
                    }
                  </TableCell>

                  {/* Created date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(c.created_date), "dd MMM yyyy, HH:mm")}
                  </TableCell>

                  {/* Updated date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(c.updated_date), "dd MMM yyyy, HH:mm")}
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
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          >
            <ChevronLeft size={14} />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...")
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="text-xs px-1 text-muted-foreground">…</span>
              ) : (
                <Button key={p} variant={page === p ? "default" : "outline"}
                  size="icon" className="h-7 w-7 text-xs"
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </Button>
              )
            )
          }

          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
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
