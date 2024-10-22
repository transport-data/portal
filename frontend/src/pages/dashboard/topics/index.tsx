import type { NextPage } from "next";

import DashboardLayout from "@components/_shared/DashboardLayout";
import MyTopicsTabContent from "@components/dashboard/MyTopicsTabContent";
import { NextSeo } from "next-seo";
import { getServerAuthSession } from "@server/auth";

export async function getServerSideProps(context: any) {
  const session = await getServerAuthSession(context);
  if (!session?.user.sysadmin) {
    return {
      notFound: true,
    };
  }

  return { props: {} };
}

const TopicsDashboard: NextPage = () => {
  return (
    <>
      <NextSeo title="Newsfeed" />
      <DashboardLayout active="topics">
        <MyTopicsTabContent />
      </DashboardLayout>
    </>
  );
};

export default TopicsDashboard;
