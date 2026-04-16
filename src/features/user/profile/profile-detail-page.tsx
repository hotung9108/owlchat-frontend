import { useParams, useNavigate } from "react-router-dom";
import ProfileContainer from "./profile-container";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileFriends } from "./components/profile-friends";
import { useEffect, useState, useRef } from "react";
import type { UserProfile } from "@/types/user-profile.type";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Mail, Phone, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userProfileService } from "@/services/user-profile-service";

export default function ProfileDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { fetchProfileById } = useUserProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        navigate("/profile");
        return;
      }

      try {
        const data = await fetchProfileById(userId);
        if (data) {
          setProfile(data);
          
          // Fetch actual avatar blob instead of using string URL
          try {
            const avatarBlob = await userProfileService.getUserAvatar(userId);
            const blobUrl = URL.createObjectURL(avatarBlob);
            if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
              URL.revokeObjectURL(blobUrlRef.current);
            }
            blobUrlRef.current = blobUrl;
            setAvatarUrl(blobUrl);
          } catch (err) {
            // Avatar not available, will show fallback
            console.debug("Avatar not available for user:", userId);
          }
        } else {
          navigate("/profile");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, navigate, fetchProfileById]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const getInitials = () => {
    if (!profile?.name) return "U";
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <ProfileContainer>
        <div className="w-full h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ProfileContainer>
    );
  }

  if (!profile) {
    return (
      <ProfileContainer>
        <div className="w-full max-w-[1250px] flex flex-col pb-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/profile")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </Button>
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">Profile not found</p>
          </div>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <div className="w-full max-w-[1250px] flex flex-col pb-10">
        
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/profile")}
          className="mb-4 gap-2 self-start"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Button>

        {/* Profile Header */}
        <div className="w-full relative bg-background rounded-xl shadow-sm border border-border/40 overflow-hidden">
          
          {/* COVER PHOTO */}
          <div className="h-[350px] w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* PROFILE BAR */}
          <div className="px-8 pb-8 flex flex-col md:flex-row items-start relative">
            
            {/* AVATAR */}
            <div className="-mt-[3.5rem] relative z-20 shrink-0">
                <div className="relative inline-block">
                    <Avatar className="h-[140px] w-[140px] rounded-full border-[6px] border-background shadow-md bg-white">
                        <AvatarImage src={avatarUrl} className="object-cover" />
                        <AvatarFallback className="text-xl font-bold">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-3 right-3 h-7 w-7 rounded-full border-[4px] border-background bg-green-500 shadow-sm"></span>
                </div>
            </div>

            {/* USER INFO */}
            <div className="flex-1 flex flex-col pt-4 md:pl-6 gap-3 min-w-0 mt-2">
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{profile?.name}</h1>
                    <p className="text-lg text-muted-foreground font-medium">@{profile?.account?.username}</p>
                </div>

                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                    {profile.name} is a member of OwlChat community.
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground mt-1">
                    {profile?.email && (
                      <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                          <Mail className="h-4 w-4" />
                          <span>{profile.email}</span>
                      </div>
                    )}
                    {profile?.phoneNumber && (
                      <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                          <Phone className="h-4 w-4" />
                          <span>{profile.phoneNumber}</span>
                      </div>
                    )}
                    {profile?.dateOfBirth && (
                      <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                          <CalendarDays className="h-4 w-4" />
                          <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                    {profile?.createdDate && (
                      <div className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
                          <CalendarDays className="h-4 w-4" />
                          <span>Joined {new Date(profile.createdDate).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</span>
                      </div>
                    )}
                </div>

            </div>

        </div>

        </div>

        <Separator className="my-8 bg-border/60" />

        {/* Content Area */}
        <div className="max-w-[1250px] w-full grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8">
            
            {/* Left Column: Contact Info */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                    <h3 className="font-bold text-lg mb-4 text-foreground">Contact Information</h3>
                    <div className="space-y-4 text-sm">
                      {profile?.email && (
                        <div>
                          <p className="text-muted-foreground font-medium">Email</p>
                          <p className="text-foreground font-semibold break-all leading-relaxed">{profile.email}</p>
                        </div>
                      )}
                      {profile?.phoneNumber && (
                        <div>
                          <p className="text-muted-foreground font-medium">Phone</p>
                          <p className="text-foreground font-semibold">{profile.phoneNumber}</p>
                        </div>
                      )}
                      {profile?.dateOfBirth && (
                        <div>
                          <p className="text-muted-foreground font-medium">Date of Birth</p>
                          <p className="text-foreground font-semibold">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {profile?.gender !== undefined && (
                        <div>
                          <p className="text-muted-foreground font-medium">Gender</p>
                          <p className="text-foreground font-semibold">{profile.gender ? "Male" : "Female"}</p>
                        </div>
                      )}
                      {profile?.createdDate && (
                        <div>
                          <p className="text-muted-foreground font-medium">Joined</p>
                          <p className="text-foreground font-semibold">{new Date(profile.createdDate).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</p>
                        </div>
                      )}
                    </div>
                </div>
            </div>

            {/* Right Column: Friends */}
            <div className="md:col-span-7 lg:col-span-8">
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                     <ProfileFriends accountId={profile?.account?.id} />
                </div>
            </div>
        </div>

      </div>
    </ProfileContainer>
  );
}