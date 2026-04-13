type SidebarGroupProps = {
    label: string
}

export default function AdminSidebarGroup({label} : SidebarGroupProps) {
    return (
    <h3 
        className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
    >
        <div>{label}</div>
    </h3>
    )
}