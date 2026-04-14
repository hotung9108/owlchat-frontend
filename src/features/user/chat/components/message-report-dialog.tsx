import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useReportMessage } from "@/hooks/use-report";

interface MessageReportDialogProps {
    messageId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function MessageReportDialog({ messageId, open, onOpenChange }: MessageReportDialogProps) {
    const [reportContent, setReportContent] = useState("");
    const { sendReport, loading } = useReportMessage();

    useEffect(() => {
        if (!open) {
            setReportContent("");
        }
    }, [open]);

    const handleSendReport = async () => {
        if (!reportContent.trim() || !messageId) return;

        try {
            await sendReport(messageId, { content: reportContent });
            
            // close
            onOpenChange(false);
        } catch (err) {
            console.error("Send report failed:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md flex flex-col">
                <DialogHeader>
                    <DialogTitle>Report message</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    {/* Content */}
                    <div className="grid gap-1.5">
                        <Label className="text-xs font-semibold">Report content *</Label>
                        <Textarea
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            placeholder="Describe the issue..."
                            rows={4}
                            disabled={loading}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!reportContent.trim() || loading}
                        onClick={handleSendReport}
                    >
                        {loading ? "Sending..." : "Send report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}