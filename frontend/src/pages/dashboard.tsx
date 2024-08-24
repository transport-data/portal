import { useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import DatasetsStats from "@components/dashboard/DatasetsStats";
import type { NextPage } from "next";
import RecentlyUpdatedDatasetsList from "@components/dashboard/RecentlyUpdatedDatasetsList";
import ActivityStream from "@components/dashboard/ActivityStream";
import { Button } from "@components/ui/button";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import Link from "next/link";

const HomeDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Dashboard" />
      <Dashboard current="dashboard">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm opacity-75">
                Welcome to PortalJS Cloud!
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button asChild variant="secondary">
                <Link href="/datasets/create">Add dataset</Link>
              </Button>
            </div>
          </div>
          <section className="mt-10">
            <DatasetsStats />
            <RecentlyUpdatedDatasetsList
              publicUrl={env.NEXT_PUBLIC_PUBLIC_PORTAL_URL ?? "/"}
            />
            <ActivityStream />
          </section>
        </div>
      </Dashboard>
    </>
  );
};

export default HomeDashboard;
