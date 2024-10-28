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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { HeartIcon } from "@heroicons/react/24/outline";
import { Organization } from "@portaljs/ckan";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { GroupTree } from "@schema/group.schema";
import { api } from "@utils/api";

type FollowDatasetType = {
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
  geographies?: GroupTree[];
}) {
  const utils = api.useUtils();

  const { data: followingDataset } = api.user.isFollowingDataset.useQuery({
    dataset: dataset.id,
  });

  const { data: followingOrganization } =
    api.user.isFollowingOrganization.useQuery({
      org: organization?.id ?? "",
    });

  const { data: followedGroups } = api.user.isFollowingGeographies.useQuery(
    Array.from(
      new Set(
        geographies?.flatMap((parent) => [
          parent.id,
          ...parent.children.map((child) => child.id),
        ])
      )
    )
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
    (followedGroups && followedGroups?.length > 0);

  const geographiesFollowingCount = followedGroups ? followedGroups.length : 0;

  const followingCount =
    geographiesFollowingCount +
    (followingDataset ? 1 : 0) +
    (followingOrganization ? 1 : 0);

  return (
    <TooltipProvider delayDuration={100}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="follow-btn">
            <HeartIcon className="mr-2 h-4 w-4" />
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
        <DropdownMenuContent
          className="follow-content max-h-[300px] w-56 overflow-auto"
          align="end"
        >
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
            <Tooltip>
              <TooltipTrigger>This Dataset</TooltipTrigger>
              <TooltipContent className={``}>{dataset.name}</TooltipContent>
            </Tooltip>
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
              <Tooltip>
                <TooltipTrigger>This Organization</TooltipTrigger>
                <TooltipContent className={``}>
                  {organization.title}
                </TooltipContent>
              </Tooltip>
            </DropdownMenuCheckboxItem>
          )}
          {geographies && geographies?.length > 0 && (
            <>
              <DropdownMenuLabel className="">Regions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {geographies?.map((geo) => (
                <DropdownGeoGroup
                  followingGeographies={followedGroups}
                  key={geo.id}
                  group={geo}
                  onChange={followGeography.mutate}
                />
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}

const DropdownGeoGroup = ({
  followingGeographies,
  group,
  onChange,
}: {
  followingGeographies: any;
  group: GroupTree;
  onChange: Function;
}) => {
  const groupChecked = followingGeographies?.find((g: string) => g === group.id)
    ? true
    : false;
  return (
    <div>
      <DropdownMenuCheckboxItem
        checked={groupChecked}
        onSelect={(event) => {
          event.preventDefault();
          return false;
        }}
        onCheckedChange={(event) => {
          onChange({
            id: group.id,
            isFollowing: groupChecked,
          });
        }}
      >
        <span className="">{group.title}</span>
      </DropdownMenuCheckboxItem>
      {group.children.length > 0 && (
        <div>
          {group.children.map((child) => {
            const childChecked = followingGeographies?.find(
              (g: string) => g === child.id
            )
              ? true
              : false;
            return (
              <div key={child.id}>
                <DropdownMenuCheckboxItem
                  className="pl-10"
                  checked={childChecked}
                  disabled={groupChecked}
                  onSelect={(event) => {
                    event.preventDefault();
                    return false;
                  }}
                  onCheckedChange={(event) => {
                    onChange({
                      id: child.id,
                      isFollowing: childChecked,
                    });
                  }}
                >
                  {child.title}
                </DropdownMenuCheckboxItem>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
