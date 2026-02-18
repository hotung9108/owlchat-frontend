import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function ProfileContainer({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-full w-full justify-center items-start overflow-y-auto bg-gradient-to-br from-emerald-500/20 via-gray-100/10 to-gray-500/20 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}