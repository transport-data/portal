import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { api } from "@utils/api";
import { useMachine } from "@xstate/react";
import datasetOnboardingMachine from "@machines/datasetOnboardingMachine";
import InitialOnboarding from "@components/dataset/Onboarding/InitialOnboarding";
import Action from "@components/dataset/Onboarding/Action";
import Editor from "@components/dataset/Onboarding/Editor";
import { ArrowLeftCircleIcon } from "@heroicons/react/20/solid";
import Spinner from "@components/_shared/Spinner";
import { NextSeo } from "next-seo";

const CreateDatasetDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const [current, send] = useMachine(datasetOnboardingMachine);
  const { data, isLoading } = api.datapackage.getDatapackages.useQuery(
    current.context.fileUrls,
    {
      enabled: current.context.fileUrls.length > 0,
      onSuccess: (data) => {
        send({ type: "addInitialDatapackage", data });
        send("showOverview");
      },
      onError: (error) => {
        send("errorInParsing");
      },
    }
  );
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="Create dataset" />
      <Dashboard current="datasets">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create dataset
          </h1>
          {current.matches("idle") && (
            <InitialOnboarding
              setFileUrls={(urls) => {
                send({ type: "addFileUrls", data: urls });
                send("parseFiles");
              }}
            />
          )}
          {current.matches("parsingFiles") && (
            <div className="flex items-center gap-y-1 py-8">
              <Spinner className="text-gray-500" />{" "}
              <p className="text-gray-500">
                Parsing files... This might take a while.
              </p>
            </div>
          )}
          {current.matches("showingError") && (
            <div className="flex flex-col gap-y-1 py-8">
              <button
                onClick={() => {
                  send("resetValues");
                  send("goBackToStart");
                }}
                className="mb-2 flex flex-nowrap items-center text-sm font-semibold uppercase text-gray-400"
              >
                <ArrowLeftCircleIcon className="mr-1 inline-block h-4 w-4" />
                Reset
              </button>
              <p className="text-red-500">
                There was an error in parsing the files and onboarding the data
              </p>
            </div>
          )}
          <div className="flex max-w-2xl flex-col gap-y-1 py-8">
            {(current.matches("editingMetadata") ||
              current.matches("showingOverview")) && (
              <button
                onClick={() => {
                  send("resetValues");
                  send("goBackToStart");
                }}
                className="mb-2 flex flex-nowrap items-center text-sm font-semibold uppercase text-gray-400"
              >
                <ArrowLeftCircleIcon className="mr-1 inline-block h-4 w-4" />
                Reset
              </button>
            )}
            {current.matches("showingOverview") &&
              current.context.datapackage && (
                <Action
                  onEdit={() => send("editMetadata")}
                  datapackage={current.context.datapackage}
                />
              )}
            {current.matches("editingMetadata") &&
              current.context.datapackage && (
                <Editor
                  datapackage={current.context.datapackage}
                  goBack={(datapackage) => {
                    send("updateDatapackage", { data: datapackage });
                    send("goBackToOverview");
                  }}
                  disableName={false}
                />
              )}
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default CreateDatasetDashboard;
