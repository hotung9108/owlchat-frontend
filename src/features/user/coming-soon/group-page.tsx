import ComingSoonPage from "./coming-soon-page";
import { Users } from "lucide-react";

export default function GroupPage() {
    return (
        <ComingSoonPage
            title="Groups"
            description="Tạo và quản lý các nhóm trò chuyện. Tính năng này đang được phát triển!"
            icon={<Users className="w-12 h-12" />}
        />
    );
}
