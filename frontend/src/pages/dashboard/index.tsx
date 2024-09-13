import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";
import PageLayout from "@components/dashboard/PageLayout";

import type { NextPage } from "next";

const HomeDashboard: NextPage = () => {
  return (
    <PageLayout currentPage="">
      <NewsFeedTabContent />
    </PageLayout>
  );
};

export default HomeDashboard;
