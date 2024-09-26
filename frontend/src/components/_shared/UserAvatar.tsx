import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { cn } from "@lib/utils";
import { type User } from "@interfaces/ckan/user.interface";
import { api } from "@utils/api";
import { getUser } from "@utils/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserAvatar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  console.log(user);
  return (
    <Avatar
      className={cn("h-6 w-6 border-2 border-white", className)}
      title={user?.display_name}
    >
      <AvatarImage src={user?.image_url} alt={user?.display_name} />
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
