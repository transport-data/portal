import type { InferGetServerSidePropsType, NextPage } from "next";
import { useSession } from "next-auth/react";

import DashboardLayout from "@components/_shared/DashboardLayout";
import Loading from "@components/_shared/Loading";
import OrganizationsTabContent from "@components/dashboard/OrganizationsTabContent";
import { getServerAuthSession } from "@server/auth";
import { listUserOrganizations } from "@utils/organization";
import { NextSeo } from "next-seo";
import JoinOrganizationModalButton from "@components/dashboard/JoinOrganizationModal";

export async function getServerSideProps(context: any) {
  const session = await getServerAuthSession(context);
  const apiKey = (context as any).session?.apiKey || "";

  const userOrganizations = await listUserOrganizations({
    apiKey,
    id: session?.user?.id || "",
  });

  return {
    props: {
      userOrganizations,
    },
  };
}

const OrgsDashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ userOrganizations }) => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Newsfeed" />
      <DashboardLayout active="organizations">
        {!!userOrganizations.length && (
          <OrganizationsTabContent userOrganizations={userOrganizations} />
        )}
        {!userOrganizations.length && (
          <JoinOrganizationModalButton
            render={(setIsShow) => {
              return (
                <p className="text-[14px]">
                  You are not a member of an organisation yet.{" "}
                  <button
                    onClick={() => setIsShow(true)}
                    className="font-semibold text-accent underline"
                  >
                    Click here
                  </button>{" "}
                  to request to join an organisation or request the creation of
                  a new one.
                </p>
              );
            }}
          />
        )}
      </DashboardLayout>
    </>
  );
};

export default OrgsDashboard;
