import Layout from "../components/chat-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
    return (
        <Layout>
            <div className="flex h-full flex-col p-4 bg-background text-foreground">
                <Card className="flex flex-col shadow-md h-[90vh] w-full border border-border">
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted rounded-t-xl">
                        <h1 className="text-lg font-semibold">Chat with OwlChat</h1>
                    </div>

                    <CardContent className="flex flex-1 flex-col p-0">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-muted p-3 rounded-lg">
                                        <p className="text-sm">Hello! How can I help you today?</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-end">
                                    <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                                        <p className="text-sm">Hi! I need some help with my account.</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="flex items-center gap-2 border-t border-border p-4">
                            <Input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Send
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}