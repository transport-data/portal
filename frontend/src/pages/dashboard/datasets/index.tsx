import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import { SWRConfig, unstable_serialize } from "swr";
import { searchDatasets } from "@utils/dataset";
import { SearchDatasetType } from "@schema/dataset.schema";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

function DatasetsDashboard({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>): JSX.Element {
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
