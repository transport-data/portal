import type { NextPage } from "next";
import { getSession } from "next-auth/react";

import DashboardLayout from "@components/_shared/DashboardLayout";
import MyTopicsTabContent from "@components/dashboard/MyTopicsTabContent";
import { NextSeo } from "next-seo";

export async function getServerSideProps({ req }: any) {
  if (!(await getSession({ req }))?.user.sysadmin) {
    return "/404";
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
