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
      <Dashboard current="organizations">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Edit organization
          </h1>
          <div className="mt-10 max-w-2xl">
            <OrganizationTabs current="members" />
            <Button
              onClick={() => setIsInvitingUser(true)}
              className="mb-10 ml-auto !inline w-auto"
              variant="secondary"
            >
              Invite member
            </Button>
          </div>
          <OrganizationUsersTable name={organization.name} />
        </div>
      </Dashboard>
      <Modal
        show={isInvitingUser}
        setShow={setIsInvitingUser}
        title="Invite member"
      >
        <InviteUserForm groupId={organization.id} />
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
      input: { id: orgName },
      apiKey,
    });
    return { props: { organization } };
  } catch (e) {
    return { notFound: true };
  }
};

export default OrganizationMembersPage;
