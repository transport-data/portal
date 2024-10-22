import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import DashboardLayout from "@components/_shared/DashboardLayout";
import Loading from "@components/_shared/Loading";
import OrganizationsTabContent from "@components/dashboard/OrganizationsTabContent";
import { NextSeo } from "next-seo";

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
