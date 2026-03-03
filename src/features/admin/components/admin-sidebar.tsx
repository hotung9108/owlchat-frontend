import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import owlLogo from "@/assets/owl-logo/black/owl-512.png";
import AdminSidebarItem from "./admin-sidebar-item";
import { Separator } from "@/components/ui/separator";
import AdminSidebarGroup from "./admin-sidebar-group";
import { useLocation, useNavigate } from "react-router-dom"
import type { SidebarGroup, UserInfor } from "../configs/admin-sidebar.config";
import AdminSidebarUser from "./admin-sidebar-user";

interface AdminSidebarProps {
  groups: SidebarGroup[]
  user_infor: UserInfor
}

export default function AdminSidebar({groups, user_infor}: AdminSidebarProps) {

    const { pathname } = useLocation()
    const navigate = useNavigate()
    
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
                                    onClick={
                                        () => navigate(item.href)
                                    }
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
                    <AdminSidebarUser user_infor={user_infor}></AdminSidebarUser>
                </CardFooter>
            </div>
        </Card>
    );
}
