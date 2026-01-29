import React from "react";
import SidebarWrapper from "./sidebar/sidebar-wrapper";
type Props = React.PropsWithChildren<{}>;
export default function UserLayout({children}: Props){
    return(
        <SidebarWrapper>
            {children}
        </SidebarWrapper>
    )
};