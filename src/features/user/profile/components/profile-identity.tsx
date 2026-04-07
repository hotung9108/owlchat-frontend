import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Pencil, CalendarDays, Plus } from "lucide-react";
import owlLogo from "@/assets/owl-logo/black/owl-512.png"; 

export function ProfileIdentity() {
  return (
    <div className="w-full relative bg-background rounded-xl shadow-sm border border-border/40 overflow-hidden">
      
      {/* 1. COVER PHOTO - Changed height to 450px */}
      <div className="h-[450px] w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative group">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        
        <Button 
            variant="secondary" 
            size="sm" 
            className="absolute bottom-4 right-8 gap-2 bg-white/90 hover:bg-white text-black font-semibold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <Pencil className="h-4 w-4" /> Edit Cover Photo
        </Button>
      </div>

      {/* 2. PROFILE BAR (Avatar + Info) */}
      <div className="px-8 pb-8 flex flex-col md:flex-row items-start relative">
        
        {/* AVATAR (Overlapping the banner) */}
        <div className="-mt-[4.5rem] relative z-20 shrink-0">
            <div className="relative inline-block">
                <Avatar className="h-[168px] w-[168px] rounded-full border-[6px] border-background shadow-md bg-white">
                    <AvatarImage src={owlLogo} className="object-contain p-2" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {/* Status Bubble */}
                <span className="absolute bottom-4 right-4 h-8 w-8 rounded-full border-[4px] border-background bg-green-500 shadow-sm"></span>
            </div>
        </div>

        {/* USER INFO */}
        <div className="flex-1 flex flex-col pt-4 md:pl-6 gap-3 min-w-0 mt-2">
            
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-bold text-foreground tracking-tight">Shadcn User</h1>
                <p className="text-lg text-muted-foreground font-medium">@shadcn</p>
            </div>

            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                Passionate frontend developer building clean, accessible web apps. Love UI/UX, React, and open source.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground mt-1">
                <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>user@example.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                    <CalendarDays className="h-4 w-4" />
                    <span>Joined September 2023</span>
                </div>
            </div>

        </div>

        {/* ACTIONS BUTTONS */}
        <div className="mt-6 md:mt-8 flex gap-3 shrink-0 self-start md:self-center">
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-10 px-6">
                <Plus className="h-4 w-4 mr-2" /> Add to Story
             </Button>
             <Button variant="secondary" className="bg-secondary/80 hover:bg-secondary font-semibold h-10 px-6">
                <Pencil className="h-4 w-4 mr-2" /> Edit Profile
             </Button>
        </div>

      </div>
    </div>
  );
}