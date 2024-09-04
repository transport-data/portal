import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@components/_shared/Layout";
import DatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import MyDiscussionsTabContent from "@components/dashboard/MyDiscussionsTabContent";
import MyOrganizationTabContent from "@components/dashboard/MyOrganizationTabContent";
import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { Button } from "@components/ui/button";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

import type { NextPage } from "next";
import { NextSeo } from "next-seo";

const HomeDashboard: NextPage = () => {
  // const { data: sessionData } = useSession();
  // if (!sessionData) return <Loading />;
  const tabs = [
    {
      title: "Newsfeed",
      id: "newsfeed",
      content: <NewsFeedTabContent />,
    },
    {
      title: "My Datasets",
      id: "my-datasets",
      content: <DatasetsTabContent />,
    },
    {
      title: "My Organisation",
      id: "my-organization",
      content: <MyOrganizationTabContent />,
    },
    {
      title: "My Discussions",
      id: "my-discussion",
      content: <MyDiscussionsTabContent />,
    },
  ];
  return (
    <>
      <NextSeo title="Dashboard" />
      <Layout>
        <div className="w-full px-6 sm:px-20">
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
                    <div className="mt-6 md:flex md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                          Dashboard
                        </h2>
                      </div>
                    </div>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="newsfeed">
          <div className="border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 pb-4 sm:px-20">
              <TabsList className="customized-scroll inline-flex h-14 max-w-[95vw] items-center justify-start overflow-x-auto overflow-y-hidden rounded-md bg-transparent p-1 text-muted-foreground">
                {tabs.map((tab) => (
                  <TabsTrigger value={tab.id}>{tab.title}</TabsTrigger>
                ))}
              </TabsList>
              <Button className="justify-between gap-2">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.8002 2.1001C4.37585 2.1001 3.96888 2.26867 3.66882 2.56873C3.36877 2.86878 3.2002 3.27575 3.2002 3.7001V13.3001C3.2002 13.7244 3.36877 14.1314 3.66882 14.4315C3.96888 14.7315 4.37585 14.9001 4.8002 14.9001H11.2002C11.6245 14.9001 12.0315 14.7315 12.3316 14.4315C12.6316 14.1314 12.8002 13.7244 12.8002 13.3001V6.4313C12.8001 6.00699 12.6315 5.60009 12.3314 5.3001L9.6002 2.5689C9.30021 2.26882 8.89331 2.10019 8.469 2.1001H4.8002ZM8.8002 6.9001C8.8002 6.68792 8.71591 6.48444 8.56588 6.33441C8.41585 6.18438 8.21237 6.1001 8.0002 6.1001C7.78802 6.1001 7.58454 6.18438 7.43451 6.33441C7.28448 6.48444 7.2002 6.68792 7.2002 6.9001V8.5001H5.6002C5.38802 8.5001 5.18454 8.58438 5.03451 8.73441C4.88448 8.88444 4.8002 9.08792 4.8002 9.3001C4.8002 9.51227 4.88448 9.71575 5.03451 9.86578C5.18454 10.0158 5.38802 10.1001 5.6002 10.1001H7.2002V11.7001C7.2002 11.9123 7.28448 12.1158 7.43451 12.2658C7.58454 12.4158 7.78802 12.5001 8.0002 12.5001C8.21237 12.5001 8.41585 12.4158 8.56588 12.2658C8.71591 12.1158 8.8002 11.9123 8.8002 11.7001V10.1001H10.4002C10.6124 10.1001 10.8159 10.0158 10.9659 9.86578C11.1159 9.71575 11.2002 9.51227 11.2002 9.3001C11.2002 9.08792 11.1159 8.88444 10.9659 8.73441C10.8159 8.58438 10.6124 8.5001 10.4002 8.5001H8.8002V6.9001Z"
                    fill="white"
                  />
                </svg>
                Add data
              </Button>
            </div>
          </div>
          {tabs.map((tab) => (
            <TabsContent
              className="m-0 mt-0 bg-[#F9FAFB] px-6 sm:px-20"
              value={tab.id}
            >
              <div className="pt-4 sm:pt-6">{tab.content}</div>
            </TabsContent>
          ))}
        </Tabs>
      </Layout>
    </>
  );
};

export default HomeDashboard;
