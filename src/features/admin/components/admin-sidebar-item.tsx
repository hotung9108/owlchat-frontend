type SidebarItemProps = {
  label: string
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export default function AdminSidebarItem({
  label,
  icon,
  active,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 rounded-md px-3 py-2
        text-base font-semibold
        transition-colors
        ${
          active
            ? "bg-primary/15 text-foreground"
            : "text-foreground/85 hover:bg-muted/50 hover:text-foreground"
        }
      `}
    >
      {icon && (
        <span className="flex h-5 w-5 items-center justify-center">
          {icon}
        </span>
      )}

      <span className="truncate">
        {label}
      </span>
    </button>
  )
}