import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { CreateOrganizationForm } from "@components/organization/CreateOrganizationForm";
import { NextSeo } from "next-seo";

const CreateOrganizationPage: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Create organization" />
      <Dashboard current="organizations">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create organization
          </h1>
          <div className="mt-10 max-w-2xl">
            <CreateOrganizationForm />
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default CreateOrganizationPage;
