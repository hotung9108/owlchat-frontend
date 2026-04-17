import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { friendshipService } from "@/services/friendship-service";
import { userProfileService } from "@/services/user-profile-service";
import { useNavigate } from "react-router-dom";

interface ProfileFriendsProps {
  accountId?: string;
}

export function ProfileFriends({ accountId }: ProfileFriendsProps) {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const previousBlobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const loadFriendsWithAvatars = async () => {
      if (!accountId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get friendships for this user
        const friendships = await friendshipService.getFriendships(accountId, null, 0, 9);
        
        if (friendships && friendships.length > 0) {
          // For each friendship, get the other user's profile and avatar blob
          const friendProfiles = await Promise.all(
            friendships.map(async (friendship: any) => {
              try {
                // Determine which ID is the friend (the one that's not the current user)
                const friendId = friendship.firstUserId === accountId ? friendship.secondUserId : friendship.firstUserId;
                const profile = await userProfileService.getProfileById(friendId);
                
                // Fetch actual avatar blob from backend
                let avatarUrl = "";
                try {
                  const avatarBlob = await userProfileService.getUserAvatar(friendId);
                  avatarUrl = URL.createObjectURL(avatarBlob);
                  // Track blob URL for cleanup
                  previousBlobUrlsRef.current.push(avatarUrl);
                } catch (err) {
                  // Avatar not found or error - use default
                  console.debug(`Avatar not available for user ${friendId}`);
                }
                
                return {
                  ...profile,
                  avatarUrl: avatarUrl, // Override with blob URL
                };
              } catch (err) {
                console.error("Failed to fetch profile:", err);
                return null;
              }
            })
          );
          
          setFriends(friendProfiles.filter((p) => p !== null));
        }
      } catch (error) {
        console.error("Failed to load friendships:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFriendsWithAvatars();

    // Cleanup: revoke old blob URLs on unmount or when accountId changes
    return () => {
      previousBlobUrlsRef.current.forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      previousBlobUrlsRef.current = [];
    };
  }, [accountId]);

  const getInitials = (name: string) => {
    if (!name) return "F";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewProfile = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <Card className="w-full h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col">
            <CardTitle className="text-xl font-bold hover:underline cursor-pointer">Friends</CardTitle>
            <span className="text-sm text-muted-foreground font-medium">{friends.length} friends</span>
        </div>
        <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" disabled>
            Find Friends
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : friends.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3">
                {friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="flex flex-col gap-1 cursor-pointer group"
                      onClick={() => handleViewProfile(friend.id)}
                    >
                        <Avatar className="h-28 w-full rounded-lg border border-border/50 bg-white">
                            <AvatarImage src={friend.avatarUrl} className="object-cover group-hover:opacity-90 transition-opacity" />
                            <AvatarFallback className="rounded-lg">{getInitials(friend.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold mt-1 truncate group-hover:underline">
                            {friend.name}
                        </span>
                    </div>
                ))}
            </div>
            {friends.length >= 9 && (
              <Button variant="secondary" className="w-full mt-4 font-semibold text-muted-foreground bg-secondary/50 hover:bg-secondary">
                  See All Friends
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border">
            No friends yet. Add some friends to see them here!
          </div>
        )}
      </CardContent>
    </Card>
  );
}