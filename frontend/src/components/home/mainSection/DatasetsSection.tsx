import Heading from "@components/_shared/Heading";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  ArrowRightIcon,
  ArrowUturnRightIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ClipboardIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { chunkArray } from "@lib/utils";
import { Dataset } from "@portaljs/ckan";

import _datasets from "@data/datasets.json";
import { Tooltip } from "flowbite-react";
import Link from "next/link";

export default function DatasetsSection({
  datasets,
}: {
  datasets: Array<Dataset>;
}) {
  return (
    <div className="container py-[96px]">
      <div className="mx-auto text-center lg:max-w-[640px]">
        <Heading>Recently added</Heading>
        <p className="mt-4 text-xl font-normal text-gray-500">
          Explore available datasets and gain valuable insights into the
          transportation trends globally
        </p>
      </div>

      <div className="grid-3-separated mt-16 grid grid-cols-1 gap-[32px] md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[64px]">
        {_datasets.map((dataset, i) => {
          const [firstTag, secondTag, ...restTags] = dataset.tags;
          return (
            <div key={`recent-${i}`} className="">
              <div className="dataset-card flex flex-col gap-4">
                <Tooltip
                  placement="bottom"
                  className="max-w-[192px] bg-[#1F2A37] "
                  content={
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm">{dataset.state}</h4>
                      <p className="text-xs text-[#9CA3AF]">
                        {dataset.state === "TDC Harmonised" ? (
                          <>
                            Data have been validated, and derived from multiple
                            sources by TDC. For more information,{" "}
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
                            Data is SDMX-compliant. For more information,{" "}
                            <Link
                              target="_blank"
                              className="underline"
                              href={"https://google.com"}
                            >
                              click here
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  }
                >
                  {dataset.state === "TDC Harmonised" && (
                    <Badge
                      icon={<ShieldCheckIcon width={14} />}
                      variant="warning"
                    >
                      {dataset.state}
                    </Badge>
                  )}
                  {dataset.state === "TDC Formatted" && (
                    <Badge
                      icon={<CheckCircleIcon width={14} />}
                      variant="success"
                    >
                      {dataset.state}
                    </Badge>
                  )}
                </Tooltip>

                {/*Title*/}
                <h4 className="text-2xl font-bold leading-tight">
                  {dataset.title}
                </h4>
                {/*Tags*/}
                <div className="flex flex-wrap gap-2">
                  {firstTag && <Badge variant="info">{firstTag}</Badge>}
                  {secondTag && <Badge variant="info">{secondTag}</Badge>}
                  {restTags.length > 0 && (
                    <Badge variant="info-outline">
                      +{restTags.length} more
                    </Badge>
                  )}
                </div>
                {/*Description*/}
                <p className=" line-clamp-4 overflow-hidden text-ellipsis text-gray-500">
                  {dataset.description}
                </p>
                {/*Other Metadatas*/}
                <div className="flex flex-col gap-[8px] text-xs font-medium text-gray-500 sm:flex-row">
                  <div className="flex gap-[4px]">
                    <BuildingLibraryIcon width={14} />
                    {dataset.organization}
                  </div>
                  <span className="hidden sm:block">•</span>
                  <div className="flex gap-[4px]">
                    <ClipboardIcon width={14} />
                    Updated on 23 March, 2023
                  </div>
                  <span className="hidden sm:block">•</span>
                  <div className="flex gap-[4px]">
                    <GlobeAltIcon width={14} />
                    {dataset.region}
                  </div>
                </div>
                {/*CTA*/}
                <Button
                  className="flex w-fit items-center gap-2 border border border-[#E5E7EB] hover:bg-slate-50"
                  variant="ghost"
                >
                  Show Dataset
                  <ArrowRightIcon width={20} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-[64px]">
        <Button
          variant="ghost"
          className="flex w-full border border-[#E5E7EB] hover:bg-slate-50"
        >
          Show more...
        </Button>
      </div>
    </div>
  );
}
