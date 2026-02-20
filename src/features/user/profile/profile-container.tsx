import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function ProfileContainer({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-full w-full justify-center items-start overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}