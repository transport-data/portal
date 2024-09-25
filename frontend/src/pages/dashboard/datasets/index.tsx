import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import { CKAN, PackageSearchOptions } from "@portaljs/ckan";
import { SWRConfig, unstable_serialize } from "swr";

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
  const backend_url = env.NEXT_PUBLIC_CKAN_URL;
  const ckan = new CKAN(backend_url);
  const options: PackageSearchOptions = {
    offset: 0,
    limit: 20,
    tags: [],
    groups: [],
    orgs: [],
    include_private: true,
    query: `creator_user_id:${session.user.id}`,
  };
  const search_result = await ckan.packageSearch(options);
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
