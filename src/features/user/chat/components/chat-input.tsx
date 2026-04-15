import { useRef, useState, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Paperclip, Mic, SendHorizonal, MapPin } from "lucide-react";
import type { MessageType } from "@/types/enum/mesage-type";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LocationPickerDialog } from "@/components/shared/location-picker-dialog";
import type { LocationData } from "@/config/mapbox";
import { isMapboxAvailable } from "@/config/mapbox";

type ChatInputProps = {
    onSendMessage: (message: string) => void;
    onSendFile: (file: File, type: MessageType) => void;
    onSendLocation?: (location: LocationData) => void;
};

export default memo(function ChatInput({
    onSendMessage,
    onSendFile,
    onSendLocation,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const detectFileType = useCallback((file: File): MessageType => {
        if (file.type.startsWith("image/")) return "IMG";
        if (file.type.startsWith("video/")) return "VID";
        return "GENERIC_FILE";
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const type = detectFileType(file);

        onSendFile(file, type);
        e.target.value = "";
        setShowMoreOptions(false);
    }, [detectFileType, onSendFile]);

    const triggerUpload = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt";
            fileInputRef.current.click();
        }
    }, []);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === "file") {
                const file = item.getAsFile();
                if (!file) continue;

                const type = detectFileType(file);
                onSendFile(file, type);
                e.preventDefault();
                return;
            }
        }
    }, [detectFileType, onSendFile]);

    const handleSend = useCallback(() => {
        if (message.trim() !== "") {
            onSendMessage(message);
            setMessage("");
            const textarea = document.querySelector('textarea[placeholder="Type a message..."]') as HTMLTextAreaElement;
            if (textarea) {
                textarea.style.height = 'auto';
            }
        }
    }, [message, onSendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
    }, []);

    const handleToggleOptions = useCallback(() => {
        setShowMoreOptions(prev => !prev);
    }, []);

    const handleLocationSelect = useCallback((location: LocationData) => {
        onSendLocation?.(location);
        setShowMoreOptions(false);
    }, [onSendLocation]);

    return (
        <>
            <LocationPickerDialog
                open={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onLocationSelect={handleLocationSelect}
            />
            <TooltipProvider>
                <Card className="w-full p-3 rounded-2xl relative bg-card/80 backdrop-blur-md border-border/40 shadow-lg">
                <div className="flex gap-3 items-end w-full">
                    <div className="flex items-center pb-1">
                        <div className="relative">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-full transition-all duration-300 ${showMoreOptions ? "bg-primary/20 text-primary rotate-45" : "hover:bg-secondary text-muted-foreground"}`}
                                        onClick={handleToggleOptions}
                                    >
                                        <Plus className="w-6 h-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">More options</TooltipContent>
                            </Tooltip>

                            {showMoreOptions && (
                                <div className="absolute left-0 bottom-full mb-4 bg-card/95 border border-border/60 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 min-w-[170px] animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-xl z-50">
                                    <button 
                                        onClick={triggerUpload}
                                        className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Paperclip className="w-5 h-5" />
                                        </div>
                                        <span>Attachments</span>
                                    </button>
                                    {isMapboxAvailable() && (
                                        <>
                                            <div className="h-px bg-border/40 my-1 mx-2" />
                                            <button 
                                                onClick={() => {
                                                    setShowLocationPicker(true);
                                                    setShowMoreOptions(false);
                                                }}
                                                className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <span>Share Location</span>
                                            </button>
                                        </>
                                    )}
                                    <div className="h-px bg-border/40 my-1 mx-2" />
                                    <button className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                                            <Mic className="w-5 h-5" />
                                        </div>
                                        <span>Audio Voice</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    
                    <div className="flex-1 min-h-[44px] relative group">
                        <textarea
                            className="w-full max-h-[200px] border-none focus:ring-0 rounded-xl p-3 bg-muted/30 text-card-foreground resize-none scrollbar-hide text-sm leading-relaxed transition-all placeholder:text-muted-foreground/60 overflow-hidden"
                            rows={1}
                            placeholder="Type a message..."
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                        />
                    </div>

                    <div className="pb-1">
                        <Button
                            disabled={!message.trim()}
                            className={`rounded-xl h-11 w-11 p-0 transition-all duration-300 shadow-md active:scale-95 ${message.trim() ? "bg-primary hover:bg-primary/90 opacity-100 scale-100" : "bg-muted text-muted-foreground opacity-50 scale-90"}`}
                            onClick={handleSend}
                        >
                            <SendHorizonal className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </Card>
            </TooltipProvider>
        </>
    );
});
