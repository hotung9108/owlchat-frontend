import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Pencil, CalendarDays, Plus, Loader2, Upload } from "lucide-react";
import type { UserProfile, UserProfileRequest } from "@/types/user-profile.type";
import { userProfileService } from "@/services/user-profile-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileIdentityProps {
  profile: UserProfile | null;
}

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editData, setEditData] = useState<UserProfileRequest>({
    name: profile?.name || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
    gender: profile?.gender,
    dateOfBirth: profile?.dateOfBirth,
  });

  // Fetch avatar blob and convert to object URL
  useEffect(() => {
    let cleanupUrl: string | null = null;

    if (profile?.id && profile?.avatar) {
      userProfileService.getUserAvatar(profile.id)
        .then(blob => {
          const url = URL.createObjectURL(blob);
          cleanupUrl = url;
          setAvatarUrl(url);
        })
        .catch(error => console.error("Failed to load avatar:", error));
    } else {
      setAvatarUrl(null);
    }

    return () => {
      if (cleanupUrl) {
        URL.revokeObjectURL(cleanupUrl);
      }
    };
  }, [profile?.id, profile?.avatar]);

  const getInitials = () => {
    if (!profile?.name) return "U";
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    setAvatarLoading(true);
    try {
      await userProfileService.uploadUserAvatar(profile.id, file);
      window.location.reload();
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Upload avatar failed. Please try again.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!profile?.id) return;
    setEditLoading(true);
    try {
      await userProfileService.updateProfile(profile.id, editData);
      setEditDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Update failed. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="w-full relative bg-background rounded-xl shadow-sm border border-border/40 overflow-hidden">
      
      {/* 1. COVER PHOTO */}
      <div className="h-[450px] w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative group">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
      </div>

      {/* 2. PROFILE BAR (Avatar + Info) */}
      <div className="px-8 pb-8 flex flex-col md:flex-row items-start relative">
        
        {/* AVATAR (Overlapping the banner) */}
        <div className="-mt-[4.5rem] relative z-20 shrink-0">
            <div className="relative inline-block group">
                <Avatar className="h-[168px] w-[168px] rounded-full border-[6px] border-background shadow-md bg-white">
                    <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold">{getInitials()}</AvatarFallback>
                </Avatar>
                {/* Status Bubble */}
                <span className="absolute bottom-4 right-4 h-8 w-8 rounded-full border-[4px] border-background bg-green-500 shadow-sm"></span>
                
                {/* Avatar Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  {avatarLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={avatarLoading}
                />
            </div>
        </div>

        {/* USER INFO */}
        <div className="flex-1 flex flex-col pt-4 md:pl-6 gap-3 min-w-0 mt-2">
            
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-bold text-foreground tracking-tight">{profile?.name || "User"}</h1>
                <p className="text-lg text-muted-foreground font-medium">@{profile?.account?.username || "unknown"}</p>
            </div>

            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                {profile?.name ? `${profile.name} is a member of OwlChat community.` : "Loading..."}
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

        {/* ACTIONS BUTTONS */}
        <div className="mt-6 md:mt-8 flex gap-3 shrink-0 self-start md:self-center">
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-10 px-6" disabled>
                <Plus className="h-4 w-4 mr-2" /> Add to Story
             </Button>
             <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
               <DialogTrigger asChild>
                 <Button variant="secondary" className="bg-secondary/80 hover:bg-secondary font-semibold h-10 px-6">
                    <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                 </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                   <DialogTitle>Edit Your Profile</DialogTitle>
                   <DialogDescription>
                     Update your profile information below.
                   </DialogDescription>
                 </DialogHeader>
                 <div className="grid gap-4 py-4">
                   <div className="grid gap-2">
                     <Label htmlFor="name">Full Name</Label>
                     <Input
                       id="name"
                       value={editData.name}
                       onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                       id="email"
                       type="email"
                       value={editData.email}
                       onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="phone">Phone Number</Label>
                     <Input
                       id="phone"
                       value={editData.phoneNumber}
                       onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="gender">Gender</Label>
                     <select
                       id="gender"
                       value={editData.gender === undefined ? "" : editData.gender ? "male" : "female"}
                       onChange={(e) => setEditData({ ...editData, gender: e.target.value === "" ? undefined : e.target.value === "male" })}
                       className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <option value="">Select Gender</option>
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                     </select>
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="dob">Date of Birth</Label>
                     <Input
                       id="dob"
                       type="date"
                       value={editData.dateOfBirth || ""}
                       onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value || undefined })}
                     />
                   </div>
                 </div>
                 <div className="flex gap-4 justify-end">
                   <Button
                     variant="outline"
                     onClick={() => setEditDialogOpen(false)}
                     disabled={editLoading}
                   >
                     Cancel
                   </Button>
                   <Button
                     onClick={handleEditProfile}
                     disabled={editLoading}
                     className="gap-2"
                   >
                     {editLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                     Save Changes
                   </Button>
                 </div>
               </DialogContent>
             </Dialog>
        </div>

      </div>
    </div>
  );
}