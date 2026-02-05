interface ChatMessageProps {
  sender: string;
  content: string;
  timestamp: string;
}

export function ChatMessage({ sender, content, timestamp }: ChatMessageProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          {sender[0].toUpperCase()}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{sender}</div>
        <div className="text-sm text-gray-600">{content}</div>
        <div className="text-xs text-gray-400">{timestamp}</div>
      </div>
    </div>
  );
}