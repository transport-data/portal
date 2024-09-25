import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { getUserById } from "@lib/getUserById";
import { cn } from "@lib/utils";
import { User } from "@portaljs/ckan";
import { useEffect, useState } from "react";

export default function UserAvatar({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    getUserById(id).then((v) => setUser(v as any));
  }, []);
  return (
    <Avatar className={cn("h-6 w-6 border-2 border-white", className)}>
      <AvatarImage src={user?.image_url} alt={id} />
      <AvatarFallback className="bg-gray-300">
        {user?.display_name
          ?.trim()
          .split(" ")
          .map((word) => word[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
