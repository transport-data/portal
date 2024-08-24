import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import UsersTable from "@components/user/UsersTable";
import { NextSeo } from "next-seo";

const UsersPage: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Users" />
      <Dashboard current="users">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Users
          </h1>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm opacity-75">
                A list of all the users in your portal.
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <UsersTable />
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default UsersPage;
