import UserLayout from "../user-layout";

type Props = React.PropsWithChildren<{}>;

export default function FriendLayout({ children }: Props) {
    return (
        <UserLayout>
            <div className="flex-1">{children}</div>
        </UserLayout>
    );
}