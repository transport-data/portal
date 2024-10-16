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
  const utils = api.useContext();

  //const [followOrganization, setFollowOrg] = useState<Checked>(false);
  const [followGeographies, setFollowGeographies] = useState<Checked>(false);

  const { data: followingDataset } = api.user.isFollowingDataset.useQuery({
    dataset: dataset.id,
  });
  const { data: followingOrganization } =
    api.user.isFollowingOrganization.useQuery({
      org: organization?.id ?? "",
    });

  const followDataset = api.dataset.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowingDataset.invalidate();
    },
    onError: () => {},
  });

  const followOrg = api.organization.follow.useMutation({
    onSuccess: () => {
      utils.user.isFollowingOrganization.invalidate();
    },
    onError: () => {},
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Follow</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuCheckboxItem
          checked={followingDataset}
          onSelect={(event) => {
            event.preventDefault();
            return false;
          }}
          onCheckedChange={(event) => {
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
            onCheckedChange={(event) => {
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
        <DropdownMenuCheckboxItem
          checked={followGeographies}
          onCheckedChange={setFollowGeographies}
        >
          United States of America
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  /*(
    <Button
      onClick={() => {
        //copy to clipboard the url

        toast({
          title: "Followed",
          description: "You can now share the link with others",
          duration: 5000,
        });
      }}
      variant="secondary"
      className={cn("", className)}
    >
      Follow
    </Button>
  );*/
}
