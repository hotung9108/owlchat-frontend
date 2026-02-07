import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "default" | "destructive";
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  show: boolean; // Thêm prop để điều khiển hiển thị
}

export function CustomAlert({
  variant = "default",
  icon: Icon,
  title,
  description,
  className,
  show,
}: AlertProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-0 transform transition-transform duration-500 ease-in-out z-50",
        show ? "-translate-x-4" : "translate-x-full", 
        className
      )}
    >
      <Alert
        variant={variant}
        className="max-w-sm shadow-lg"
      >
        <Icon className="h-5 w-5" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}