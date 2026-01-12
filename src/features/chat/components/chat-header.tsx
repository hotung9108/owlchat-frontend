import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

export default function ChatHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        OwlChat
      </h1>

      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://via.placeholder.com/40" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <ModeToggle />
      </div>
    </header>
  );
}