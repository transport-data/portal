import type { InferGetServerSidePropsType, NextPage } from "next";

import DashboardLayout from "@components/_shared/DashboardLayout";
import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";
import { getServerAuthSession } from "@server/auth";
import { listUserOrganizations } from "@utils/organization";
import { NextSeo } from "next-seo";

export async function getServerSideProps(context: any) {
  const session = await getServerAuthSession(context);

  const userOrgs = await listUserOrganizations({
    apiKey: session?.user.apikey || "",
    id: session?.user.name ?? session?.user.id ?? "",
  });

  const adminOrEditorUserOrgs = userOrgs.filter((x) =>
    ["admin", "editor"].includes(x.capacity)
  );

  return {
    props: {
      isSysAdmin: session?.user.sysadmin,
      adminOrEditorUserOrgs,
    },
  };
}

const NewsFeedDashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ adminOrEditorUserOrgs, isSysAdmin }) => {
  const adminOrEditorUserByOrg = new Map<string, "admin" | "editor">();
  adminOrEditorUserOrgs.forEach((x) =>
    adminOrEditorUserByOrg.set(x.id, x.capacity as any)
  );
  return (
    <>
      <NextSeo title="Newsfeed" />
      <DashboardLayout active="newsfeed">
        <NewsFeedTabContent
          isSysAdmin={isSysAdmin || false}
          adminOrEditorUserOrgs={adminOrEditorUserByOrg}
        />
      </DashboardLayout>
    </>
  );
};

export default NewsFeedDashboard;
