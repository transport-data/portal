import { Badge } from "@components/ui/badge";
import {
  CheckCircleIcon,
  CircleStackIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";

import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import {
  DocumentSearchIcon,
  EyeOffIcon,
  GlobeAltIcon,
  RegionIcon,
} from "@lib/icons";
import { formatDate } from "@lib/utils";
import { api } from "@utils/api";
import { CircleXIcon } from "lucide-react";
import Link from "next/link";
import { capitalize } from "remeda";
import UserAvatar from "./UserAvatar";

type DatasetCardProps = Dataset & {
  canEdit?: boolean;
  datasetRequest?: boolean;
  removeIcon?: boolean;
};

export const DatasetsCardsLoading = ({ length = 3 }: { length?: number }) =>
  Array.from({ length }).map((_, x) => (
    <div key={x} className="flex w-full cursor-pointer gap-6">
      <div className="flex h-8 w-8 flex-col items-center gap-32 lg:flex-row lg:gap-8">
        <Skeleton className="h-8 w-8 bg-gray-200" />
      </div>
      <Skeleton className="h-[60px] w-full bg-gray-200" />
    </div>
  ));

export default function DashboardDatasetCard(props: DatasetCardProps) {
  const {
    name,
    approval_status,
    tdc_category,
    datasetRequest,
    title,
    removeIcon,
    tags,
    metadata_modified,
    frequency,
    state,
    geographies,
    private: isPrivate,
    contributors,
    organization,
    groups,
    regions,
    canEdit,
  } = props;

  const badgeVariant =
    tdc_category === "tdc_harmonized"
      ? "warning"
      : tdc_category === "tdc_formatted"
      ? "success"
      : "purple";

  const badgeIconOptions = {
    width: 20,
    height: 20,
  };

  const badgeIcon =
    tdc_category === "tdc_harmonized" ? (
      <ShieldCheckIcon {...badgeIconOptions} />
    ) : tdc_category === "tdc_formatted" ? (
      <CheckCircleIcon {...badgeIconOptions} />
    ) : (
      <CircleStackIcon {...badgeIconOptions} />
    );

  const { data: contributorsData } = api.user.getUsersByIds.useQuery({
    ids: contributors,
  });

  const countryOrRegionName =
    regions?.length && regions?.length > 1
      ? "Worldwide"
      : geographies?.length &&
        geographies?.length > 1 &&
        regions?.length &&
        regions?.length === 1
      ? groups?.find((x) => x.name === regions?.at(0))?.title
      : geographies?.length && geographies?.length === 1
      ? groups?.find((x) => x.name === geographies?.at(0))?.title
      : groups?.find((x) => x.name === regions?.at(0))?.title;

  return (
    <Link
      href={`/@${organization?.name?.toLowerCase()}/${name}${
        isPrivate || state === "draft" ? "/private" : ""
      }`}
      className="dataset-card flex w-full cursor-pointer gap-3 lg:gap-6"
    >
      {!removeIcon && (
        <div className="flex h-8 w-8 flex-col items-center gap-32 lg:flex-row lg:gap-8">
          <Badge
            className="flex h-8 w-8 items-center justify-center pl-1.5 pr-1.5"
            icon={badgeIcon}
            variant={badgeVariant}
          />
        </div>
      )}

      <div className="w-full space-y-2 text-sm">
        <div className="flex flex-col justify-between gap-1 lg:flex-row lg:items-center lg:gap-4">
          <div className="group relative  gap-2">
            <h2 className="inline text-lg font-bold">{title}</h2>
            {canEdit && (
              <Button
                variant="default"
                size="pill"
                className=" right-0 ml-2 px-2.5 py-0.5 text-sm"
                asChild
              >
                <Link
                  href={`/dashboard/datasets/${name}/edit${
                    datasetRequest ? "?fromDatasetsRequests=true" : ""
                  }`}
                >
                  <PencilIcon className="mr-1 h-3 w-3" /> Edit
                </Link>
              </Button>
            )}
          </div>
          {tdc_category === "tdc_formatted" && (
            <Badge variant={"success"} className="text-[#03543F]">
              TDC Formatted
            </Badge>
          )}
          {tdc_category === "tdc_harmonized" && (
            <Badge variant={"warning"}>TDC Harmonized</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(tags || [])?.map((k) => (
            <Badge
              key={k.name}
              variant={"purple"}
              className="bg-[#E5EDFF] text-[#42389D]"
            >
              {capitalize(k.display_name ?? "")}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap  gap-2 text-xs md:flex-row md:items-center">
          {state === "draft" ? (
            <Badge
              variant={"success"}
              className="capitalize"
              icon={<DocumentSearchIcon />}
            >
              Draft
            </Badge>
          ) : isPrivate ? (
            <Badge
              variant={"success"}
              className="capitalize"
              icon={<EyeOffIcon />}
            >
              Private
            </Badge>
          ) : (
            <Badge
              variant={"success"}
              className="capitalize"
              icon={<GlobeAltIcon />}
            >
              Public
            </Badge>
          )}
          {["pending", "rejected"].includes(approval_status || "") &&
            datasetRequest && <span className="hidden xl:block">•</span>}

          {datasetRequest &&
            (approval_status === "pending" ? (
              <Badge
                variant={"warning"}
                className="items-center capitalize"
                icon={<QuestionMarkCircleIcon width={16} />}
              >
                {approval_status}
              </Badge>
            ) : (
              approval_status === "rejected" && (
                <Badge
                  variant={"default"}
                  className="items-center bg-red-500 capitalize hover:bg-red-500"
                  icon={<CircleXIcon width={16} height={16} />}
                >
                  {approval_status}
                </Badge>
              )
            ))}
          <span className="hidden xl:block">•</span>
          <span className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.20039 1.3999C4.01474 1.3999 3.83669 1.47365 3.70542 1.60493C3.57414 1.7362 3.50039 1.91425 3.50039 2.0999V2.7999H2.80039C2.42909 2.7999 2.07299 2.9474 1.81044 3.20995C1.54789 3.4725 1.40039 3.8286 1.40039 4.1999V11.1999C1.40039 11.5712 1.54789 11.9273 1.81044 12.1899C2.07299 12.4524 2.42909 12.5999 2.80039 12.5999H11.2004C11.5717 12.5999 11.9278 12.4524 12.1903 12.1899C12.4529 11.9273 12.6004 11.5712 12.6004 11.1999V4.1999C12.6004 3.8286 12.4529 3.4725 12.1903 3.20995C11.9278 2.9474 11.5717 2.7999 11.2004 2.7999H10.5004V2.0999C10.5004 1.91425 10.4266 1.7362 10.2954 1.60493C10.1641 1.47365 9.98604 1.3999 9.80039 1.3999C9.61474 1.3999 9.43669 1.47365 9.30542 1.60493C9.17414 1.7362 9.10039 1.91425 9.10039 2.0999V2.7999H4.90039V2.0999C4.90039 1.91425 4.82664 1.7362 4.69537 1.60493C4.56409 1.47365 4.38604 1.3999 4.20039 1.3999ZM4.20039 4.8999C4.01474 4.8999 3.83669 4.97365 3.70542 5.10493C3.57414 5.2362 3.50039 5.41425 3.50039 5.5999C3.50039 5.78555 3.57414 5.9636 3.70542 6.09488C3.83669 6.22615 4.01474 6.2999 4.20039 6.2999H9.80039C9.98604 6.2999 10.1641 6.22615 10.2954 6.09488C10.4266 5.9636 10.5004 5.78555 10.5004 5.5999C10.5004 5.41425 10.4266 5.2362 10.2954 5.10493C10.1641 4.97365 9.98604 4.8999 9.80039 4.8999H4.20039Z"
                fill="#6B7280"
              />
            </svg>
            {formatDate(metadata_modified ?? "")}
          </span>

          {frequency && (
            <>
              <span className="hidden xl:block">•</span>
              <span className="flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.09961 11.9002C2.09961 11.7146 2.17336 11.5365 2.30463 11.4053C2.43591 11.274 2.61396 11.2002 2.79961 11.2002H11.1996C11.3853 11.2002 11.5633 11.274 11.6946 11.4053C11.8259 11.5365 11.8996 11.7146 11.8996 11.9002C11.8996 12.0859 11.8259 12.2639 11.6946 12.3952C11.5633 12.5265 11.3853 12.6002 11.1996 12.6002H2.79961C2.61396 12.6002 2.43591 12.5265 2.30463 12.3952C2.17336 12.2639 2.09961 12.0859 2.09961 11.9002ZM4.40471 4.69514C4.27348 4.56387 4.19976 4.38586 4.19976 4.20024C4.19976 4.01463 4.27348 3.83661 4.40471 3.70534L6.50471 1.60534C6.63598 1.47411 6.81399 1.40039 6.99961 1.40039C7.18522 1.40039 7.36324 1.47411 7.49451 1.60534L9.59451 3.70534C9.72202 3.83736 9.79257 4.01418 9.79098 4.19772C9.78939 4.38126 9.71577 4.55683 9.58598 4.68661C9.4562 4.8164 9.28063 4.89002 9.09709 4.89161C8.91355 4.89321 8.73673 4.82265 8.60471 4.69514L7.69961 3.79004V9.10024C7.69961 9.28589 7.62586 9.46394 7.49458 9.59522C7.36331 9.72649 7.18526 9.80024 6.99961 9.80024C6.81396 9.80024 6.63591 9.72649 6.50463 9.59522C6.37336 9.46394 6.29961 9.28589 6.29961 9.10024V3.79004L5.39451 4.69514C5.26324 4.82637 5.08522 4.90009 4.89961 4.90009C4.71399 4.90009 4.53598 4.82637 4.40471 4.69514Z"
                    fill="#6B7280"
                  />
                </svg>
                {capitalize(frequency)}
              </span>
            </>
          )}

          {(!!regions?.length || !!geographies?.length) && (
            <>
              <span className="hidden xl:block">•</span>
              <span className="flex items-center gap-1">
                <RegionIcon />
                <span key={`group-${countryOrRegionName}`}>{countryOrRegionName}</span>
              </span>
            </>
          )}

          {contributors && contributors.length > 0 && (
            <>
              <span className="hidden xl:block">•</span>
              <span className="flex items-center gap-1">
                <span>Contributors</span>
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {contributorsData?.map((contributor, i) =>
                    i === 4 ? (
                      <a
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
                        href="#"
                        key={`contributor-${contributor.id}`}
                      >
                        {contributors.length - 4}
                      </a>
                    ) : i < 4 ? (
                      <UserAvatar
                        className="text-[8px]"
                        image={contributor.image_display_url}
                        name={contributor.display_name ?? ""}
                        key={`contributor-${contributor.id}`}
                      />
                    ) : (
                      <></>
                    )
                  )}
                </div>
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
