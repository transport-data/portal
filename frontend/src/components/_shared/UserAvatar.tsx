import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { cn } from "@lib/utils";
import { type User } from "@interfaces/ckan/user.interface";
import { api } from "@utils/api";
import { getUser } from "@utils/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserAvatar({
  image,
  name,
  className,
}: {
  image?: string;
  name: string;
  className?: string;
}) {
  return (
    <Avatar
      className={cn("h-6 w-6 border-2 border-white", className)}
      title={name}
    >
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className="bg-gray-300">
        {name
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
