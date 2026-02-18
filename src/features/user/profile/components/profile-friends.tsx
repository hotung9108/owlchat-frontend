import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import owlLogo from "@/assets/owl-logo/black/owl-512.png";

export function ProfileFriends() {
  // 9 Friends for a 3x3 grid
  const friends = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 

  return (
    <Card className="w-full h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col">
            <CardTitle className="text-xl font-bold hover:underline cursor-pointer">Friends</CardTitle>
            <span className="text-sm text-muted-foreground font-medium">1,245 friends</span>
        </div>
        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
            Find Friends
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        <div className="grid grid-cols-3 gap-3">
            {friends.map((friend) => (
                <div key={friend} className="flex flex-col gap-1 cursor-pointer group">
                    <Avatar className="h-28 w-full rounded-lg border border-border/50 bg-white">
                        <AvatarImage src={owlLogo} className="object-contain p-2 group-hover:opacity-90 transition-opacity" />
                        <AvatarFallback className="rounded-lg">F{friend}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold mt-1 truncate group-hover:underline">
                        Owl Friend {friend}
                    </span>
                </div>
            ))}
        </div>
        <Button variant="secondary" className="w-full mt-4 font-semibold text-muted-foreground bg-secondary/50 hover:bg-secondary">
            See All Friends
        </Button>
      </CardContent>
    </Card>
  );
}