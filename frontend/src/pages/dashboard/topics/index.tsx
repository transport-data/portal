import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";
import MyDiscussionsTabContent from "@components/dashboard/MyDiscussionsTabContent";
import MyTopicsTabContent from "@components/dashboard/MyTopicsTabContent";

const TopicsDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const isSysAdmin = sessionData?.user?.sysadmin == true;
  if (!isSysAdmin) return <Loading />;

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
