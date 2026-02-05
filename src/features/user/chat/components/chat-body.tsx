type Message = {
    id: string;
    text: string;
    sender: string;
};

type ChatBodyProps = {
    messages: Message[];
};

export default function ChatBody({ messages }: ChatBodyProps) {
    return (
        <div
            className="flex-1 w-full 
            flex overflow-y-scroll 
            flex-col-reverse gap-2 p-3 
            no-scrollbar"
        >
            {messages.map((message) => {
                const isMe = message.sender === "You";

                return (
                    <div
                        key={message.id}
                        className={`
                            p-2 rounded-lg text-sm
                            break-words
                            ${isMe
                                ? "bg-primary text-primary-foreground self-end max-w-[75%]"
                                : "bg-muted text-muted-foreground self-start max-w-[60%]"
                            }
                        `}
                    >
                        <p>{message.text}</p>
                    </div>
                );
            })}
        </div>
    );
}
