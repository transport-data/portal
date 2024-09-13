import MyOrganizationTabContent from "@components/dashboard/MyOrganizationTabContent";
import PageLayout from "@components/dashboard/PageLayout";

import type { NextPage } from "next";

const DatasetsDashboard: NextPage = () => {
  return (
    <PageLayout currentPage="my-organization">
      <MyOrganizationTabContent />
    </PageLayout>
  );
};

export default DatasetsDashboard;
