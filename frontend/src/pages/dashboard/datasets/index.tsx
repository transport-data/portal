import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import { SWRConfig, unstable_serialize } from "swr";
import { searchDatasets } from "@utils/dataset";
import { SearchDatasetType } from "@schema/dataset.schema";

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
