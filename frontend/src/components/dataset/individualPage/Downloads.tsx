import { formatBytes, formatIcon, getFileName } from "@lib/utils";
import {
  ArrowDownToLineIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "lucide-react";
import { datasetDownloadEvent } from "@utils/ga";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { api } from "@utils/api";
import { Skeleton } from "@mui/material";

export function Downloads({ dataset }: { dataset: Dataset }) {
  const { data: datasetDownloads, isLoading } =
    api.ga.getDownloadStats.useQuery({
      id: dataset.id,
    });
  const dataResources = dataset.resources.filter(
    (r) => r.resource_type && r.resource_type === "data"
  );
  const docsResources = dataset.resources.filter(
    (r) => r.resource_type && r.resource_type === "documentation"
  );
  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Data and Resources
          </h3>
          {dataset.tdc_category === "tdc_harmonized" && (
            <p className="max-w-lg text-gray-500">
              The dataset is maintained and updated by TDC and comprises of data
              from multiple sources that were validated and harmonised to build
              a single repository.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <ul
            role="list"
            className="divide-y divide-gray-100 rounded-md border border-gray-200"
          >
            {dataResources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
              >
                <div className="flex w-0 flex-1 items-center">
                  <img
                    src={formatIcon(r.format?.toLowerCase() ?? "")}
                    aria-hidden="true"
                    className="h-8 w-8 flex-shrink-0 text-gray-400"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      {r.name ?? getFileName(r.url ?? "")}
                    </span>
                    {r.size && (
                      <span className="flex-shrink-0 text-gray-400">
                        {formatBytes(r.size)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a
                    href={r.url}
                    onClick={() =>
                      datasetDownloadEvent({
                        datasetTitle: dataset.title,
                        datasetId: dataset.id,
                        datasetName: dataset.name,
                      })
                    }
                    className="font-medium text-gray-500 hover:text-accent"
                  >
                    <ArrowDownToLineIcon className="h-5 w-5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <span className="flex items-center gap-x-1 text-sm font-semibold text-accent">
            Show advanced options{" "}
            <ChevronRightIcon className="mt-0.5 h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Downloads statistics
          </h3>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <div className="grid grid-cols-2">
            <div className="pb-4 pl-4">
              <dd className="flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    datasetDownloads?.lastSixMonths
                  )}
                </p>
              </dd>
              <p className="truncate text-sm font-medium text-gray-500">
                Downloads past 6 Months
              </p>
            </div>
            <div className="pb-4 pl-4">
              <dd className="flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    datasetDownloads?.total
                  )}
                </p>
              </dd>
              <p className="truncate text-sm font-medium text-gray-500">
                Total downloads
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container grid py-8 lg:grid-cols-2">
        <div>
          <h3 className="text-3xl font-semibold leading-loose text-primary">
            Documentation
          </h3>
          <p className="max-w-lg text-gray-500">
            Expanded description and dataset documentation
          </p>
        </div>
        <div className="flex flex-col gap-y-4 py-4">
          <ul
            role="list"
            className="divide-y divide-gray-100 rounded-md border border-gray-200"
          >
            {docsResources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
              >
                <div className="flex w-0 flex-1 items-center">
                  <img
                    src={formatIcon(r.format?.toLowerCase() ?? "")}
                    aria-hidden="true"
                    className="h-8 w-8 flex-shrink-0 text-gray-400"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">
                      {r.name ?? getFileName(r.url ?? "")}
                    </span>
                    {r.size && (
                      <span className="flex-shrink-0 text-gray-400">
                        {formatBytes(r.size)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <a
                    href={r.url}
                    className="font-medium text-primary hover:text-accent"
                  >
                    <DownloadIcon className="h-5 w-5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
