import DashboardLayout from "@components/_shared/DashboardLayout";
import Loading from "@components/_shared/Loading";
import MyDatasetsRequestsTabContent from "@components/dashboard/MyDatasetsRequestsTabContent";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const DatasetsDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const isSysAdmin = sessionData?.user?.sysadmin == true;
  if (!isSysAdmin) {
    useRouter().push("/404");
    return <Loading />;
  }

  return (
    <>
      <NextSeo title="My Organization" />
      <DashboardLayout active="datasets-requests">
        <MyDatasetsRequestsTabContent />
      </DashboardLayout>
    </>
  );
};

export default DatasetsDashboard;
