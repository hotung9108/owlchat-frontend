import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Flag, Search, CalendarIcon, X, ChevronLeft, ChevronRight,
  Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"
import { useNavigate } from "react-router-dom"
import { useReportAdmin } from "@/hooks/use-report-admin"

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageReport = {
  id: string
  messageId: string
  reporterId: string | null
  content: string | null
  createdDate: string
}

const PAGE_SIZE = 10

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminContentMessageReports() {
  const navigator = useNavigate()
  
  const {
    list,
    listLoading,
    fetchReports,
    handleDelete: apiDelete,
    handlePatch,
  } = useReportAdmin()

  const [search, setSearch]               = useState("")
  const [dateRange, setDateRange]         = useState<DateRange | undefined>()
  const [sortAsc, setSortAsc]             = useState(false)
  const [page, setPage]                   = useState(1)
  const [refreshKey, setRefreshKey]       = useState(0)

  // Edit dialog
  const [editTarget, setEditTarget]       = useState<MessageReport | null>(null)
  const [editContent, setEditContent]     = useState("")

  // Delete confirm
  const [deleteTarget, setDeleteTarget]   = useState<MessageReport | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports({
        keywords: search || undefined,
        page: page - 1,
        pageSize: PAGE_SIZE,
        createdDateStart: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
        createdDateEnd: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        ascSort: sortAsc,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, dateRange, sortAsc, page, refreshKey]);

  const reports: MessageReport[] = (list as MessageReport[]) || [];
  const hasMore = reports.length === PAGE_SIZE;

  const hasFilters = search || dateRange

  const reset = () => { setSearch(""); setDateRange(undefined); setPage(1) }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openEdit = (r: MessageReport) => {
    setEditTarget(r)
    setEditContent(r.content ?? "")
  }

  const handleSaveEdit = async () => {
    if (!editTarget) return
    try {
        await handlePatch(editTarget.id, { content: editContent || "" })
        setEditTarget(null)
        setRefreshKey(k => k + 1)
    } catch (e) {
        console.error("Failed to patch report", e)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!deleteTarget) return
    try {
        await apiDelete(deleteTarget.id)
        setDeleteTarget(null)
        setRefreshKey(k => k + 1)
    } catch (e) {
        console.error("Failed to delete report", e)
    }
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-border bg-background">

      {/* ── Header ── */}
        <AdminContentTopBar
          icon={<Flag size={18} />}
          title="Message Reports"
        ></AdminContentTopBar>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-muted/10 shrink-0">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, message ID, reporter ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Created date range */}
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
                : "Created Date"}
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

        {/* Sort toggle */}
        <Button
          variant="outline" size="sm"
          className="h-8 gap-2 text-xs"
          onClick={() => { setSortAsc(v => !v); setPage(1) }}
        >
          {sortAsc
            ? <><ArrowUp size={13} /> Oldest first</>
            : <><ArrowDown size={13} /> Newest first</>
          }
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              {["ID", "Message ID", "Reporter ID", "Content", "Created Date", "Actions"].map(h => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 whitespace-nowrap">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-sm text-muted-foreground">
                  Loading reports...
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-sm text-muted-foreground">
                  No reports match your filters
                </TableCell>
              </TableRow>
            ) : (
              reports.map((r, i) => (
                <TableRow
                  key={r.id}
                  className={`border-b border-border hover:bg-accent transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                >
                  {/* ID */}
                  <TableCell className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap">
                      {r.id}
                    </span>
                  </TableCell>

                  {/* Message ID */}
                  <TableCell className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-primary hover:underline cursor-pointer whitespace-nowrap"
                        onClick={() => navigator(`/admin/message/${r.messageId}`)}
                    >
                      {r.messageId}
                    </span>
                  </TableCell>

                  {/* Reporter ID */}
                  <TableCell className="px-4 py-3">
                    {r.reporterId
                      ? <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-primary hover:underline cursor-pointer whitespace-nowrap"
                        onClick={() => navigator(`/admin/user/${r.reporterId}`)}
                      >
                        {r.reporterId}
                        </span>
                      : <span className="text-xs text-muted-foreground/50">—</span>
                    }
                  </TableCell>

                  {/* Content */}
                  <TableCell className="px-4 py-3 max-w-[280px]">
                    {r.content
                      ? <p className="text-xs text-foreground line-clamp-2 leading-relaxed">{r.content}</p>
                      : <span className="text-xs text-muted-foreground/50 italic">No content</span>
                    }
                  </TableCell>

                  {/* Created date */}
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {r.createdDate ? format(new Date(r.createdDate), "dd MMM yyyy, HH:mm") : <span className="text-muted-foreground/50">—</span>}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline" size="icon"
                        className="h-7 w-7 border-border hover:bg-accent"
                        onClick={() => openEdit(r)}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        variant="outline" size="icon"
                        className="h-7 w-7 border-destructive/40 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(r)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/10 shrink-0">
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

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editTarget} onOpenChange={open => !open && setEditTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>
              Update the content of report{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{editTarget?.id}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Read-only fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Message ID</Label>
                <Input value={editTarget?.messageId ?? ""} disabled className="font-mono text-xs bg-muted h-8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Reporter ID</Label>
                <Input value={editTarget?.reporterId ?? "—"} disabled className="font-mono text-xs bg-muted h-8" />
              </div>
            </div>

            {/* Editable content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Content</Label>
              <Textarea
                placeholder="Enter report content..."
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="resize-none text-sm"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">Leave empty to set content as null.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete report{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{deleteTarget?.id}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDeleteSubmit}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
