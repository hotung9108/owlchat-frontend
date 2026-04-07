import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { UserInfor } from "../configs/admin-sidebar.config"

interface Props {
    user_infor: UserInfor
}

export default function AdminSidebarUser({user_infor} : Props) {
    return (
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
    )
}