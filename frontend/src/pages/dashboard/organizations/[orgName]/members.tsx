import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { getServerAuthSession } from "@server/auth";
import { getOrganization } from "@utils/organization";
import { Organization } from "@portaljs/ckan";
import OrganizationTabs from "@components/organization/OrganizationTabs";
import { Button } from "@components/ui/button";
import Modal from "@components/_shared/Modal";
import { useState } from "react";
import { InviteUserForm } from "@components/user/InviteUserForm";
import OrganizationUsersTable from "@components/organization/OrganizationUsersTable";
import { NextSeo } from "next-seo";
import Layout from "@components/_shared/Layout";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import Link from "next/link";

interface OrganizationMembersPageProps {
  organization: Organization;
}

const OrganizationMembersPage: NextPage<OrganizationMembersPageProps> = ({
  organization,
}: OrganizationMembersPageProps) => {
  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title={`Members - ${organization.title}`} />
      <Layout>
<div className="container w-full">
          <div className="pt-8">
            <div>
              <nav aria-label="Back" className="sm:hidden">
                <Link
                  href={`/dashboard/organizations`}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeftIcon
                    aria-hidden="true"
                    className="-ml-1 mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400"
                  />
                  Organizations
                </Link>
              </nav>
              <nav aria-label="Breadcrumb" className="hidden sm:flex">
                <DefaultBreadCrumb
                  links={[
                    { label: "Home", href: "/" },
                    { label: "Dashboard", href: "/dashboard" },
                    {
                      label: "Organizations",
                      href: "/dashboard/organizations",
                    },
                    {
                      label: "Edit Organization",
                      href: `/dashboard/organizations/${organization.name}/edit`,
                    },
                    {
                      label: "Edit Organization Members",
                      href: `/dashboard/organizations/${organization.name}/members`,
                    },
                  ]}
                />
              </nav>
              <div className="mt-4 pb-8 md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                    <div className="mt-6 md:flex md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                          Edit Organization Members
                        </h2>
                      </div>
                    </div>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
            <div className="mt-10">
              <OrganizationTabs current="members" />
            <div className="flex items-center justify-end">
              <Button
                onClick={() => setIsInvitingUser(true)}
                className="mb-10 ml-auto !inline w-auto"
              >
                Add member
              </Button></div>
            </div>
            <OrganizationUsersTable name={organization.name} />
        </div>
      </Layout>
      <Modal
        show={isInvitingUser}
        setShow={setIsInvitingUser}
        title="Add member"
      >
        <InviteUserForm groupId={organization.id} orgUsers={organization.users ?? []} />
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const apiKey = session?.user.apikey;
  const orgName = context?.params?.orgName as string;

  if (!session || !apiKey || !orgName) {
    return { notFound: true };
  }
  try {
    //  404s if the org doesn't exist
    const organization = await getOrganization({
      input: { id: orgName, includeUsers: true },
      apiKey,
    });
    return { props: { organization } };
  } catch (e) {
    return { notFound: true };
  }
};

export default OrganizationMembersPage;
