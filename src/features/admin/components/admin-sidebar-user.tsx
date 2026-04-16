import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { UserInfor } from "../configs/admin-sidebar.config"
import { API_ENDPOINTS } from "@/config/api";

interface Props {
    user_infor: UserInfor,
    onClick: () => void
}

const USER_PROFILE_BASE_URL = `${API_ENDPOINTS.USER_SERVICE}/user`;

export default function AdminSidebarUser({user_infor, onClick} : Props) {
    
    return (
        <div
        className="
            w-full flex items-center gap-3 p-1
            text-left
            hover:bg-muted/60
            focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
            transition-colors cursor-pointer
        "
        onClick={() => {
            onClick()
        }}
        >
            <Avatar className="h-8 w-8">
                <AvatarImage 
                    src={`${USER_PROFILE_BASE_URL}/${user_infor.id}/avatar`} 
                    alt="Account avatar" 
                    onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user_infor.id}`;
                      }}/>
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
        </div>
    )
}