import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@components/_shared/Layout";
import DatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import MyDiscussionsTabContent from "@components/dashboard/MyDiscussionsTabContent";
import MyOrganizationTabContent from "@components/dashboard/MyOrganizationTabContent";
import MyTopicsTabContent from "@components/dashboard/MyTopicsTabContent";
import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { Button } from "@components/ui/button";
import { ChevronLeftIcon, DocumentPlusIcon } from "@heroicons/react/20/solid";

import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Loading from "./Loading";
import Link from "next/link";
import { cn } from "@lib/utils";
import Heading from "./Heading";

interface DashboardLayotProps {
  children: React.ReactNode;
  active: string;
  cta?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayotProps> = ({
  children,
  active,
  cta,
}) => {
  const { data: sessionData } = useSession();
  const isSysAdmin = sessionData?.user?.sysadmin == true;

  if (!sessionData) return <Loading />;
  const tabs = [
    {
      title: "Newsfeed",
      href: "/dashboard/newsfeed",
      id: "newsfeed",
    },
    {
      title: "My Datasets",
      href: "/dashboard/datasets",
      id: "my-datasets",
    },
    {
      title: "My Organisation",
      href: "/dashboard/datasets/my-organization",
      id: "my-organization",
    },
    {
      title: "My Discussions",
      id: "my-discussions",
      href: "/dashboard/discussions",
    },
    ...(isSysAdmin
      ? [
          {
            title: "Topics",
            id: "topics",
            href: "/dashboard/topics",
          },
        ]
      : []),
    {
      title: "Organizations",
      id: "organizations",
      href: "/dashboard/organizations",
    },
  ];
  return (
    <>
      <NextSeo title="Dashboard" />
      <Layout>
        <div className="container w-full">
          <div className="py-8">
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
                <DefaultBreadCrumb
                  links={[
                    { label: "Home", href: "/" },
                    { label: "Dashboard", href: "/dashboard" },
                  ]}
                />
              </nav>
              <div className="mt-4 pb-16 md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                    <div className=" md:flex md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <Heading level={1} size="7xl" align="left">
                          Dashboard
                        </Heading>
                      </div>
                    </div>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border-b border-gray-200 shadow-sm">
            <div className="container">
              <div className="flex flex-col-reverse items-center justify-between gap-1 pb-4 md:flex-row">
                <div className="customized-scroll inline-flex h-14 max-w-[95vw] items-center justify-start overflow-x-auto overflow-y-hidden rounded-md bg-transparent p-1 text-muted-foreground">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.id}
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium text-[#1f2a37] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
                        active === tab.id
                          ? "bg-gray-200 text-foreground shadow-sm"
                          : ""
                      )}
                      href={tab.href}
                    >
                      {tab.title}
                    </Link>
                  ))}
                </div>
                <div className="min-w-full md:min-w-fit">
                  <Button asChild className="justify-between gap-2">
                    <Link href="/dashboard/datasets/create">
                      <DocumentPlusIcon className="h-4 w-4" />
                      Add Data
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] lg:min-h-screen">
            <div className="container pt-5">{children}</div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DashboardLayout;
