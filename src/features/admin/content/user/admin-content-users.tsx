import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarIcon,
  X,
  Users,
} from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useNavigate as AppRoute } from "react-router-dom"

// ── Types ─────────────────────────────────────────────────────────────────────

type User = {
  id: string
  avatar: string
  status: boolean
  name: string
  gender: boolean
  date_of_birth: string
  email: string
  phone_number: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  { id: "ACC000000000001", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",  status: true,  name: "Nguyễn Văn An",    gender: true,  date_of_birth: "1995-03-12", email: "an.nguyen@email.com",  phone_number: "0901234561" },
  { id: "ACC000000000002", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",  status: true,  name: "Trần Thị Bình",    gender: false, date_of_birth: "1998-07-24", email: "binh.tran@email.com",  phone_number: "0901234562" },
  { id: "ACC000000000003", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",  status: false, name: "Lê Minh Cường",    gender: true,  date_of_birth: "1990-11-05", email: "cuong.le@email.com",   phone_number: "0901234563" },
  { id: "ACC000000000004", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",  status: true,  name: "Phạm Thị Dung",    gender: false, date_of_birth: "2000-01-18", email: "dung.pham@email.com",  phone_number: "0901234564" },
  { id: "ACC000000000005", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",  status: false, name: "Hoàng Văn Em",     gender: true,  date_of_birth: "1993-09-30", email: "em.hoang@email.com",   phone_number: "0901234565" },
  { id: "ACC000000000006", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",  status: true,  name: "Vũ Thị Phương",    gender: false, date_of_birth: "1997-05-14", email: "phuong.vu@email.com",  phone_number: "0901234566" },
  { id: "ACC000000000007", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",  status: true,  name: "Đặng Quốc Giang",  gender: true,  date_of_birth: "1988-12-22", email: "giang.dang@email.com", phone_number: "0901234567" },
  { id: "ACC000000000008", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",  status: false, name: "Bùi Thị Hoa",      gender: false, date_of_birth: "2001-04-08", email: "hoa.bui@email.com",    phone_number: "0901234568" },
  { id: "ACC000000000009", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",  status: true,  name: "Ngô Thanh Hùng",   gender: true,  date_of_birth: "1996-08-16", email: "hung.ngo@email.com",   phone_number: "0901234569" },
  { id: "ACC000000000010", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=10", status: true,  name: "Đinh Thị Lan",     gender: false, date_of_birth: "1999-02-27", email: "lan.dinh@email.com",   phone_number: "0901234570" },
  { id: "ACC000000000011", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=11", status: false, name: "Phan Văn Minh",    gender: true,  date_of_birth: "1992-06-03", email: "minh.phan@email.com",  phone_number: "0901234571" },
  { id: "ACC000000000012", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=12", status: true,  name: "Lý Thị Ngọc",      gender: false, date_of_birth: "2002-10-19", email: "ngoc.ly@email.com",    phone_number: "0901234572" },
  { id: "ACC000000000013", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=13", status: true,  name: "Trịnh Văn Oanh",   gender: true,  date_of_birth: "1991-03-25", email: "oanh.trinh@email.com", phone_number: "0901234573" },
  { id: "ACC000000000014", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=14", status: false, name: "Cao Thị Phúc",     gender: false, date_of_birth: "1994-07-11", email: "phuc.cao@email.com",   phone_number: "0901234574" },
  { id: "ACC000000000015", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=15", status: true,  name: "Mai Quang Quý",    gender: true,  date_of_birth: "1987-11-30", email: "quy.mai@email.com",    phone_number: "0901234575" },
]

const PAGE_SIZE = 10

// ── Component ─────────────────────────────────────────────────────────────────

export default function UsersManager() {
  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState<string>("all")
  const [genderFilter, setGender] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [page, setPage]           = useState(1)

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone_number.includes(search)

    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "active" ? u.status : !u.status

    const matchGender =
      genderFilter === "all" ? true :
      genderFilter === "male" ? u.gender : !u.gender

    const dob = new Date(u.date_of_birth)
    const matchDob =
      !dateRange ? true :
      (!dateRange.from || dob >= dateRange.from) &&
      (!dateRange.to   || dob <= dateRange.to)

    return matchSearch && matchStatus && matchGender && matchDob
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
    setGender("all")
    setDateRange(undefined)
    setPage(1)
  }

  const hasFilters = search || statusFilter !== "all" || genderFilter !== "all" || dateRange

  const router = AppRoute();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-border bg-background">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <Users size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Users Manager</h2>
            {/* <p className="text-xs text-muted-foreground">{filtered.length} users found</p> */}
          </div>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}
            className="gap-1.5 text-xs text-primary hover:text-primary"
          >
            <X size={13} /> Clear filters
          </Button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-muted/10">

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, ID, email, phone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Status filter */}
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

        {/* Gender filter */}
        <Select value={genderFilter} onValueChange={v => { setGender(v); setPage(1) }}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gender</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>

        {/* DOB Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline" size="sm"
              className={`h-8 gap-2 text-xs font-normal ${dateRange ? "text-primary" : "text-muted-foreground"}`}
            >
              <CalendarIcon size={13} />
              {dateRange?.from
                ? dateRange.to
                  ? `${format(dateRange.from, "dd/MM/yy")} – ${format(dateRange.to, "dd/MM/yy")}`
                  : format(dateRange.from, "dd/MM/yyyy")
                : "Date of Birth"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={r => { setDateRange(r); setPage(1) }}
              numberOfMonths={2}
            />
            {dateRange && (
              <div className="p-2 border-t border-border flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs h-7"
                  onClick={() => { setDateRange(undefined); setPage(1) }}
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
              {["Avatar", "ID", "Name", "Status", "Gender", "Date of Birth", "Email", "Phone Number"].map(h => (
                <TableHead key={h}
                  className="text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap text-muted-foreground"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-sm text-muted-foreground">
                  No users match your filters
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user, i) => (
                <TableRow
                  key={user.id}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-accent ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  onClick={() => 
                    {
                      router("/admin/user/" + user.id);
                    }
                  }
                >
                  {/* Avatar */}
                  <TableCell className="px-4 py-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-border"
                    />
                  </TableCell>

                  {/* ID */}
                  <TableCell className="px-4 py-2.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {user.id}
                    </span>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="px-4 py-2.5 text-sm font-medium whitespace-nowrap text-foreground">
                    {user.name}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-2.5">
                    {user.status ? (
                      <Badge variant="outline" className="text-xs border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-destructive/40 bg-destructive/10 text-destructive">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  {/* Gender */}
                  <TableCell className="px-4 py-2.5">
                    {user.gender ? (
                      <Badge variant="outline" className="text-xs border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        Male
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-400">
                        Female
                      </Badge>
                    )}
                  </TableCell>

                  {/* DOB */}
                  <TableCell className="px-4 py-2.5 text-xs whitespace-nowrap text-muted-foreground">
                    {format(new Date(user.date_of_birth), "dd MMM yyyy")}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-4 py-2.5 text-xs whitespace-nowrap text-primary">
                    {user.email}
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="px-4 py-2.5 text-xs whitespace-nowrap font-mono text-muted-foreground">
                    {user.phone_number}
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
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
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
                <span key={`ellipsis-${i}`} className="text-xs px-1 text-muted-foreground">…</span>
              ) : (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </Button>
              )
            )
          }

          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
