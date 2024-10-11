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

import _datasets from "@data/datasets.json";
import { Tooltip } from "flowbite-react";
import Link from "next/link";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { RegionIcon } from "@lib/icons";
import { formatDate } from "@lib/utils";
import { Skeleton } from "@components/ui/skeleton";

const tdcCategory: any = {
  tdc_harmonized: "TDC Harmonized",
  tdc_formatted: "TDC Formatted",
};

export default function DatasetsSection({
  datasets,
  isLoading,
}: {
  datasets: Dataset[];
  isLoading?: boolean;
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
        {isLoading ? (
          <>
            <Skeleton className="min-h-[250px]" />
            <Skeleton className="min-h-[250px]" />
            <Skeleton className="min-h-[250px]" />
          </>
        ) : (
          datasets.map((dataset, i) => {
            const [firstTag, secondTag, ...restTags] = dataset.topics || [];
            const regionsLength = dataset.regions?.length ?? 0;
            return (
              <div key={`recent-${i}`} className="">
                <div className="dataset-card flex h-full flex-col gap-4">
                  <Tooltip
                    placement="bottom"
                    className="max-w-[192px] bg-[#1F2A37] "
                    content={
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-sm">
                          {tdcCategory[dataset.tdc_category]}
                        </h4>
                        <p className="text-xs text-[#9CA3AF]">
                          {dataset.tdc_category === "tdc_harmonized" && (
                            <>
                              Data have been validated, and derived from
                              multiple sources by TDC. For more information,{" "}
                              <Link
                                className="underline"
                                target="_blank"
                                href={"#"}
                              >
                                click here
                              </Link>
                            </>
                          )}

                          {dataset.tdc_category === "tdc_formatted" && (
                            <>
                              Data is SDMX-compliant. For more information,{" "}
                              <Link
                                target="_blank"
                                className="underline"
                                href={"#"}
                              >
                                click here
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                    }
                  >
                    {dataset.tdc_category === "tdc_harmonized" && (
                      <Badge
                        icon={<ShieldCheckIcon width={14} />}
                        variant="warning"
                      >
                        TDC Harmonized
                      </Badge>
                    )}
                    {dataset.tdc_category === "tdc_formatted" && (
                      <Badge
                        icon={<CheckCircleIcon width={14} />}
                        variant="success"
                      >
                        TDC Formatted
                      </Badge>
                    )}
                  </Tooltip>

                  {/*Title*/}
                  <Link href={`@${dataset.organization?.name}/${dataset.name}`}>
                    <h4 className="text-2xl font-bold leading-tight">
                      {dataset.title}
                    </h4>
                  </Link>
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
                  <div
                    className=" line-clamp-4 overflow-hidden text-ellipsis text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: dataset.notes ?? "<span></span>",
                    }}
                  ></div>
                  {/*Other Metadatas*/}
                  <div className="mt-auto flex flex-col gap-[8px] text-xs font-medium text-gray-500 ">
                    <div className="flex items-center gap-[4px]">
                      <BuildingLibraryIcon width={14} />
                      <span>{dataset.organization?.title}</span>
                    </div>

                    {dataset.metadata_modified && (
                      <>
                        <div className="flex items-center gap-[4px]">
                          <ClipboardIcon width={14} />
                          <span>
                            {formatDate(dataset.metadata_modified ?? "")}
                          </span>
                        </div>
                      </>
                    )}

                    {dataset.regions && regionsLength > 0 && (
                      <>
                        <div className="flex items-center gap-[4px]">
                          <RegionIcon />
                          <div>
                            {dataset.regions?.map((r, idx) => {
                              return (
                                <span key={`group-${r}`}>
                                  {
                                    dataset.groups?.find((g) => g.name === r)
                                      ?.display_name
                                  }
                                  {idx < regionsLength - 1 && ", "}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/*CTA*/}
                  <Button
                    className="flex w-fit items-center gap-2 border border border-[#E5E7EB] hover:bg-slate-50"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      href={`@${dataset.organization?.name}/${dataset.name}`}
                    >
                      Show Dataset
                      <ArrowRightIcon width={20} />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-[64px]">
        <Button
          asChild
          variant="ghost"
          className="flex w-full border border-[#E5E7EB] hover:bg-slate-50"
        >
          <Link href="/datasets">Show more...</Link>
        </Button>
      </div>
    </div>
  );
}
