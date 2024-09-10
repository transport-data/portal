import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { Button } from "@components/ui/button";
import GroupsTable from "@components/group/GroupsTable";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import Link from "next/link";

const GroupsDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Groups" />
      <Dashboard current="groups">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Groups
          </h1>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm opacity-75">
                A list of all the groups in your portal.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button asChild variant="secondary">
                <Link href="/dashboard/topics/create">Add Topic</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <GroupsTable
              publicUrl={`${env.NEXT_PUBLIC_PUBLIC_PORTAL_URL}/groups`}
            />
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default GroupsDashboard;
