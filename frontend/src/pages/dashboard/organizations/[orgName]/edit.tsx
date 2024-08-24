import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { EditOrganizationForm } from "@components/organization/EditOrganizationForm";
import { getServerAuthSession } from "@server/auth";
import { getOrganization } from "@utils/organization";
import type { Organization } from "@portaljs/ckan";
import OrganizationTabs from "@components/organization/OrganizationTabs";
import { NextSeo } from "next-seo";

interface EditOrganizationPageProps {
  organization: Organization;
}

const EditOrganizationPage: NextPage<EditOrganizationPageProps> = ({
  organization,
}: EditOrganizationPageProps) => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title={`Edit - ${organization.title}`} />
      <Dashboard current="organizations">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Edit organization
          </h1>
          <div className="mt-10 max-w-2xl">
            <OrganizationTabs current="edit" />
            <EditOrganizationForm initialValues={organization} />
          </div>
        </div>
      </Dashboard>
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
    const organization = await getOrganization({
      input: { id: orgName },
      apiKey,
    });
    return { props: { organization } };
  } catch (e) {
    return { notFound: true };
  }
};

export default EditOrganizationPage;
