import { useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";

function DatasetsDashboard(): JSX.Element {
  const { data: sessionData } = useSession();

  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Datasets" />

      <DashboardLayout active="my-datasets">
        <MyDatasetsTabContent />
      </DashboardLayout>
    </>
  );
}

export default DatasetsDashboard;
