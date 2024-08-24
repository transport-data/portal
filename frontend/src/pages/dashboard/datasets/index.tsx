import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import DatasetTable from "@components/dataset/DatasetsTable";
import { Button } from "@components/ui/button";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";
import Link from "next/link";

const DatasetsDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Datasets" />
      <Dashboard current="datasets">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Datasets
          </h1>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm opacity-75">
                A list of all the datasets in your portal including their name,
                title, description and image.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button asChild variant="secondary">
                <Link href="/dashboard/datasets/create">
                Add dataset
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <DatasetTable publicUrl={env.NEXT_PUBLIC_PUBLIC_PORTAL_URL ?? '/'} />
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default DatasetsDashboard;
