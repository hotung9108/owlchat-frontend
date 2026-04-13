import ComingSoonPage from "./coming-soon-page";
import { ShoppingBag } from "lucide-react";

export default function MarketplacePage() {
    return (
        <ComingSoonPage
            title="Marketplace"
            description="Khám phá thị trường và giao dịch với những người dùng khác. Tính năng này đang được phát triển!"
            icon={<ShoppingBag className="w-12 h-12" />}
        />
    );
}
