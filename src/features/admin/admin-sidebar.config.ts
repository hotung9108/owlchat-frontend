
export interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
}

export interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export interface UserInfor {
  avatar: string
  display_name: string
  email: string
}
