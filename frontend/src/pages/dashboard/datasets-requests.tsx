import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsRequestsTabContent from "@components/dashboard/MyDatasetsRequestsTabContent";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

export async function getServerSideProps({ req }: any) {
  if (!(await getSession({ req }))?.user.sysadmin) {
    return "/404";
  }

  return { props: {} };
}

const DatasetsDashboard: NextPage = () => {
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
