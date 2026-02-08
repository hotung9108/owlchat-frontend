import { Card } from "@/components/ui/card";
import owlLogo from "@/assets/owl-logo/black/owl-512.png";
type Props = React.PropsWithChildren<{}>;

export default function ChatFullView({children}: Props) {
    return (
        <Card
            className="lg:flex
        h-full w-full p-2 items-center
        justify-start bg-secondary
        text-secondary-foreground"
        >
            {children}
        </Card>
    );
}
