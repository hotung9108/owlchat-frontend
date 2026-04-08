import { useEffect, useState } from "react";
import { ProfileIdentity } from "./components/profile-identity";
import { ProfileFriends } from "./components/profile-friends";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/use-user-profile";
import type { UserProfile } from "@/types/user-profile.type";

export default function ProfilePage() {
  const { fetchUserProfile } = useUserProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data || null);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [fetchUserProfile]);

  return (
    // Main Content Wrapper
    <div className="w-full max-w-[1250px] flex flex-col pb-10">
      
      {/* 1. Identity Component (Cover + Avatar + Info) */}
      <ProfileIdentity profile={profile} />

      <Separator className="my-8 bg-border/60" />

      {/* 2. Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8">
          
          {/* Left Collum: Contact Info */}
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

          {/* Right Collum: Friend List */}
          <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                   <ProfileFriends accountId={profile?.account?.id} />
              </div>
          </div>
      </div>

    </div>
  );
}