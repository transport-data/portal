import type { InferGetServerSidePropsType, NextPage } from "next";
import { NextSeo } from "next-seo";

import DashboardLayout from "@components/_shared/DashboardLayout";
import MyDatasetsRequestsTabContent from "@components/dashboard/DatasetsApprovalTabContent";
import { getServerAuthSession } from "@server/auth";
import { listUserOrganizations } from "@utils/organization";

export async function getServerSideProps(context: any) {
  const session = await getServerAuthSession(context);

  const userOrgs = await listUserOrganizations({
    apiKey: session?.user.apikey || "",
    id: session?.user.id || "",
  });

  const adminOrEditorUserOrgs = userOrgs.filter((x) =>
    ["admin", "editor"].includes(x.capacity),
  );

  if (!session?.user.sysadmin && !adminOrEditorUserOrgs.length) {
    return {
      notFound: true,
    };
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
      <NextSeo title="My Organisation" />
      <DashboardLayout active="datasets-approvals">
        <MyDatasetsRequestsTabContent
          adminOrEditorUserOrgs={adminOrEditorUserOrgs}
        />
      </DashboardLayout>
    </>
  );
};

export default DatasetsDashboard;
