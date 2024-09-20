import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import DatasetTable from "@components/dataset/DatasetsTable";
import { Button } from "@components/ui/button";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import Link from "next/link";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
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

