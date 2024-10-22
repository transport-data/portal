import { formatBytes, formatIcon, getFileName } from "@lib/utils";
import {
  ArrowDownToLineIcon,
  ChevronRightIcon,
  DownloadIcon,
  LinkIcon,
} from "lucide-react";
import { datasetDownloadEvent } from "@utils/ga";
import { Dataset, Resource } from "@interfaces/ckan/dataset.interface";
import { api } from "@utils/api";
import { Skeleton } from "@mui/material";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@env.mjs";
import { toast } from "@components/ui/use-toast";
import { useState } from "react";

const isDownloadable = (url: string) => {
  const _url = new URL(url);
  const urlParts = _url.pathname.split("/");
  const lastPart = urlParts[urlParts.length - 1];
  if (!lastPart) return false;
  return lastPart.includes(".");
};

function PrivateLink({
  resource,
  onClick,
}: {
  resource: Resource;
  onClick?: () => void;
}) {
  const fileName = resource.url ? resource.url.split("/").pop() : null;
  const presignedGetUrl = api.uploads.getPresignedUrl.useQuery(
    { key: `/resources/${resource.id}/${fileName}` },
    {
      enabled: !!resource.id && !!fileName,
    }
  );

  return (
    <a
      href={presignedGetUrl.data}
      onClick={onClick}
      className="font-medium text-gray-500 hover:text-accent"
    >
      {isDownloadable(resource.url ?? "") ? (
        <ArrowDownToLineIcon className="h-5 w-5" />
      ) : (
        <LinkIcon className="h-5 w-5" />
      )}
    </a>
  );
}
function ResourceCard({
  resource,
  dataset,
}: {
  resource: Resource;
  dataset: Dataset;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-y-2">
      <li className="flex items-center justify-between rounded-md border border-gray-200 py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100">
        <div className="flex w-0 flex-1 items-center">
          <img
            src={formatIcon(resource.format?.toLowerCase() ?? "")}
            aria-hidden="true"
            className="h-8 w-8 flex-shrink-0 text-gray-400"
          />
          <div className="ml-4 flex min-w-0 flex-1 gap-2">
            <span className="truncate font-medium">
              {resource.name ?? getFileName(resource.url ?? "")}
            </span>
            {resource.size && (
              <span className="flex-shrink-0 text-gray-400">
                {formatBytes(resource.size)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          {dataset.private && resource.url_type === "upload" ? (
            <PrivateLink
              resource={resource}
              onClick={() =>
                datasetDownloadEvent({
                  datasetTitle: dataset.title,
                  datasetId: dataset.id,
                  datasetName: dataset.name,
                })
              }
            />
          ) : (
            <a
              href={resource.url}
              onClick={() =>
                datasetDownloadEvent({
                  datasetTitle: dataset.title,
                  datasetId: dataset.id,
                  datasetName: dataset.name,
                })
              }
              className="font-medium text-gray-500 hover:text-accent"
            >
              {isDownloadable(resource.url ?? "") ? (
                <ArrowDownToLineIcon className="h-5 w-5" />
              ) : (
                <LinkIcon className="h-5 w-5" />
              )}
            </a>
          )}
        </div>
      </li>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-x-1 text-sm font-semibold text-accent">
            Access by API <ChevronRightIcon className="mt-0.5 h-4 w-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API Usage</DialogTitle>
            <DialogDescription>
              Copy the link below to use the API
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={`${env.NEXT_PUBLIC_CKAN_URL}/api/action/resource_show?id=${resource.id}`}
                readOnly
              />
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${env.NEXT_PUBLIC_CKAN_URL}/api/action/resource_show?id=${resource.id}`
                );
                toast({
                  title: "Link copied to clipboard",
                  duration: 5000,
                });
                setOpen(false);
              }}
              type="button"
              size="sm"
              className="px-3"
            >
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
      {dataResources.length > 0 && (
        <div className="container grid py-8 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-semibold leading-loose text-primary">
              Data and Resources
            </h3>
            {dataset.tdc_category === "tdc_harmonized" && (
              <p className="max-w-lg text-gray-500">
                The dataset is maintained and updated by TDC and comprises of
                data from multiple sources that were validated and harmonised to
                build a single repository.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-4 py-4">
            <ul role="list" className="flex flex-col gap-y-4">
              {dataResources.map((r) => (
                <ResourceCard resource={r} dataset={dataset} />
              ))}
            </ul>
          </div>
        </div>
      )}
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
      {docsResources.length > 0 && (
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
                    <div className="ml-4 flex-shrink-0">
                      {dataset.private && r.url_type === "upload" ? (
                        <PrivateLink resource={r} />
                      ) : (
                        <a
                          href={r.url}
                          className="font-medium text-primary hover:text-accent"
                        >
                          {isDownloadable(r.url ?? "") ? (
                            <ArrowDownToLineIcon className="h-5 w-5" />
                          ) : (
                            <LinkIcon className="h-5 w-5" />
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
