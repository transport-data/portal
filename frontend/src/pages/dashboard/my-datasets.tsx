import MyDatasetsTabContent from "@components/dashboard/MyDatasetsTabContent";
import PageLayout from "@components/dashboard/PageLayout";

import type { NextPage } from "next";

const DatasetsDashboard: NextPage = () => {
  return (
    <PageLayout currentPage="my-datasets">
      <MyDatasetsTabContent />
    </PageLayout>
  );
};

export default DatasetsDashboard;
