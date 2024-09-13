import MyDiscussionsTabContent from "@components/dashboard/MyDiscussionsTabContent";
import PageLayout from "@components/dashboard/PageLayout";

import type { NextPage } from "next";

const DatasetsDashboard: NextPage = () => {
  return (
    <PageLayout currentPage="my-discussions">
      <MyDiscussionsTabContent />
    </PageLayout>
  );
};

export default DatasetsDashboard;
