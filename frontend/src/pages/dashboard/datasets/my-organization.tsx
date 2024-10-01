import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyOrganizationTabContent from "@components/dashboard/MyOrganizationTabContent";

const DatasetsDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="My Organization" />
      <DashboardLayout active="my-organization">
        <MyOrganizationTabContent />
      </DashboardLayout>
    </>
  );
};

export default DatasetsDashboard;
