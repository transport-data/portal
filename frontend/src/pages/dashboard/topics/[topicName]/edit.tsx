import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { EditGroupForm } from "@components/group/EditGroupForm";
import { getServerAuthSession } from "@server/auth";
import type { Group } from "@schema/group.schema";
import { NextSeo } from "next-seo";
import Layout from "@components/_shared/Layout";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { getGroup } from "@utils/group";
import { DeleteGroupButton } from "@components/group/DeleteGroupButton";
import { useRouter } from "next/router";

interface EditGroupPageProps {
  topic: Group;
}

const EditGroupPage: NextPage<EditGroupPageProps> = ({
  topic,
}: EditGroupPageProps) => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title={`Edit - ${topic.title}`} />
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
                    {
                      label: "Dashboard",
                      href: "/dashboard/topics",
                    },
                    {
                      label: "Edit Topic",
                      href: `/dashboard/topic/${topic.name}/edit`,
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
                          Edit Topic
                        </h2>
                        <DeleteGroupButton
                          groupId={topic.name}
                          onSuccess={() => router.push("/dashboard/topics")}
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
            <EditGroupForm initialValues={topic} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const apiKey = session?.user.apikey;
  const topicName = context?.params?.topicName as string;

  if (!session || !apiKey || !topicName) {
    return { notFound: true };
  }
  try {
    const topic = await getGroup({
      id: topicName,
      apiKey,
    });
    return { props: { topic } };
  } catch (e) {
    return { notFound: true };
  }
};

export default EditGroupPage;
