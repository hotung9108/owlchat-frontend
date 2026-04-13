import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useMessageService } from "@/hooks/use-message-admin"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MessageSquare, Hash, User, Calendar, Clock,
  FileText, Image, Video, Film, Bell, Power, PowerOff, Link, Download,
} from "lucide-react"
import { format } from "date-fns"
import { AdminContentTopBar } from "../../components/admin-content-top-bar"
import { useNavigate } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageType  = "SYSTEM_MESSAGE" | "TEXT" | "IMG" | "VID" | "GENERIC_FILE"
type MessageState = "ORIGIN" | "EDITED" | "REMOVED"

function Clickable({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className={`cursor-pointer transition ${className}`}
    >
      {children}
    </span>
  );
}

type Message = {
  id: string
  chat_id: string
  status: boolean
  state: MessageState
  type: MessageType
  content: string
  sender_id: string | null
  sender_name: string | null
  sender_avatar: string | null
  predecessor_id: string | null
  sent_date: string | null
  removed_date: string | null
  created_date: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function typeIcon(type: MessageType) {
  const cls = "text-muted-foreground"
  switch (type) {
    case "SYSTEM_MESSAGE": return <Bell      size={14} className={cls} />
    case "TEXT":           return <MessageSquare size={14} className={cls} />
    case "IMG":            return <Image     size={14} className={cls} />
    case "VID":            return <Film      size={14} className={cls} />
    case "GENERIC_FILE":            return <FileText  size={14} className={cls} />
  }
}

function TypeBadge({ type }: { type: MessageType }) {
  const styles: Record<MessageType, string> = {
    SYSTEM_MESSAGE: "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    TEXT:           "border-primary/40 bg-primary/10 text-primary",
    IMG:            "border-pink-500/40 bg-pink-500/10 text-pink-600 dark:text-pink-400",
    VID:            "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
   GENERIC_FILE:            "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
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

// ── Map raw API response → local Message type ─────────────────────────────────

function mapMessage(raw: any): Message {
  return {
    id:             raw.id,
    chat_id:        raw.chatId        ?? raw.chat_id,
    status:         raw.status        ?? true,
    state:          raw.state         ?? "ORIGIN",
    type:           raw.type          ?? "TEXT",
    content:        raw.content       ?? "",
    sender_id:      raw.senderId      ?? raw.sender_id      ?? null,
    sender_name:    raw.senderName    ?? raw.sender_name    ?? null,
    sender_avatar:  raw.senderAvatar  ?? raw.sender_avatar  ?? null,
    predecessor_id: raw.predecessorId ?? raw.predecessor_id ?? null,
    sent_date:      raw.sentDate      ?? raw.sent_date      ?? null,
    removed_date:   raw.removedDate   ?? raw.removed_date   ?? null,
    created_date:   raw.createdDate   ?? raw.created_date,
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminContentMessage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>()
  const { messageDetail, fetchById, activate, getResource, loading } = useMessageService()

  const [message, setMessage]       = useState<Message | null>(null)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [resourceSrc, setResourceSrc] = useState<string | null>(null)

  // Fetch on mount
  useEffect(() => {
    if (id) fetchById(id)
  }, [id])

  // Sync raw API response into local state
  useEffect(() => {
    if (messageDetail) setMessage(mapMessage(messageDetail))
  }, [messageDetail])

  // Fetch resource source URL
  useEffect(() => {
    let currentUrl = "";
    const fetchResource = async () => {
      if (message && ["IMG", "VID", "GENERIC_FILE"].includes(message.type)) {
        try {
          const res = await getResource(message.id);
          // If the service returns a Blob (via axios or fetch)
          if (res instanceof Blob) {
            currentUrl = URL.createObjectURL(res);
            setResourceSrc(currentUrl);
          } else if (res.data instanceof Blob) {
            currentUrl = URL.createObjectURL(res.data);
            setResourceSrc(currentUrl);
          } 
        } catch (err) {
          console.error("Failed to load message resource:", err);
        }
      }
    };

    fetchResource();

    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [message?.id, message?.type]);

  const handleToggleStatus = async () => {
    if (!message) return
    try {
      await activate(message.id)
    } finally {
      setToggleOpen(false)
    }
  }

  if (loading || !message) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-background">
        <span className="text-muted-foreground">
          {loading ? "Loading message…" : "Message not found."}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">

      {/* ── Top bar ── */}
      <AdminContentTopBar
        icon={<MessageSquare size={18} />}
        title="Message Detail"
        subtitle={message.id}
        buttons={[
          {
            label: message.status ? "Deactivate" : "Activate",
            icon: message.status ? <PowerOff size={13} /> : <Power size={13} />,
            colorClass: message.status
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "border-green-500/40 text-green-600 hover:bg-green-500/10 dark:text-green-400",
            onClick: () => setToggleOpen(true),
          },
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
            <TypeBadge  type={message.type}  />
          </div>

          {/* ── Content card ── */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <MessageSquare size={14} className="text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</span>
            </div>
            <div className="px-5 py-4">
              {message.state === "REMOVED" ? (
                <p className="text-sm text-muted-foreground italic">This message has been removed.</p>
              ) : message.type === "IMG" ? (
                <div className="relative group">
                  <div className="flex items-center justify-center h-full w-full">
                    <img 
                      src={resourceSrc || message.content} 
                      alt="Message Image" 
                      className="max-w-full rounded-lg max-h-96 object-contain border border-border bg-muted/10" 
                    />
                  </div>
                  {!resourceSrc && loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                      <Clock className="w-6 h-6 animate-pulse text-muted-foreground" />
                    </div>
                  )}
                </div>
              ) : message.type === "VID" ? (
                <div className="flex items-center justify-center h-full w-full">
                  <video 
                    src={resourceSrc || message.content} 
                    controls 
                    className="max-w-full rounded-lg max-h-96 border border-border bg-black/5" 
                  />
                </div>
              ) : message.type === "GENERIC_FILE" ? (
                <div className="flex flex-col gap-2">
                  <a 
                    href={resourceSrc || message.content} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 border border-border rounded-xl bg-muted/20 hover:bg-muted transition-colors w-max max-w-sm"
                    download={message.content.split('/').pop() || "document"}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border shrink-0 shadow-sm">
                      <FileText size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground truncate px-1">
                        {message.content.split('/').pop() || "view_document"}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tight opacity-70 px-1">
                        Document File
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download size={14} />
                    </div>
                  </a>
                  
                  {/* Quick download button */}
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resourceSrc || message.content;
                      link.download = message.content.split('/').pop() || "document";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 text-xs text-primary hover:underline w-max px-1"
                  >
                    <Download size={12} />
                    <span>Download original file</span>
                  </button>
                </div>
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
              <button
                onClick={() => navigate(`/admin/chat/${message.chat_id}`)}
                className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-primary hover:underline hover:bg-muted/70 transition-colors cursor-pointer"
              >
                {message.chat_id}
              </button>
            </InfoRow>

            <InfoRow icon={<User size={14} />} label="Sender">
              {message.sender_id ? (
                message.sender_id === "SYSTEM" ? (
                  // System sender — not clickable
                  <div className="flex flex-col gap-0.5">
                    {message.sender_name && (
                      <span className="text-sm font-medium text-foreground">{message.sender_name}</span>
                    )}
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground w-max">
                      {message.sender_id}
                    </span>
                  </div>
                ) : (
                  // Regular sender — clickable
                  <button
                    onClick={() => navigate(`/admin/user/${message.sender_id}`)}
                    className="flex flex-col gap-0.5 text-left group text-primary hover:underline hover:bg-muted/70 transition-colors cursor-pointer"
                  >
                    {message.sender_name && (
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        {message.sender_name}
                      </span>
                    )}
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-primary hover:bg-muted/70 transition-colors w-max">
                      {message.sender_id}
                    </span>
                  </button>
                )
              ) : (
                <span className="text-muted-foreground/50 text-xs">—</span>
              )}
            </InfoRow>

              <InfoRow icon={<Link size={14} />} label="Predecessor ID">
                {message.predecessor_id ? (
                  <button
                    onClick={() => navigate(`/admin/message/${message.predecessor_id}`)}
                    className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-primary hover:underline hover:bg-muted/70 transition-colors cursor-pointer"
                  >
                    {message.predecessor_id}
                  </button>
                ) : (
                  <span className="text-muted-foreground/50 text-xs">—</span>
                )}
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
                <span className="text-sm">{format(new Date(message.created_date), "dd MMM yyyy, HH:mm:ss")}</span>
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
