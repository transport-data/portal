import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import SettingsTabContent from "@components/dashboard/SettingsTabContent";

const SettingsPage: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Settings" />
      <DashboardLayout active="settings">
        <SettingsTabContent />
      </DashboardLayout>
    </>
  );
};

export default SettingsPage;
