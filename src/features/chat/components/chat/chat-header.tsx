import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { User, LogOut, Bell } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background">
      {/* Left Side: Toggle & Title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          OwlChat
        </h1>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="relative focus:outline-none">
           <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </button>

        <ModeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage src="https://via.placeholder.com/40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Account Link */}
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Logout Button */}
            <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}