import { useState } from "react"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft, MessageSquare, Hash, User, Calendar, Clock,
  FileText, Image, Video, Film, Bell, Power, PowerOff, Link,
} from "lucide-react"
import { format } from "date-fns"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageType  = "CHAT_NOTIFICATION" | "TEXT" | "IMG" | "VID" | "DOC"
type MessageState = "ORIGIN" | "EDITED" | "REMOVED"

type Message = {
  id: string
  chat_id: string
  status: boolean
  state: MessageState
  type: MessageType
  content: string
  sender_id: string | null
  predecessor_id: string | null
  sent_date: string | null
  removed_date: string | null
  created_date: string
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_MESSAGE: Message = {
  id:             "MSG000000000101",
  chat_id:        "CH001",
  status:         true,
  state:          "EDITED",
  type:           "TEXT",
  content:        "Hey! Are we still meeting tomorrow at 10am? I wanted to confirm before I book the room. Let me know if the time still works for everyone.",
  sender_id:      "ACC000000000001",
  predecessor_id: "MSG000000000100",
  sent_date:      "2024-11-02T13:45:00",
  removed_date:   null,
  created_date:   "2024-11-02T13:45:02",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function typeIcon(type: MessageType) {
  const cls = "text-muted-foreground"
  switch (type) {
    case "CHAT_NOTIFICATION": return <Bell   size={14} className={cls} />
    case "TEXT":              return <MessageSquare size={14} className={cls} />
    case "IMG":               return <Image  size={14} className={cls} />
    case "VID":               return <Film   size={14} className={cls} />
    case "DOC":               return <FileText size={14} className={cls} />
  }
}

function TypeBadge({ type }: { type: MessageType }) {
  const styles: Record<MessageType, string> = {
    CHAT_NOTIFICATION: "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    TEXT:              "border-primary/40 bg-primary/10 text-primary",
    IMG:               "border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-400",
    VID:               "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    DOC:               "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  }
  return (
    <Badge variant="outline" className={`text-xs gap-1.5 ${styles[type]}`}>
      {typeIcon(type)} {type}
    </Badge>
  )
}

function StateBadge({ state }: { state: MessageState }) {
  const styles: Record<MessageState, string> = {
    ORIGIN:  "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
    EDITED:  "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    REMOVED: "border-destructive/40 bg-destructive/10 text-destructive",
  }
  return (
    <Badge variant="outline" className={`text-xs ${styles[state]}`}>
      {state}
    </Badge>
  )
}

function InfoRow({
  icon, label, children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex items-center gap-2 w-44 shrink-0 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex-1 text-sm text-foreground">{children}</div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminContentMessage() {
  const { id } = useParams<{ id: string }>()

  const [message, setMessage]   = useState<Message>(MOCK_MESSAGE)
  const [toggleOpen, setToggleOpen] = useState(false)

  const handleToggleStatus = () => {
    setMessage(prev => ({ ...prev, status: !prev.status }))
    setToggleOpen(false)
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">

      {/* ── Top bar ── */}
      <AdminContentTopBar
        icon={<MessageSquare size={18} />}
        title="Message Detail"
        subtitle={id ?? message.id}
        buttons={[
          {
            label: message.status ? "Deactivate" : "Activate",
            icon: message.status ? <PowerOff size={13} /> : <Power size={13} />,
            colorClass: message.status
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "border-green-500/40 text-green-600 hover:bg-green-500/10 dark:text-green-400",
            onClick: () => setToggleOpen(true)
          }
        ]}
      />

      {/* ── Body ── */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">

          {/* ── Status strip ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant="outline"
              className={message.status
                ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"
                : "border-destructive/40 bg-destructive/10 text-destructive"
              }
            >
              {message.status ? "Active" : "Inactive"}
            </Badge>
            <StateBadge state={message.state} />
            <TypeBadge  type={message.type} />
          </div>

          {/* ── Content card ── */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <MessageSquare size={14} className="text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</span>
            </div>
            <div className="px-5 py-4">
              {message.state === "REMOVED" ? (
                <p className="text-sm text-muted-foreground italic">
                  This message has been removed.
                </p>
              ) : message.type === "IMG" ? (
                <img src={message.content} alt="Message Image" className="max-w-full rounded-lg max-h-96 object-contain border border-border bg-muted/10" />
              ) : message.type === "VID" ? (
                <video src={message.content} controls className="max-w-full rounded-lg max-h-96 border border-border bg-black/5" />
              ) : message.type === "DOC" ? (
                <a href={message.content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-border rounded-xl bg-muted/20 hover:bg-muted transition-colors w-max max-w-full">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-background border border-border shrink-0">
                    <FileText size={14} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate pr-2">
                    {message.content.split('/').pop() || "Download Document"}
                  </span>
                </a>
              ) : (
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              )}
            </div>
          </div>

          {/* ── Info card ── */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <FileText size={14} className="text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Information</span>
            </div>

            <div className="px-5 divide-y divide-border">

              <InfoRow icon={<Hash size={14} />} label="Message ID">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {message.id}
                </span>
              </InfoRow>

              <InfoRow icon={<MessageSquare size={14} />} label="Chat ID">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {message.chat_id}
                </span>
              </InfoRow>

              <InfoRow icon={<User size={14} />} label="Sender ID">
                {message.sender_id
                  ? <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{message.sender_id}</span>
                  : <span className="text-muted-foreground/50 text-xs">—</span>
                }
              </InfoRow>

              <InfoRow icon={<Link size={14} />} label="Predecessor ID">
                {message.predecessor_id
                  ? <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{message.predecessor_id}</span>
                  : <span className="text-muted-foreground/50 text-xs">—</span>
                }
              </InfoRow>

              <InfoRow icon={<Video size={14} />} label="Type">
                <TypeBadge type={message.type} />
              </InfoRow>

              <InfoRow icon={<MessageSquare size={14} />} label="State">
                <StateBadge state={message.state} />
              </InfoRow>

              <InfoRow icon={<Calendar size={14} />} label="Sent Date">
                {message.sent_date
                  ? <span className="text-sm">{format(new Date(message.sent_date), "dd MMM yyyy, HH:mm:ss")}</span>
                  : <span className="text-muted-foreground/50 text-xs">—</span>
                }
              </InfoRow>

              <InfoRow icon={<Clock size={14} />} label="Created Date">
                <span className="text-sm">
                  {format(new Date(message.created_date), "dd MMM yyyy, HH:mm:ss")}
                </span>
              </InfoRow>

              <InfoRow icon={<Clock size={14} />} label="Removed Date">
                {message.removed_date
                  ? <span className="text-sm text-destructive">{format(new Date(message.removed_date), "dd MMM yyyy, HH:mm:ss")}</span>
                  : <span className="text-muted-foreground/50 text-xs">—</span>
                }
              </InfoRow>

            </div>
          </div>

        </div>
      </div>

      {/* ── Activate / Deactivate Confirm ── */}
      <AlertDialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {message.status ? "Deactivate Message?" : "Activate Message?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {message.status
                ? "This will deactivate the message. It may be hidden from users depending on your platform rules."
                : "This will reactivate the message and make it visible again."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={message.status
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-green-600 hover:bg-green-700 text-white"
              }
              onClick={handleToggleStatus}
            >
              {message.status ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
