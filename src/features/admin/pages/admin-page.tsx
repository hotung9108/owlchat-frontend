import { Card } from "@/components/ui/card";
import AdminLayout from "../layout/admin-layout";
import AdminSidebar from "../components/admin-sidebar";
import { type SidebarGroup, type UserInfor } from "../configs/admin-sidebar.config";
import { Icons } from "@/utils/constants";

type Props = {
  children: React.ReactNode;
};

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Analysis",
    items: [
      {
        label: "Statistics",
        href: "/admin/stats",
        icon: <Icons.Analytics/>
      }
    ]
  },
  {
    label: "Management",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: <Icons.Users  />,
      },
      {
        label: "Chats",
        href: "/admin/chats",
        icon: <Icons.Chat  />,
      },
      {
        label: "Users relationships",
        href: "/admin/relationships",
        icon: <Icons.Group />,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: <Icons.Settings  />,
      },
    ],
  },
]

export const userInfor: UserInfor = {
    id: "ABC",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
    display_name: "Display username",
    email: "Owl@edu.vn"
}

export default function AdminPage({children} : Props) {
    return (
        <AdminLayout
            sidebar= {
                <AdminSidebar groups={sidebarGroups} user_infor={userInfor}/>
            }
        >
          <Card className="h-full">
            {children}
          </Card>
        </AdminLayout>
    )
}