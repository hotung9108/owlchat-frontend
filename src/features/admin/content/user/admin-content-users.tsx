import { useState, useEffect } from "react"
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
import { AdminContentTopBar } from "../../components/admin-content-top-bar"

// ── Types & Component ─────────────────────────────────────────────────────────

import { userProfileService } from "@/services/user-profile-service"
import type { UserProfile } from "@/types/user-profile.type"

const PAGE_SIZE = 10

export default function UsersManager() {
  const [users, setUsers]         = useState<UserProfile[]>([])
  const [loading, setLoading]     = useState(true)

  const [search, setSearch]       = useState("")
  const [statusFilter, setStatus] = useState<string>("all")
  const [genderFilter, setGender] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [page, setPage]           = useState(1)
  const [hasMore, setHasMore]     = useState(true)

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true)
      try {
        const s = statusFilter === "active" ? 1 : statusFilter === "inactive" ? 2 : 0
        const g = genderFilter === "male" ? 1 : genderFilter === "female" ? 2 : 0
        const dStart = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined
        const dEnd = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined

        const res = await userProfileService.getProfiles(
          search, page - 1, PAGE_SIZE, g, dStart, dEnd, true, s
        )
        if (active) {
          setUsers(res)
          setHasMore(res.length === PAGE_SIZE)
        }
      } catch (err) {
        console.error("Failed to load users", err)
      } finally {
        if (active) setLoading(false)
      }
    })();
    return () => { active = false }
  }, [search, statusFilter, genderFilter, dateRange, page])

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
      <AdminContentTopBar
        icon={<Users size={18} />}
        title="Users Manager"
        buttons={hasFilters ? [
          {
            label: "Clear filters",
            icon: <X size={13} />,
            colorClass: "border-transparent shadow-none bg-transparent hover:bg-transparent text-primary hover:text-primary",
            onClick: resetFilters
          }
        ] : []}
      />

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-sm text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-sm text-muted-foreground">
                  No users match your filters
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, i) => (
                <TableRow
                  key={user.id}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-accent ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  onClick={() => router("/admin/user/" + user.id)}
                >
                  <TableCell className="px-4 py-2.5">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-border object-cover"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {user.id}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-sm font-medium whitespace-nowrap text-foreground">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    {user.account?.status ? (
                      <Badge variant="outline" className="text-xs border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    {user.gender === true ? (
                      <Badge variant="outline" className="text-xs border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400">Male</Badge>
                    ) : user.gender === false ? (
                      <Badge variant="outline" className="text-xs border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-400">Female</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-border bg-muted text-muted-foreground">Other</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-xs whitespace-nowrap text-muted-foreground">
                    {user.dateOfBirth ? format(new Date(user.dateOfBirth), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-xs whitespace-nowrap text-primary">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 text-xs whitespace-nowrap font-mono text-muted-foreground">
                    {user.phoneNumber}
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
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={14} />
          </Button>

          <Button variant="default" size="icon" className="h-7 w-7 text-xs">
            {page}
          </Button>

          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
