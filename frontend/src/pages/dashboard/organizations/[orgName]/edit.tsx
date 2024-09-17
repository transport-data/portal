import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { EditOrganizationForm } from "@components/organization/EditOrganizationForm";
import { getServerAuthSession } from "@server/auth";
import { getOrganization } from "@utils/organization";
import type { Organization } from "@schema/organization.schema";
import OrganizationTabs from "@components/organization/OrganizationTabs";
import { NextSeo } from "next-seo";
import Layout from "@components/_shared/Layout";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { useRouter } from "next/router";
import { DeleteOrganizationButton } from "@components/organization/DeleteOrganizationButton";

interface EditOrganizationPageProps {
  organization: Organization;
}

const EditOrganizationPage: NextPage<EditOrganizationPageProps> = ({
  organization,
}: EditOrganizationPageProps) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title={`Edit - ${organization.title}`} />
      <Layout>
        <div className="container w-full">
          <div className="pt-8">
            <div>
              <nav aria-label="Back" className="sm:hidden">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeftIcon
                    aria-hidden="true"
                    className="-ml-1 mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400"
                  />
                  Back
                </button>
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
                      href: `/dashboard/organization/${organization.name}/edit`,
                    },
                  ]}
                />
              </nav>
              <div className="mt-4 pb-8 md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                    <div className="mt-6 md:flex md:items-center md:justify-between">
                      <div className="flex min-w-0 max-w-4xl flex-1 justify-between">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                          Edit Organization
                        </h2>
                        <DeleteOrganizationButton
                          groupId={organization.id}
                          onSuccess={() =>
                            router.push("/dashboard/organizations")
                          }
                        />
                      </div>
                    </div>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container pb-8">
          <div className="max-w-4xl">
            <OrganizationTabs current="edit" />
            <EditOrganizationForm initialValues={organization} />
          </div>
        </div>
      </Layout>
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
