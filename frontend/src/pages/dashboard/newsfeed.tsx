import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";

const NewsFeedDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Newsfeed" />
      <DashboardLayout active="newsfeed">
        <NewsFeedTabContent />
      </DashboardLayout>
    </>
  );
};

export default NewsFeedDashboard;
