import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import { CKAN } from "@portaljs/ckan";
import { SWRConfig, unstable_serialize } from "swr";
import { packageSearch } from "@lib/dataset";
import { PackageSearch } from "@interfaces/ckan/package.interface";

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

  const options: PackageSearch = {
    offset: 0,
    limit: 20,
    tags: [],
    groups: [],
    orgs: [],
    include_private: true,
    include_drafts: true,
    query: `creator_user_id:${session.user.id}`,
    token: session.user.apikey,
  };
  const search_result = await packageSearch(options);
  return {
    props: {
      fallback: {
        [unstable_serialize(["package_search", options])]: search_result,
      },
    },
  };
};

function DatasetsDashboard({
  fallback,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { data: sessionData } = useSession();

  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Datasets" />
      <SWRConfig value={{ fallback }}>
        <DashboardLayout active="my-datasets">
          <MyDatasetsTabContent />
        </DashboardLayout>
      </SWRConfig>
    </>
  );
}

export default DatasetsDashboard;
