import { Card } from "@/components/ui/card";
import AdminLayout from "./layout/admin-layout";
import AdminSidebar from "./components/admin-sidebar";
import { type SidebarGroup, type UserInfor } from "./admin-sidebar.config";
import { Icons } from "@/utils/constants";

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Group 1",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <Icons.Ads />,
      },
      {
        label: "Overview",
        href: "/overview",
        icon: <Icons.Ads  />,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: <Icons.Users  />,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <Icons.Settings  />,
      },
    ],
  },
]

export const userInfor: UserInfor = {
    avatar: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
    display_name: "Display username",
    email: "Owl@edu.vn"
}

export default function AdminPage() {
    return (
        <AdminLayout
            sidebar= {
                <AdminSidebar groups={sidebarGroups} user_infor={userInfor}/>
            }
        >
                <Card className="w-full h-full">Main</Card>
        </AdminLayout>
    )
}