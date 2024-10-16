import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { toast } from "@components/ui/use-toast";
import { cn } from "@lib/utils";
import { Organization } from "@portaljs/ckan";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { api } from "@utils/api";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type FollowDatasetType = {
  id: string;
  name: string;
};

type FollowGeographyType = {
  id: string;
  name: string;
};

export default function FollowDropdown({
  dataset,
  organization,
  geographies,
  className = "",
}: {
  className?: string;
  dataset: FollowDatasetType;
  organization?: Organization;
  geographies?: FollowGeographyType[];
}) {
  const utils = api.useUtils();

  const { data: followingDataset } = api.user.isFollowingDataset.useQuery({
    dataset: dataset.id,
  });

  const { data: followingOrganization } =
    api.user.isFollowingOrganization.useQuery({
      org: organization?.id ?? "",
    });

  const { data: followingGeographies } =
    api.user.isFollowingGeographies.useQuery(
      (geographies ?? [])?.map((g) => g.id)
    );

  const followDataset = api.dataset.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowingDataset.invalidate();
    },
  });

  const followOrg = api.organization.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowingOrganization.invalidate();
    },
  });

  const followGeography = api.group.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowingGeographies.invalidate();
    },
  });

  const followingAny =
    followingDataset ||
    followingOrganization ||
    followingGeographies?.some((item) => item.following === true);

  const geographiesFollowingCount =
    followingGeographies?.filter((item) => item.following === true).length ?? 0;

  const followingCount =
    geographiesFollowingCount +
    (followingDataset ? 1 : 0) +
    (followingOrganization ? 1 : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          {followingAny ? (
            <div className="flex gap-2">
              Following{" "}
              <Badge
                variant="default"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray-200 p-0 font-semibold text-gray-900 hover:bg-gray-200"
              >
                {followingCount}
              </Badge>
            </div>
          ) : (
            "Follow"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuCheckboxItem
          checked={followingDataset}
          onSelect={(event) => {
            event.preventDefault();
            return false;
          }}
          onCheckedChange={() => {
            followDataset.mutate({
              dataset: dataset.id,
              isFollowing: followingDataset ?? false,
            });
          }}
        >
          Dataset
        </DropdownMenuCheckboxItem>
        {organization && (
          <DropdownMenuCheckboxItem
            checked={followingOrganization}
            onSelect={(event) => {
              event.preventDefault();
              return false;
            }}
            onCheckedChange={() => {
              followOrg.mutate({
                dataset: organization.id,
                isFollowing: followingOrganization ?? false,
              });
            }}
          >
            {organization.title}
          </DropdownMenuCheckboxItem>
        )}

        <DropdownMenuLabel>Geographies</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {geographies?.map((geo) => (
          <DropdownMenuCheckboxItem
            key={geo.id}
            checked={
              followingGeographies?.find((g) => g.id === geo.id)?.following
            }
            onSelect={(event) => {
              event.preventDefault();
              return false;
            }}
            onCheckedChange={(event) => {
              followGeography.mutate({
                id: geo.id,
                isFollowing:
                  followingGeographies?.find((g) => g.id === geo.id)
                    ?.following ?? false,
              });
            }}
          >
            {geo.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
