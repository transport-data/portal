import type { NextPage } from "next";
import { Dashboard } from "@components/_shared/Dashboard";
import { Button } from "@components/ui/button";
import OrganizationsTable from "@components/organization/OrganizationsTable";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import Link from "next/link";

const OrganizationsDashboard: NextPage = () => {
  return (
    <>
      <NextSeo title="Organizations" />
      <Dashboard current="organizations">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Organizations
          </h1>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm opacity-75">
                A list of all the organizations in your portal, including their
                name, title, description and other info.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button asChild variant="secondary">
                <Link href="/dashboard/organizations/create">Add organization</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <OrganizationsTable publicUrl={env.NEXT_PUBLIC_PUBLIC_PORTAL_URL ?? '/'} />
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default OrganizationsDashboard;
