import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MessageCircle, MoreHorizontal, Mail, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const navigate = useNavigate();

  // Mock data
  const user = {
    name: "Dny",
    handle: "@dny",
    role: "Frontend Developer",
    location: "locantion",
    joined: "Joined Jan 2026",
    description: "Woman haver | Lorem ipsum",
    avatarUrl: "https://via.placeholder.com/150",
    coverUrl: "https://via.placeholder.com/800x300", 
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8">
      
      {/* Back Button Area */}
      <div className="mx-auto max-w-3xl mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Chat
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card className="mx-auto max-w-3xl overflow-hidden border shadow-sm bg-background">
        
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 w-full bg-muted">
          <img 
            src={user.coverUrl} 
            alt="Cover" 
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-6 md:px-10 pb-10">
          
          {/* Avatar & Action Buttons Row */}
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            
            {/* Avatar */}
            <div className="relative rounded-full border-[6px] border-background bg-background">
              <Avatar className="h-32 w-32 md:h-40 md:w-40">
                <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-2 hidden md:flex">
                <Button className="gap-2 rounded-full">
                    <MessageCircle className="h-4 w-4" /> Message
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
          </div>

          {/* Mobile Buttons (retrospective) */}
          <div className="flex gap-3 mb-6 md:hidden">
                <Button className="w-full gap-2 rounded-full">
                    <MessageCircle className="h-4 w-4" /> Message
                </Button>
                <Button variant="outline" size="icon" className="rounded-full shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
          </div>

          {/* User Info Section */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.name}</h1>
            <p className="text-lg text-muted-foreground font-medium">{user.handle}</p>
          </div>

          {/* Details Grid */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> 
                <span>{user.role}</span>
             </div>
             <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> 
                <span>{user.location}</span>
             </div>
             <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> 
                <span>{user.joined}</span>
             </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">About</h3>
            <div className="rounded-xl bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
                {user.description}
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}