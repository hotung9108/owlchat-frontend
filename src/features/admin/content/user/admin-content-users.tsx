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
  Plus,
  Upload
} from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useNavigate as AppRoute } from "react-router-dom"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"

// ── Types & Component ─────────────────────────────────────────────────────────

import { userProfileService } from "@/services/user-profile-service"
import type { UserProfile } from "@/types/user-profile.type"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { accountService } from "@/services/real-account-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
          setUsers(res.content)
          setHasMore(res.content.length === PAGE_SIZE)
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

  const [createOpen, setCreateOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    role: "USER",
    username: "",
    password: "",
    email: "",
    name: "",
    phone_number: "",
    date_of_birth: "",
    gender: null as boolean | null,
    avatar: "",
  });


  const [avatarError, setAvatarError] = useState("")

  const handleCreateUser = async () => {
    if (!createForm.username || !createForm.password || !createForm.email) {
      alert("Username, password and email are required");
      return;
    }

    try {
      // 1. Create the account
      const accountRes = await accountService.createAccount({
        role: createForm.role,
        username: createForm.username,
        password: createForm.password,
      });
      const accountId: string = accountRes.data.id;

      // 2. Create the user profile linked to the new account
      const newUser = await userProfileService.addNewProfileToAccount(accountId, {
        name: createForm.name || createForm.username,
        email: createForm.email,
        phoneNumber: createForm.phone_number,
        gender: createForm.gender ?? undefined,
        dateOfBirth: createForm.date_of_birth || undefined,
      });

      // 3. Reset form & close dialog
      setCreateForm({
        role: "USER",
        username: "",
        password: "",
        email: "",
        name: "",
        phone_number: "",
        date_of_birth: "",
        gender: null,
        avatar: "",
      });
      setCreateOpen(false);

      // 4. Redirect to new user
     router("/admin/user/" + newUser.id)
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-border bg-background">

      <AdminContentTopBar
        icon={<Users size={18} />}
        title="Users Manager"
        buttons={[
          ...(hasFilters
            ? [
                {
                  label: "Clear filters",
                  icon: <X size={13} />,
                  colorClass:
                    "border-transparent shadow-none bg-transparent hover:bg-transparent text-primary hover:text-primary",
                  onClick: resetFilters,
                },
              ]
            : []),

          {
            label: "Add User",
            icon: <Plus size={14} />,
            colorClass: "bg-primary text-primary hover:text-primary",
            onClick: () => {
              setCreateOpen(true)
            },
          },
        ]}
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg h-[90vh] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin">
            <div className="grid gap-4 py-2">
              {/* Role */}
              <div className="grid gap-1.5">
                <Label className="text-xs">Role</Label>

                  <Select
                    value={createForm.role || "USER"}
                    onValueChange={(v) =>
                      setCreateForm((f) => ({
                        ...f,
                        role: v as "USER" | "ADMIN",
                      }))
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              {/* Username */}
              <div className="grid gap-1.5">
                <Label className="text-xs">Username *</Label>
                <Input
                  value={createForm.username}
                  onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="username"
                />
              </div>

              {/* Password */}
              <div className="grid gap-1.5">
                <Label className="text-xs">Password *</Label>
                <Input
                  type="password"
                  value={createForm.password}
                  onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="password"
                />
              </div>

              {/* Email */}
              <div className="grid gap-1.5">
                <Label className="text-xs">Email *</Label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>

              {/* Optional fields */}
              <div className="grid gap-1.5">
                <Label className="text-xs">Name</Label>
                <Input
                  value={createForm.name}
                  onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Phone</Label>
                <Input
                  value={createForm.phone_number}
                  onChange={e => setCreateForm(f => ({ ...f, phone_number: e.target.value }))}
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Date of Birth</Label>
                <Input
                  type="date"
                  value={createForm.date_of_birth}
                  onChange={e => setCreateForm(f => ({ ...f, date_of_birth: e.target.value }))}
                />
              </div>

              {/* Gender */}
              <div className="grid gap-1.5">
                <Label className="text-xs">Gender</Label>
                <Select
                  value={
                    createForm.gender === null
                      ? "none"
                      : createForm.gender
                      ? "male"
                      : "female"
                  }
                  onValueChange={v =>
                    setCreateForm(f => ({
                      ...f,
                      gender: v === "none" ? null : v === "male",
                    }))
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Avatar</Label>
                <div className="flex gap-3 items-center">

                    {/* Avatar preview */}
                    <Avatar className="w-14 h-14 border border-border shrink-0">
                    <AvatarImage src={createForm.avatar} />
                    <AvatarFallback className="text-lg bg-muted">{createForm.name[0]}</AvatarFallback>
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
                            setCreateForm(f => ({ ...f, avatar: ev.target?.result as string }))
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
          </div>

          <DialogFooter className="flex-shrink-0 pt-2 border-t bg-background">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
