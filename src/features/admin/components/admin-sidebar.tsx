import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import owlLogo from "@/assets/owl-logo/black/owl-512.png";
import AdminSidebarItem from "./admin-sidebar-item";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator";
import AdminSidebarGroup from "./admin-sidebar-group";
import { useLocation } from "react-router-dom"
import type { SidebarGroup, UserInfor } from "../admin-sidebar.config";

interface AdminSidebarProps {
  groups: SidebarGroup[]
  user_infor: UserInfor
}

export default function AdminSidebar({groups, user_infor}: AdminSidebarProps) {

    const { pathname } = useLocation()
    
    return (
        <Card className="h-full flex flex-col gap-4">
            <div>
                <CardHeader className="
                flex flex-row items-center gap-3 flex-shrink-0
                justify-center
                p-2 lg:p-6
                ">
                    <div className="invert-[0.8] sepia-[0.5] saturate-[1.5]">
                        <img
                        src={owlLogo}
                        alt="Owl Logo"
                        className="w-10 h-10"
                        />
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-bold text-primary">
                        Owl Manager
                    </h1>
                </CardHeader>

                <Separator />
            </div>

            <CardContent className="flex-1 min-h-0 p-2">
                <div className="h-full w-full overflow-y-auto"style={{maxHeight: "calc(96vh - 220px)",}}>
                    <div className="space-y-2">
                        {groups.map((group) => (
                            <div key={group.label} className="flex flex-col gap-2">
                                <AdminSidebarGroup label={group.label} />

                                <nav className="flex flex-col gap-1">
                                {group.items.map((item) => (
                                    <AdminSidebarItem
                                    key={item.href}
                                    label={item.label}
                                    icon={item.icon}
                                    active={pathname.startsWith(item.href)}
                                    onClick={() => {
                                        // router.push(item.href)
                                    }}
                                    />
                                ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>

            <div>
                <Separator />

                <CardFooter className="p-0">
                    <button
                    type="button"
                    className="
                        w-full flex items-center gap-3 p-4
                        text-left
                        hover:bg-muted/60
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                        transition-colors cursor-pointer
                    "
                    onClick={() => {
                        // handle click (open profile / menu / logout, etc.)
                    }}
                    >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user_infor.avatar} alt="Account avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium text-foreground">
                        {user_infor.display_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                        {user_infor.email}
                        </span>
                    </div>
                    </button>
                </CardFooter>
            </div>
        </Card>
    );
}
