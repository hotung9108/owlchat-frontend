import { useParams } from "react-router-dom";
import ProfileContainer from "./profile-container";
import { Card } from "@/components/ui/card";

export default function ProfileDetailPage() {
  const { userId } = useParams();

  return (
    <ProfileContainer>
      <div className="flex h-full w-full items-center justify-center p-6">
        <Card className="p-8 backdrop-blur-sm bg-background/60">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            Profile Detail View
          </h1>
          <p className="text-muted-foreground mt-2">
            Viewing user ID: {userId || "Unknown"}
          </p>
        </Card>
      </div>
    </ProfileContainer>
  );
}