import type { GetServerSideProps, NextPage } from "next";
import { api } from "@utils/api";
import { getServerAuthSession } from "@server/auth";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { ResourceTable } from "@components/resource/ResourceTable";
import { CreateResourceForm } from "@components/resource/CreateResourceForm";
import Modal from "@components/_shared/Modal";
import { useState } from "react";
import { Button } from "@components/ui/button";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { env } from "@env.mjs";

const ResourcesDashboard: NextPage<{ datasetName: string }> = ({
  datasetName,
}) => {
  const router = useRouter();
  const { data, isError } = api.dataset.get.useQuery({
    name: datasetName,
  });
  const datasetData = data?.result;
  const [showAddForm, setShowAddForm] = useState(false);
  if (isError) void router.push("/404");
  if (!datasetData) return <Loading />;

  return (
    <>
      <NextSeo title={`${datasetData.title} - Datasets`} />
      <Dashboard current="datasets">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Resources of {datasetData.title}
          </h1>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm opacity-75">
                A list of all the resources in your dataset including their
                name, and url
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button variant="secondary" onClick={() => setShowAddForm(true)}>
                Add resource
              </Button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <ResourceTable
              datasetData={datasetData}
              publicUrl={`${env.NEXT_PUBLIC_PUBLIC_PORTAL_URL}/${datasetData.organization?.name}/${datasetData.name}/r`}
            />
          </div>
        </div>
      </Dashboard>
      <Modal
        show={showAddForm}
        setShow={setShowAddForm}
        title="Create resource"
      >
        <CreateResourceForm />
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      datasetName:
        context.params && typeof context.params.datasetName === "string"
          ? context.params.datasetName
          : "",
    },
  };
};

export default ResourcesDashboard;
