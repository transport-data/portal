import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import NewsFeedTabContent from "@components/dashboard/NewsFeedTabContent";
import MyDiscussionsTabContent from "@components/dashboard/MyDiscussionsTabContent";
import MyTopicsTabContent from "@components/dashboard/MyTopicsTabContent";
import OrganizationsTabContent from "@components/dashboard/OrganizationsTabContent";

const OrgsDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Newsfeed" />
      <DashboardLayout active="organizations">
        <OrganizationsTabContent />
      </DashboardLayout>
    </>
  );
};

export default OrgsDashboard;
