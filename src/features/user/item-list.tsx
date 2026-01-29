"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { useUserConversation } from "./chat/hooks/useUserConversation";

type Props = React.PropsWithChildren<{
    title: string;
    action?: React.ReactNode;
}>;

export default function ItemList({ children, title, action: Action }: Props) {
    const { isActive } = useUserConversation();
    return (
        <Card
            className={cn("hidden h-full w-full lg:flex-none lg:w-80 p-2", {
                block: !isActive,
                "lg:block": isActive,
            })}
        >
            <div
                className="mb-4 flex items-center
            justify-between"
            >
                <h1 className="text-2x1 font-bold tracking-tight">{title}</h1>
                {Action ? Action : null}
            </div>
            <div
                className="w-full h-full flex flex-col items-center justify-start gap-2 overflow-y-auto"
                style={{
                    maxHeight: "calc(100vh - 100px)",
                }}
            >
                {children}
            </div>
            <style>{`
                @media (max-width: 768px) {
                    div[style] {
                        max-height: calc(100vh - 200px) !important;
                    }
                }
            `}</style>
        </Card>
    );
}
