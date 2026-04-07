type SidebarGroupProps = {
    label: string
}

export default function AdminSidebarGroup({label} : SidebarGroupProps) {
    return (<h3 className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <div>{label}</div>
    </h3>
    )
}