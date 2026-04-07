import { ProfileIdentity } from "./components/profile-identity";
import { ProfileFriends } from "./components/profile-friends";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    // Main Content Wrapper
    <div className="w-full max-w-[1250px] flex flex-col pb-10">
      
      {/* 1. Identity Component (Cover + Avatar + Info) */}
      <ProfileIdentity />

      <Separator className="my-8 bg-border/60" />

      {/* 2. Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-8">
          
          {/* Left Collum: Intro / Bio (Placeholder) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                  <h3 className="font-bold text-lg mb-4 text-foreground">Intro</h3>
                  <div className="text-center py-6 text-sm text-muted-foreground bg-secondary/20 rounded-lg border border-dashed border-border">
                      No additional bio information.
                  </div>
              </div>
          </div>

          {/* Right Collum: Friend List */}
          <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                   <ProfileFriends />
              </div>
          </div>
      </div>

    </div>
  );
}