import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  conversationId: string | undefined;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Message sent to conversation ${conversationId}: ${message}`);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSendMessage} className="bg-primary text-white">
        Send
      </Button>
    </div>
  );
}