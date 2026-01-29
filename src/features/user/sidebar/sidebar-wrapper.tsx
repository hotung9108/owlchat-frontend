import React from "react";
import DesktopNav from "./destop-nav";
import MobileNav from "./mobile-nav";
type Props = React.PropsWithChildren<{}>;
export default function SidebarWrapper({children}: Props){
    return(
        <div className="h-screen w-full overflow-hidden p-4 flex flex-col lg:flex-row gap-4">
            <MobileNav/>
            <DesktopNav/>
            <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">
                {children}
            </main>
        </div>
    )
};
// h-screen w-screen flex overflow-hidden