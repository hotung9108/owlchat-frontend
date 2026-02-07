import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useUserNavigation } from "../chat/hooks/userUserNavigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/utils/constants";
import { ModeToggle } from "@/components/mode-toggle";
export default function DesktopNav() {
    const paths = useUserNavigation();
    return (
        <Card
            className="hidden lg:flex 
        lg:flex-col lg:justify-between 
        lg:items-center lg:h-full 
        lg:w-16 lg:px-2 lg:py-4"
        >
            <nav>
                <ul className="flex flex-col items-center gap-4">
                    {paths.map((path, id) => {
                        return (
                            <li key={id} className="relative">
                                <Link to={path.href}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant={
                                                    path.active
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {path.icon}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="left"
                                            align="center"
                                        >
                                            <div className="">{path.name}</div>
                                        </TooltipContent>
                                    </Tooltip>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="flex flex-col items-center gap-4">
                <ModeToggle />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Icons.Notification />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center">
                        <div className="">Notification</div>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Icons.Settings />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center">
                        <div className="">Setting</div>
                    </TooltipContent>
                </Tooltip>
            </div>
        </Card>
    );
}
