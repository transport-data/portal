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

export default function DatasetSearchItem(props: any) {
  const [firstTag, secondTag, ...restTags] = props.tags;

  return (
    <div className="flex w-full gap-5">
      {props.state === "TDC Formatted" ? (
        <Badge
          className="flex h-[32px] w-[32px] items-center justify-center p-0"
          variant="success"
          icon={<CheckCircleIcon width={20} />}
        />
      ) : props.state === "TDC Harmonised" ? (
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

      <div className="flex w-full flex-col justify-start gap-2 lg:flex-row">
        <div className="order-last lg:mr-auto flex flex-col gap-2 lg:order-first">
          <h4 className="text-lg font-bold leading-tight">{props.title}</h4>
          <div className="flex items-center gap-2">
            {firstTag && <Badge variant="info">{firstTag}</Badge>}
            {secondTag && <Badge variant="info">{secondTag}</Badge>}
            {restTags.length > 0 && (
              <Badge variant="info-outline">+{restTags.length} more</Badge>
            )}
          </div>
          <div className="flex flex-col flex-wrap gap-[8px] text-xs font-medium text-gray-500 sm:flex-row sm:items-center">
            <div className="flex gap-[4px]">
              <BuildingLibraryIcon width={14} />
              JRC
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex gap-[4px]">
              <ClipboardIcon width={14} />
              Updated on 23 March, 2023
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex gap-[4px]">
              <ArrowUpTrayIcon width={14} />
              Updated anually
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex gap-[4px]">
              <GlobeAltIcon width={14} />
              Europe
            </div>
          </div>
        </div>
        <Tooltip
          placement="bottom"
          className="max-w-[192px] bg-[#1F2A37] "
          content={
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm">{props.state}</h4>
              <p className="text-xs text-[#9CA3AF]">
                {props.state === "TDC Harmonised" ? (
                  <>
                    Data have been validated, and derived from multiple sources
                    by TDC. For more information,{" "}
                    <Link className="underline" 
                      target="_blank"
                      href={"https://google.com"}>
                      click here
                    </Link>
                  </>
                ) : (
                  <>
                    Data is SDMX-compliant. For more information,{" "}
                    <Link className="underline" 
                      target="_blank"
                      href={"https://google.com"}>
                      click here
                    </Link>
                  </>
                )}
              </p>
            </div>
          }
        >
          {props.state === "TDC Formatted" && (
            <Badge className="h-fit lg:ml-auto" variant="success">
              TDC Formatted
            </Badge>
          )}
          {props.state === "TDC Harmonised" && (
            <Badge className="h-fit lg:ml-auto" variant="warning">
              TDC Harmonised
            </Badge>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
