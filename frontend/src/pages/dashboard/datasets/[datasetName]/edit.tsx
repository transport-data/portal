import type { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";

import Loading from "@components/_shared/Loading";
import { Dashboard } from "@components/_shared/Dashboard";
import { api } from "@utils/api";
import { useMachine } from "@xstate/react";
import datasetOnboardingMachine from "@machines/datasetOnboardingMachine";
import {
  ArrowLeftCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import Spinner from "@components/_shared/Spinner";
import { NextSeo } from "next-seo";
import { formatIcon } from "@lib/utils";
import { Steps } from "@components/dataset/form/Steps";
import { MetadataForm } from "@components/dataset/form/Metadata";
import { useForm } from "react-hook-form";
import { DatasetFormType, DatasetSchema } from "@schema/dataset.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button, LoaderButton } from "@components/ui/button";
import { GeneralForm } from "@components/dataset/form/General";
import { UploadsForm } from "@components/dataset/form/Uploads";
import { toast } from "@components/ui/use-toast";
import { match } from "ts-pattern";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { ErrorAlert } from "@components/_shared/Alerts";
import Layout from "@components/_shared/Layout";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { getDataset } from "@utils/dataset";
import { getServerAuthSession } from "@server/auth";
import { Dataset as TdcDataset } from "@interfaces/ckan/dataset.interface";
import { DeleteDatasetButton } from "@components/dataset/DeleteDatasetButton";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ datasetName: string }>
) {
  const session = await getServerAuthSession(context);
  const _dataset = await getDataset({
    id: context?.params?.datasetName ?? "",
    apiKey: session?.user.apikey ?? "",
  });
  if (!_dataset) {
    return {
      notFound: true,
    };
  }
  const dataset = _dataset.result;
  if (!dataset.related_datasets || dataset.related_datasets.length === 0)
    return { props: { dataset } };
  //we need to do this to have the title for the related_datasets in the combobox
  const relatedDatasets = await Promise.all(
    dataset.related_datasets.map((id) =>
      getDataset({
        id,
        apiKey: session?.user.apikey ?? "",
      })
    )
  );
  return {
    props: {
      dataset: {
        ...dataset,
        related_datasets: relatedDatasets.map((d) => d.result),
      },
    },
  };
}

type Dataset = Omit<TdcDataset, "related_datasets"> & {
  related_datasets: TdcDataset[];
};

function convertStringToDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const dateObject = new Date(year as number, (month as number) - 1, day);
  return dateObject;
}

const EditDatasetDashboard: NextPage<{ dataset: Dataset }> = ({ dataset }) => {
  const { data: sessionData } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const editDataset = api.dataset.patch.useMutation({
    onSuccess: async (data) => {
      setErrorMessage(null);
      toast({
        description: `Successfully edited the ${
          data.title ?? data.name
        } dataset`,
      });
      await router.push("/dashboard/newsfeed");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
  const [current, send] = useMachine(datasetOnboardingMachine);
  const form = useForm<DatasetFormType>({
    resolver: zodResolver(DatasetSchema),
    mode: "onBlur",
    defaultValues: {
      ...dataset,
      units: dataset.units ?? [],
      modes: dataset.modes ?? [],
      geographies: dataset.geographies ?? [],
      topics: dataset.topics ?? [],
      sectors: dataset.sectors ?? [],
      services: dataset.services ?? [],
      indicators: dataset.indicators ?? [],
      tags: dataset.tags ?? [],
      temporal_coverage_start: dataset.temporal_coverage_start
        ? convertStringToDate(dataset.temporal_coverage_start)
        : undefined,
      temporal_coverage_end: dataset.temporal_coverage_end
        ? convertStringToDate(dataset.temporal_coverage_end)
        : undefined,
      related_datasets:
        dataset.related_datasets?.map((d) => ({
          name: d.name,
          title: d.title ?? d.name,
        })) ?? [],
    },
  });
  if (!sessionData) return <Loading />;
  function onSubmit(data: DatasetFormType) {
    return editDataset.mutate(data);
  }
  const currentStep = match(current.value)
    .with("general", () => 0)
    .with("metadata", () => 1)
    .with("uploads", () => 2)
    .otherwise(() => 4);
  const checkDisableNext = () =>
    match(current.value)
      .with("general", () => {
        const errorPaths = Object.keys(form.formState.errors);
        return [
          "title",
          "overview",
          "notes",
          "id",
          "is_archived",
          "name",
          "owner_org",
          "tags",
        ].some((e) => {
          return errorPaths.includes(e);
        });
      })
      .with("metadata", () => {
        const errorPaths = Object.keys(form.formState.errors);
        return [
          "sources",
          "language",
          "frequency",
          "tdc_category",
          "modes",
          "services",
          "sectors",
          "temporal_coverage_start",
          "temporal_coverage_end",
          "countries",
          "regions",
          "units",
          "dimensioning",
          "related_datasets",
        ].some((e) => errorPaths.includes(e));
      })
      .with("uploads", () => {
        const errorPaths = Object.keys(form.formState.errors);
        return ["resources", "license"].some((e) => errorPaths.includes(e));
      })
      .otherwise(() => false);

  console.log('FORM ERRORS', form.formState.errors)
  return (
    <>
      <NextSeo title="Edit dataset" />
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
                    { label: "Datasets", href: "/dashboard/datasets" },
                    {
                      label: "Edit Dataset",
                      href: `/dashboard/datasets/${dataset.name}/edit`,
                    },
                  ]}
                />
              </nav>
              <div className="mt-4 pb-16 md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                    <div className="mt-6 md:flex md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                            Edit Dataset
                          </h2>
                          <DeleteDatasetButton
                            datasetId={dataset.id}
                            onSuccess={() => router.push("/dashboard/datasets")}
                          />
                        </div>
                      </div>
                    </div>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container pb-16">
          <Steps currentStep={currentStep} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {current.matches("general") && (
                <>
                  <GeneralForm editing />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={async () => {
                      await form.trigger();
                      if (checkDisableNext()) {
                        return;
                      }
                      return send("next");
                    }}
                  >
                    Next
                  </Button>
                </>
              )}
              {current.matches("metadata") && (
                <>
                  <MetadataForm />
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => send("prev")}
                    >
                      Prev
                    </Button>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={async () => {
                        await form.trigger();
                        if (checkDisableNext()) {
                          return;
                        }
                        return send("next");
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
              {current.matches("uploads") && (
                <>
                  <UploadsForm />
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => send("prev")}
                    >
                      Prev
                    </Button>
                    <LoaderButton
                      loading={editDataset.isLoading}
                      className="w-full"
                      type="submit"
                    >
                      Submit
                    </LoaderButton>
                  </div>
                </>
              )}
              {errorMessage && (
                <div className="mt-4">
                  <ErrorAlert
                    title="Error editing dataset"
                    text={errorMessage}
                  />
                </div>
              )}
            </form>
          </Form>
        </div>
      </Layout>
    </>
  );
};

export default EditDatasetDashboard;
