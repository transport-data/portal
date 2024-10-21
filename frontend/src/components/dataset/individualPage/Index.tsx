import Head from "next/head";
import Layout from "@/components/_shared/Layout";
import { ChevronLeftIcon, ArrowDownToLineIcon, Landmark } from "lucide-react";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@components/ui/button";
import { EnvelopeIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Overview } from "@components/dataset/individualPage/Overview";
import { DatasetPreview } from "@components/dataset/individualPage/DatasetPreview";
import { Metadata } from "@components/dataset/individualPage/Metadata";
import { Downloads } from "@components/dataset/individualPage/Downloads";
import { DefaultTooltip } from "@components/ui/tooltip";
import Link from "next/link";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { toast } from "@components/ui/use-toast";
import { api } from "@utils/api";
import FollowDropdown from "../FollowDropdown";
import { useSession } from "next-auth/react";
import { GroupTree } from "@schema/group.schema";

const siteTitle = "TDC Data Portal";

export default function IndexDatasetPage({
  dataset,
  locationsGroup,
}: {
  dataset: Dataset;
  locationsGroup: GroupTree[];
}): JSX.Element {
  const { data: sessionData } = useSession();
  const { data: datasetDownloads, isLoading } =
    api.ga.getDownloadStats.useQuery({
      id: dataset.id,
    });

  const breadcrumbs = [
    {
      href: `/search`,
      label: "Datasets",
    },
  ];
  const datasetsTab = dataset.resources.some((r) => !!r.datastore_active);
  const overviewTab = !!dataset.introduction_text;

  return (
    <>
      <Head>
        <title>
          {`${dataset.title || dataset.name} - Dataset - ${siteTitle}`}
        </title>
        <meta
          name="description"
          content={`Dataset page for the ${dataset.title || dataset.name} - ${
            dataset.notes
          } `}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="w-full">
          <div className="container py-8">
            <div>
              <nav aria-label="Back" className="sm:hidden">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeftIcon
                    aria-hidden="true"
                    className="-ml-1 mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400"
                  />
                  Back
                </button>
              </nav>
              <nav aria-label="Breadcrumb" className="hidden sm:flex">
                <DefaultBreadCrumb links={breadcrumbs} />
              </nav>
            </div>
            <div className="mt-6 pb-16 md:flex md:items-center md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                  {dataset.title || dataset.name}
                </h2>
                {dataset.tdc_category === "tdc_harmonized" && (
                  <DefaultTooltip
                    contentClassName="max-w-[180px]"
                    content={
                      <div className="flex flex-col">
                        <span className="text-semibold text-sm">
                          TDC Harmonized
                        </span>
                        <div className="text-xs">
                          Data have been validated, and derived from multiple
                          sources by TDC. For more information,{" "}
                          <Link
                            className="underline"
                            target="_blank"
                            href={"https://google.com"}
                          >
                            click here
                          </Link>
                        </div>
                      </div>
                    }
                  >
                    <button
                      className="mt-4 flex w-fit gap-1 rounded-[6px] bg-yellow-100 px-[10px] py-[2px] text-xs font-medium text-yellow-800 transition-colors focus:outline-none focus:ring-2 
                    focus:ring-ring focus:ring-offset-2"
                    >
                      TDC Harmonized
                    </button>
                  </DefaultTooltip>
                )}
                <div
                  className="mt-4 text-justify text-base font-normal leading-normal text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: dataset.notes ?? "-",
                  }}
                ></div>
                <div className="flex flex-col pt-2 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-2.5">
                  <div className="mt-2 flex items-center text-center text-xs font-medium leading-none text-gray-500">
                    <Landmark
                      aria-hidden="true"
                      className="mb-1 mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                    />
                    {dataset.organization?.title || dataset.organization?.name}
                  </div>
                  <div className="mt-2.5 hidden text-center font-['Inter'] text-xs font-medium leading-none text-gray-500 lg:block">
                    •
                  </div>
                  {dataset.metadata_modified && (
                    <>
                      <div className="mt-2 flex items-center text-center text-xs font-medium leading-none text-gray-500">
                        <CalendarIcon
                          aria-hidden="true"
                          className="mb-1 mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                        />
                        Updated{" "}
                        {new Date(dataset.metadata_modified).toDateString()}
                      </div>
                      <div className="mt-2.5 hidden text-center font-['Inter'] text-xs font-medium leading-none text-gray-500 lg:block">
                        •
                      </div>
                    </>
                  )}
                  {datasetDownloads && datasetDownloads.total && (
                    <div className="mt-2 flex items-center text-center text-xs font-medium leading-none text-gray-500">
                      <ArrowDownToLineIcon
                        aria-hidden="true"
                        className="mb-1 mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                      />
                      {datasetDownloads.total}+ Downloads
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue={overviewTab ? "overview" : "metadata"}>
          <div className="border-b border-gray-200 shadow-sm">
            <div className="container flex flex-col items-start justify-end gap-y-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <TabsList className="h-14 max-w-[95vw] justify-start overflow-x-auto bg-transparent">
                {overviewTab && (
                  <TabsTrigger id="overview" value="overview">
                    Overview
                  </TabsTrigger>
                )}
                {datasetsTab && (
                  <TabsTrigger id="dataset" value="dataset">
                    Dataset
                  </TabsTrigger>
                )}
                <TabsTrigger id="metadata" value="metadata">
                  Metadata
                </TabsTrigger>
                <TabsTrigger id="downloads" value="downloads">
                  Downloads
                </TabsTrigger>
              </TabsList>
              <div className="flex w-full items-center justify-end space-x-4 lg:w-auto">
                {dataset.organization && dataset.organization?.email && (
                  <Button variant="secondary" asChild>
                    <a href={`mailto:${dataset.organization.email}`}>
                      <EnvelopeIcon className="mr-2 h-5 w-5" />
                      Contact the contributor
                    </a>
                  </Button>
                )}
                <Button
                  onClick={() => {
                    //copy to clipboard the url
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied to clipboard",
                      description: "You can now share the link with others",
                      duration: 5000,
                    });
                  }}
                  variant="secondary"
                >
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share
                </Button>
                {sessionData?.user && (
                  <FollowDropdown
                    dataset={{
                      id: dataset.id,
                      name: dataset.title ?? dataset.name,
                    }}
                    organization={dataset.organization}
                    geographies={locationsGroup
                      ?.filter((item) => dataset.regions?.includes(item.name))
                      .map((item) => ({
                        ...item,
                        children: item.children.filter((child) =>
                          dataset.geographies?.includes(child.name)
                        ),
                      }))}
                  />
                )}
              </div>
            </div>
          </div>
          {overviewTab && (
            <TabsContent className="mt-0" value="overview">
              <Overview
                introduction_text={dataset.introduction_text as string}
              />
            </TabsContent>
          )}
          {datasetsTab && (
            <TabsContent className="mt-0" value="dataset">
              <DatasetPreview dataset={dataset} />
            </TabsContent>
          )}
          <TabsContent className="mt-0" value="metadata">
            <Metadata dataset={dataset} />
          </TabsContent>
          <TabsContent className="mt-0" value="downloads">
            <Downloads dataset={dataset} />
          </TabsContent>
        </Tabs>
      </Layout>
    </>
  );
}
