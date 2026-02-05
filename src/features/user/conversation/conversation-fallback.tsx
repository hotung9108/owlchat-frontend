import { Card } from "@/components/ui/card";

export default function ConversationsFallback() {
    return (
        <Card
            className="hidden lg:flex
        h-full w-full p-2 items-center
        justify-center bg-secondary
        text-secondary-foreground"
        >
            <div className="text-6xl mb-4 opacity-20">🦉</div>
            <h2 className="text-2xl font-semibold text-slate-400">
                Select a conversation to start chatting
            </h2>
            <p className="mt-2 text-slate-600">
                OwlChat keeps your wisdom private and secure.
            </p>
        </Card>
    );
}
