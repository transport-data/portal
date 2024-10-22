import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsRequestsTabContent from "@components/dashboard/MyDatasetsRequestsTabContent";
import { listUserOrganizations } from "@utils/organization";
import type { InferGetServerSidePropsType, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

export async function getServerSideProps({ req }: any) {
  const session = await getSession({ req });

  const userOrgs = await listUserOrganizations({
    apiKey: session?.user.apikey || "",
    id: session?.user.id || "",
  });

  const adminOrEditorUserOrgs = userOrgs.filter((x) =>
    ["admin", "editor"].includes(x.capacity)
  );

  if (!session?.user.sysadmin && !adminOrEditorUserOrgs.length) {
    return "/404";
  }

  return {
    props: {
      adminOrEditorUserOrgs,
    },
  };
}

const DatasetsDashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ adminOrEditorUserOrgs }) => {
  return (
    <>
      <NextSeo title="My Organization" />
      <DashboardLayout active="datasets-approvals">
        <MyDatasetsRequestsTabContent
          adminOrEditorUserOrgs={adminOrEditorUserOrgs}
        />
      </DashboardLayout>
    </>
  );
};

export default DatasetsDashboard;
