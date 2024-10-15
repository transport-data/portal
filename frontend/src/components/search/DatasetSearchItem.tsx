import { Badge } from "@components/ui/badge";
import {
  ArrowUpTrayIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ClipboardIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { Tooltip } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function DatasetSearchItem({
  tags,
  metadata_modified,
  frequencies,
  frequency,
  regionOrCountry,
  title,
  name,
  organization,
  id,
  tdc_category,
}: any) {
  const [firstTag, secondTag, ...restTags] = tags;
  const updateDate = new Date(metadata_modified)
    .toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(",", "");

  const router = useRouter();

  const filteredFrequency =
    frequencies
      .find((x: any) => x.name === frequency)
      ?.display_name?.toLowerCase() || "";

  return (
    <div
      id={`dataset-search-item-${title}`}
      className="flex w-full cursor-pointer gap-5"
      onClick={() => router.push(`/${organization.title}/${name}`)}
    >
      <Tooltip
        placement="bottom"
        className="max-w-[192px] bg-[#1F2A37] "
        content={
          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm">
              {tdc_category === "tdc_formatted"
                ? "TDC Formatted"
                : tdc_category === "tdc_harmonized"
                ? "TDC Harmonised"
                : "Community Submitted"}
            </h4>
            <p className="text-xs text-[#9CA3AF]">
              {tdc_category === "tdc_harmonised" ? (
                <>
                  Data have been validated, and derived from multiple sources by
                  TDC. For more information,{" "}
                  <Link className="underline" href={"https://google.com"}>
                    click here
                  </Link>
                </>
              ) : tdc_category === "tdc_formatted" ? (
                <>
                  Data is SDMX-compliant. For more information,{" "}
                  <Link className="underline" href={"https://google.com"}>
                    click here
                  </Link>
                </>
              ) : (
                <>
                  Data sets submitted by individuals and organisation partners.
                </>
              )}
            </p>
          </div>
        }
      >
        {tdc_category === "tdc_formatted" ? (
          <Badge
            className="flex h-[32px] w-[32px] items-center justify-center p-0"
            variant="success"
            icon={<CheckCircleIcon width={20} />}
          />
        ) : tdc_category === "tdc_harmonised" ? (
          <Badge
            className="flex h-[32px] w-[32px] items-center justify-center p-0"
            variant="warning"
            icon={<ShieldCheckIcon width={20} />}
          />
        ) : (
          <Badge
            className="flex h-[32px] w-[32px] items-center justify-center p-0"
            variant="info"
            icon={<CircleStackIcon width={20} />}
          />
        )}
      </Tooltip>

      <div className="flex w-full flex-col justify-start gap-2 lg:flex-row">
        <div className="order-last flex flex-col gap-2 lg:order-first lg:mr-auto">
          <h4 className="text-lg font-bold leading-tight">{title}</h4>
          <div className="flex items-center gap-2">
            {firstTag && <Badge variant="info">{firstTag.display_name}</Badge>}
            {secondTag && (
              <Badge variant="info">{secondTag.display_name}</Badge>
            )}
            {restTags.length > 0 && (
              <Badge variant="info-outline">+{restTags.length} more</Badge>
            )}
          </div>
          <div className="flex flex-col flex-wrap gap-[8px] text-xs font-medium text-gray-500 sm:flex-row sm:items-center">
            <div className="flex gap-[4px]">
              <BuildingLibraryIcon width={14} />
              {organization.title || organization.name}
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex gap-[4px]">
              <ClipboardIcon width={14} />
              Updated {updateDate}
            </div>
            {filteredFrequency ? (
              <>
                <div className="hidden sm:block">•</div>
                <div className="flex gap-[4px]">
                  <ArrowUpTrayIcon width={14} />
                  Updated {filteredFrequency}
                </div>
              </>
            ) : (
              <></>
            )}
            {regionOrCountry ? (
              <>
                <div className="hidden sm:block">•</div>
                <div className="flex gap-[4px]">
                  <GlobeAltIcon width={14} />
                  {regionOrCountry}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <Tooltip
          placement="bottom"
          className="max-w-[192px] bg-[#1F2A37] "
          content={
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm">
                {tdc_category === "tdc_formatted"
                  ? "TDC Formatted"
                  : tdc_category === "tdc_harmonized"
                  ? "TDC Harmonised"
                  : "Community Submitted"}
              </h4>
              <p className="text-xs text-[#9CA3AF]">
                {tdc_category === "tdc_harmonised" ? (
                  <>
                    Data have been validated, and derived from multiple sources
                    by TDC. For more information,{" "}
                    <Link
                      className="underline"
                      target="_blank"
                      href={"https://google.com"}
                    >
                      click here
                    </Link>
                  </>
                ) : tdc_category === "tdc_formatted" ? (
                  <>
                    Data is SDMX-compliant. For more information,{" "}
                    <Link
                      className="underline"
                      target="_blank"
                      href={"https://google.com"}
                    >
                      click here
                    </Link>
                  </>
                ) : (
                  <>
                    Data sets submitted by individuals and organisation
                    partners.
                  </>
                )}
              </p>
            </div>
          }
        >
          {tdc_category === "tdc_formatted" && (
            <Badge className="h-fit lg:ml-auto" variant="success">
              TDC Formatted
            </Badge>
          )}
          {tdc_category === "tdc_harmonised" && (
            <Badge className="h-fit lg:ml-auto" variant="warning">
              TDC Harmonised
            </Badge>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
