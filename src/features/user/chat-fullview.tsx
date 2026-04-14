import { Card } from "@/components/ui/card";
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
