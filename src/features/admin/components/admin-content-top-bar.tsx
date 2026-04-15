import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface AdminTopBarButton {
  label: string;
  icon?: ReactNode;
  colorClass?: string;
  onClick: () => void;
}

export interface AdminContentTopBarProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  buttons?: AdminTopBarButton[];
}

export function AdminContentTopBar({ icon, title, subtitle, buttons }: AdminContentTopBarProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20 shrink-0">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground font-mono">{subtitle}</p>}
      </div>

      {/* Action buttons */}
      {buttons && buttons.length > 0 && (
        <div className="flex gap-2">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className={`gap-2 text-xs ${btn.colorClass || ""}`}
              onClick={btn.onClick}
            >
              {btn.icon}
              {btn.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}