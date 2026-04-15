import { useState, useEffect } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Users, MessageSquare, Flag, UserPlus } from "lucide-react"
import { format, subDays, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"
import { Icons } from "@/utils/constants"
import { useAdminStats } from "@/hooks/use-admin-stats"

// ── Colour tokens (CSS-var friendly, works in light + dark) ──────────────────
const C = {
  primary:  "var(--primary)",
  blue:     "#3b82f6",
  emerald:  "#10b981",
  rose:     "#f43f5e",
  amber:    "#f59e0b",
  violet:   "#8b5cf6",
  sky:      "#0ea5e9",
  pink:     "#ec4899",
}


// ── Helpers ───────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: "7 ngày",  days: 7 },
  { label: "30 ngày", days: 30 },
  { label: "90 ngày", days: 90 },
]

// function filterByRange<T extends { date: string }>(data: T[], range: DateRange | undefined): T[] {
//   if (!range?.from) return data
//   const from = startOfDay(range.from)
//   const to   = range.to ? startOfDay(range.to) : from
//   return data.filter(d => {
//     const day = startOfDay(parseISO(d.date))
//     return day >= from && day <= to
//   })
// }

function sum(data: { [k: string]: number | string }[], key: string): number {
  return data.reduce((a, b) => a + (Number(b[key]) || 0), 0)
}

function tickFormatter(date: string, total: number) {
  return total <= 14 ? format(parseISO(date), "dd/MM") :
         total <= 60 ? format(parseISO(date), "dd/MM") :
                       format(parseISO(date), "MM/yy")
}

function getEveryNth<T>(arr: T[], n: number) {
  return arr.filter((_, i) => i % n === 0 || i === arr.length - 1)
}

// ── Sub-components ────────────────────────────────────────────────────────────

type DateRangePickerProps = {
  value: DateRange | undefined
  onChange: (r: DateRange | undefined) => void
  presetDays?: number[]
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const applyPreset = (days: number) => {
    onChange({ from: subDays(new Date(), days - 1), to: new Date() })
  }
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRESETS.map(p => (
        <Button key={p.days} variant="outline" size="sm"
          className="h-7 text-xs px-2.5"
          onClick={() => applyPreset(p.days)}
        >
          {p.label}
        </Button>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm"
            className={`h-7 gap-1.5 text-xs ${value ? "text-primary border-primary/40" : "text-muted-foreground"}`}
          >
            <CalendarIcon size={12} />
            {value?.from
              ? value.to && value.to.toDateString() !== value.from.toDateString()
                ? `${format(value.from, "dd/MM/yy")} – ${format(value.to, "dd/MM/yy")}`
                : format(value.from, "dd/MM/yyyy")
              : "Tuỳ chỉnh"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={2} />
          {value && (
            <div className="p-2 border-t border-border flex justify-end">
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onChange(undefined)}>
                Xoá bộ lọc
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
}
function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
        style={{ background: `${color}20` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground tabular-nums">{typeof value === "number" ? value.toLocaleString("vi-VN") : value}</p>
      </div>
    </div>
  )
}

type ChartCardProps = {
  title: string
  subtitle?: string
  range: DateRange | undefined
  onRangeChange: (r: DateRange | undefined) => void
  children: React.ReactNode
}
function ChartCard({ title, subtitle, range, onRangeChange, children }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <DateRangePicker value={range} onChange={onRangeChange} />
      </div>
      {children}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground mb-1.5 font-medium">{label ? format(parseISO(label), "dd MMM yyyy") : ""}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{Number(p.value).toLocaleString("vi-VN")}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const {
    getMessagesStats,
    getMessagesTotal,
    getReportsStats,
    getReportsTotal,
    getSocialGrowth,
    getUsersStats,
    getUsersGrowth,
    getUsersGender,
    getUsersTotal,
    getUsersGrowthToday,
  } = useAdminStats()

  const defaultRange: DateRange = { from: subDays(new Date(), 29), to: new Date() }

  const [rangeUsers,    setRangeUsers]    = useState<DateRange | undefined>(defaultRange)
  const [rangeMessages, setRangeMessages] = useState<DateRange | undefined>(defaultRange)
  const [rangeReports,  setRangeReports]  = useState<DateRange | undefined>(defaultRange)
  const [rangeNewUsers, setRangeNewUsers] = useState<DateRange | undefined>(defaultRange)
  const [rangeSocial,   setRangeSocial]   = useState<DateRange | undefined>(defaultRange)

  // Data states
  const [usersData, setUsersData] = useState<any[]>([])
  const [messagesData, setMessagesData] = useState<any[]>([])
  const [reportsData, setReportsData] = useState<any[]>([])
  const [newUsersData, setNewUsersData] = useState<any[]>([])
  const [socialData, setSocialData] = useState<any[]>([])
  const [genderData, setGenderData] = useState<any[]>([])

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [totalReports, setTotalReports] = useState(0)
  const [totalNewUsersToday, setTotalNewUsersToday] = useState(0)

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd")

  // Load totals and gender
  useEffect(() => {
    getUsersTotal().then(res => setTotalUsers(res.data.users)).catch(console.error)
    getMessagesTotal().then(res => setTotalMessages(res.data.messages)).catch(console.error)
    getReportsTotal().then(res => setTotalReports(res.data.reports)).catch(console.error)
    getUsersGrowthToday().then(res => setTotalNewUsersToday(res.data.newUsers)).catch(console.error)
    getUsersGender().then(res => {
      const colors = [C.blue, C.pink, C.amber, C.emerald, C.rose, C.sky, C.violet]
      // Define a standard mapping for common gender names
      const presetColors: Record<string, string> = {
        "Nam": C.blue,
        "Nữ": C.pink,
        "Male": C.blue,
        "Female": C.pink,
        "Khác": C.amber,
        "Other": C.amber
      }
      
      const mapped = (res.data.data || []).map((item, idx) => ({
        ...item,
        color: presetColors[item.name] || colors[idx % colors.length]
      }))
      setGenderData(mapped)
    }).catch(console.error)
  }, [])

  // Load users trend
  useEffect(() => {
    let from, to
    if (rangeUsers?.from) from = formatDate(rangeUsers.from)
    if (rangeUsers?.to) to = formatDate(rangeUsers.to)
    getUsersStats(from, to).then(res => setUsersData(res.data.data)).catch(console.error)
  }, [rangeUsers])

  // Load messages trend
  useEffect(() => {
    let from, to
    if (rangeMessages?.from) from = formatDate(rangeMessages.from)
    if (rangeMessages?.to) to = formatDate(rangeMessages.to)
    getMessagesStats(from, to).then(res => setMessagesData(res.data.data)).catch(console.error)
  }, [rangeMessages])

  // Load reports trend
  useEffect(() => {
    let from, to
    if (rangeReports?.from) from = formatDate(rangeReports.from)
    if (rangeReports?.to) to = formatDate(rangeReports.to)
    getReportsStats(from, to).then(res => setReportsData(res.data.data)).catch(console.error)
  }, [rangeReports])

  // Load new users trend
  useEffect(() => {
    let from, to
    if (rangeNewUsers?.from) from = formatDate(rangeNewUsers.from)
    if (rangeNewUsers?.to) to = formatDate(rangeNewUsers.to)
    getUsersGrowth(from, to).then(res => setNewUsersData(res.data.data)).catch(console.error)
  }, [rangeNewUsers])

  // Load social trend
  useEffect(() => {
    let from, to
    if (rangeSocial?.from) from = formatDate(rangeSocial.from)
    if (rangeSocial?.to) to = formatDate(rangeSocial.to)
    getSocialGrowth(from, to).then(res => setSocialData(res.data.data)).catch(console.error)
  }, [rangeSocial])

  const tick = (data: { date: string }[]) => {
    const n = data.length
    const step = n <= 14 ? 1 : n <= 60 ? 5 : 15
    return getEveryNth(data, step).map(d => d.date)
  }

  const lineProps = { type: "monotone" as const, dot: false, strokeWidth: 2 }

  return (
    <div className="h-full w-full overflow-auto bg-background rounded-xl">

      {/* ── Header ── */}
      <AdminContentTopBar
        icon={<Icons.Analytics />}
        title="Statistics"
      ></AdminContentTopBar>
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── Stat summary cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} />}        label="Tổng người dùng"  value={totalUsers}    color={C.blue} />
          <StatCard icon={<MessageSquare size={18} />} label="Tổng tin nhắn"    value={totalMessages} color={C.emerald} />
          <StatCard icon={<Flag size={18} />}          label="Tổng report"       value={totalReports}  color={C.rose} />
          <StatCard icon={<UserPlus size={18} />}      label="Người dùng mới hôm nay"     value={totalNewUsersToday} color={C.violet} />
        </div>

        {/* ── Row 1: Users + Messages ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Users line chart */}
          <ChartCard
            title="Tổng số người dùng"
            subtitle={`${sum(usersData, "users").toLocaleString("vi-VN")} người trong khoảng đã chọn`}
            range={rangeUsers}
            onRangeChange={setRangeUsers}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={usersData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" ticks={tick(usersData)} tickFormatter={d => tickFormatter(d, usersData.length)} tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line {...lineProps} dataKey="users" name="Người dùng" stroke={C.blue} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Messages line chart */}
          <ChartCard
            title="Tổng số tin nhắn"
            subtitle={`${sum(messagesData, "messages").toLocaleString("vi-VN")} tin nhắn trong khoảng đã chọn`}
            range={rangeMessages}
            onRangeChange={setRangeMessages}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={messagesData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" ticks={tick(messagesData)} tickFormatter={d => tickFormatter(d, messagesData.length)} tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line {...lineProps} dataKey="messages" name="Tin nhắn" stroke={C.emerald} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Row 2: Reports + Gender pie ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Reports line chart */}
          <ChartCard
            title="Tổng số report tin nhắn"
            subtitle={`${sum(reportsData, "reports").toLocaleString("vi-VN")} report trong khoảng đã chọn`}
            range={rangeReports}
            onRangeChange={setRangeReports}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={reportsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" ticks={tick(reportsData)} tickFormatter={d => tickFormatter(d, reportsData.length)} tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line {...lineProps} dataKey="reports" name="Report" stroke={C.rose} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gender pie chart */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tỉ lệ giới tính người dùng</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Phân bố Nam / Nữ toàn hệ thống</p>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 flex-1">
                {genderData.map(g => {
                  const total = genderData.reduce((a, b) => a + b.value, 0)
                  const pct   = total > 0 ? ((g.value / total) * 100).toFixed(1) : "0.0"
                  return (
                    <div key={g.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                          <span className="text-foreground font-medium">{g.name}</span>
                        </div>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: g.color }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{g.value.toLocaleString("vi-VN")} người</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: New newUsers ── */}
        <ChartCard
          title="Người dùng mới theo thời gian"
          subtitle={`${sum(newUsersData, "newUsers").toLocaleString("vi-VN")} người dùng mới trong khoảng đã chọn`}
          range={rangeNewUsers}
          onRangeChange={setRangeNewUsers}
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={newUsersData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" ticks={tick(newUsersData)} tickFormatter={d => tickFormatter(d, newUsersData.length)} tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line {...lineProps} dataKey="newUsers" name="Người dùng mới" stroke={C.violet} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Row 4: Social stats ── */}
        <ChartCard
          title="Quan hệ xã hội theo thời gian"
          subtitle="Bạn bè · Yêu cầu kết bạn · Chặn"
          range={rangeSocial}
          onRangeChange={setRangeSocial}
        >
          <div className="flex items-center gap-4 flex-wrap mb-1">
            {[
              { key: "friends",  label: "Bạn bè",             color: C.sky },
              { key: "requests", label: "Yêu cầu kết bạn",   color: C.amber },
              { key: "blocks",   label: "Chặn",               color: C.rose },
            ].map(s => (
              <div key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: s.color }} />
                {s.label}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={socialData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" ticks={tick(socialData)} tickFormatter={d => tickFormatter(d, socialData.length)} tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--primary)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line {...lineProps} dataKey="friends"  name="Bạn bè"           stroke={C.sky} />
              <Line {...lineProps} dataKey="requests" name="Yêu cầu kết bạn" stroke={C.amber} />
              <Line {...lineProps} dataKey="blocks"   name="Chặn"             stroke={C.rose} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  )
}
