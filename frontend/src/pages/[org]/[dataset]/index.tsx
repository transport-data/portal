import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Layout from "@/components/_shared/Layout";
import { Dataset as DatasetType } from "@portaljs/ckan";
import { CKAN } from "@portaljs/ckan";
import { env } from "@env.mjs";
import {
  Building2Icon,
  ChevronLeftIcon,
  DownloadIcon,
  ArrowDownToLineIcon,
  Landmark,
} from "lucide-react";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@components/ui/button";
import { EnvelopeIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Overview } from "@components/dataset/individualPage/Overview";
import { DatasetPreview } from "@components/dataset/individualPage/DatasetPreview";
import { Metadata } from "@components/dataset/individualPage/Metadata";
import { Downloads } from "@components/dataset/individualPage/Downloads";
import { Badge } from "@components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import useMatomoTracker from "@lib/useMatomoTracker";
import { api } from "@utils/api";
import { DefaultTooltip } from "@components/ui/tooltip";
import Link from "next/link";

const siteTitle = "TDC Data Portal";
const backend_url = env.NEXT_PUBLIC_CKAN_URL;

export async function getStaticPaths() {
  const ckan = new CKAN(backend_url);
  const paths = (
    await ckan.getDatasetsListWithDetails({ offset: 0, limit: 1000 })
  ).map((dataset: DatasetType) => ({
    params: {
      dataset: dataset.name,
      org: dataset.organization?.name ?? "no-org",
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ckan = new CKAN(backend_url);
  try {
    const datasetName = context.params?.dataset;
    if (!datasetName) {
      return {
        notFound: true,
      };
    }
    let dataset = await ckan.getDatasetDetails(datasetName as string);
    if (!dataset) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        dataset,
      },
      revalidate: 1800,
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function DatasetPage({
  dataset,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  useMatomoTracker();
  const tabs = [
    {
      id: "overview",
      content: <Overview dataset={dataset} />,
      title: "Overview",
    },
    {
      id: "dataset",
      content: <DatasetPreview dataset={dataset} />,
      title: "Dataset",
    },
    {
      id: "metadata",
      content: <Metadata dataset={dataset} />,
      title: "Metadata",
    },
    {
      id: "downloads",
      content: <Downloads dataset={dataset} />,
      title: "Downloads",
    },
  ];
  const breadcrumbs = [
    {
      href: `/search`,
      label: "Datasets",
    },
    {
      href: `/${dataset.organization?.name}`,
      label: `${dataset.organization?.title || dataset.organizatio?.name}`,
    },
  ];
  const matomo = api.matomo.getVisitorStats.useQuery();
  return (
    <>
      <Head>
        <title>
          {`${dataset.title || dataset.name} - Dataset - ${siteTitle}`}
        </title>
        <meta
          name="description"
          content={`Dataset page for the ${dataset.title || dataset.name} - ${
            dataset.description
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
                <DefaultTooltip
                  contentClassName="max-w-[180px]"
                  content={
                    <div className="flex flex-col">
                      <span className="text-semibold text-sm">TDC Harmonized</span>
                      <div className="text-xs">
                      Data have been validated, and derived from multiple
                      sources by TDC. For more information,{" "}
                      <Link className="underline" 
                        target="_blank"
                        href={"https://google.com"}>
                        click here
                      </Link></div>
                    </div>
                  }
                >
                  <button className="mt-4 flex w-fit gap-1 rounded-[6px] px-[10px] py-[2px] text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                    text-yellow-800 bg-yellow-100">
                      TDC Harmonized
                  </button>
                </DefaultTooltip>
                <div className="mt-4 text-justify text-base font-normal leading-normal text-gray-500">
                  {dataset.notes ?? "-"}
                </div>
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
                  <div className="mt-2 flex items-center text-center text-xs font-medium leading-none text-gray-500">
                    <CalendarIcon
                      aria-hidden="true"
                      className="mb-1 mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                    />
                    Updated {new Date(dataset.metadata_modified).toDateString()}
                  </div>
                  <div className="mt-2.5 hidden text-center font-['Inter'] text-xs font-medium leading-none text-gray-500 lg:block">
                    •
                  </div>
                  <div className="mt-2 flex items-center text-center text-xs font-medium leading-none text-gray-500">
                    <ArrowDownToLineIcon
                      aria-hidden="true"
                      className="mb-1 mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-500"
                    />
                    1700+ Downloads
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="overview">
          <div className="border-b border-gray-200 shadow-sm">
            <div className="container flex flex-col items-start justify-end gap-y-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <TabsList className="h-14 max-w-[95vw] justify-start overflow-x-auto bg-transparent">
                {tabs.map((tab) => (
                  <TabsTrigger value={tab.id}>{tab.title}</TabsTrigger>
                ))}
              </TabsList>
              <div className="flex w-full items-center justify-end space-x-4 lg:w-auto">
                <Button variant="secondary">
                  <EnvelopeIcon className="mr-2 h-5 w-5" />
                  Contact the contributor
                </Button>
                <Button variant="secondary">
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          {tabs.map((tab) => (
            <TabsContent className="mt-0" value={tab.id}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </Layout>
    </>
  );
}
