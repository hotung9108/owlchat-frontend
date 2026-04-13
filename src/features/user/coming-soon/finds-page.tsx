import ComingSoonPage from "./coming-soon-page";
import { Compass } from "lucide-react";

export default function FindsPage() {
    return (
        <ComingSoonPage
            title="Finds"
            description="Khám phá những điều mới và thú vị xung quanh bạn. Tính năng này đang được phát triển!"
            icon={<Compass className="w-12 h-12" />}
        />
    );
}
