import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, User } from "lucide-react";
import { Icons } from "@/utils/constants";
export const useUserNavigation = () => {
    const location = useLocation(); 
    const pathname = location.pathname; 

    const paths = useMemo(
        () => [
            {
                name: "Conversations",
                href: "/conversations",
                icon: <MessageSquare />,
                active: pathname.startsWith("/conversations"),
            },
            {
                name: "Friends",
                href: "/friends",
                icon: <User />,
                active: pathname === "/friends",
            },
            {
                name: "Groups",
                href: "/groups",
                icon: <Icons.Group/>,
                // icon: <User />,
                // active: pathname === "/friends",
            },
            {
                name: "Marketplace",
                href: "/marketplace",
                icon: <Icons.Marketplace/>,
                // active: pathname === "/friends",
            },
            {
                name: "Finds",
                href: "/finds",
                icon: <Icons.Discover/>,
                // icon: <User />,
                // active: pathname === "/friends",
            },
            
        ],
        [pathname] 
    );

    return paths;
};