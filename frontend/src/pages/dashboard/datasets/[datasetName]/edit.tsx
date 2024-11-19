import type { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { Form } from "@/components/ui/form";
import { ErrorAlert } from "@components/_shared/Alerts";
import Layout from "@components/_shared/Layout";
import Loading from "@components/_shared/Loading";
import ApproveDatasetButton from "@components/dataset/ApproveDatasetButton";
import { DeleteDatasetButton } from "@components/dataset/DeleteDatasetButton";
import { GeneralForm } from "@components/dataset/form/General";
import { MetadataForm } from "@components/dataset/form/Metadata";
import { Steps } from "@components/dataset/form/Steps";
import { UploadsForm } from "@components/dataset/form/Uploads";
import RejectDatasetButton from "@components/dataset/RejectDatasetButton";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { Button, LoaderButton } from "@components/ui/button";
import { toast } from "@components/ui/use-toast";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dataset as TdcDataset } from "@interfaces/ckan/dataset.interface";
import { cn } from "@lib/utils";
import datasetOnboardingMachine from "@machines/datasetOnboardingMachine";
import { DatasetFormType, DatasetSchema } from "@schema/dataset.schema";
import { getServerAuthSession } from "@server/auth";
import { api } from "@utils/api";
import { getDataset } from "@utils/dataset";
import { listUserOrganizations } from "@utils/organization";
import { useMachine } from "@xstate/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { match } from "ts-pattern";
import { SaveDraftButton } from "../create";
import { TRPCClientErrorLike } from "@trpc/client";
import { DefaultTooltip } from "@components/ui/tooltip";

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

  const userOrgs = await listUserOrganizations({
    apiKey: session?.user.apikey || "",
    id: session?.user.id || "",
  });

  const fromDatasetsRequests = !!context.query.fromDatasetsRequests;
  const userOrganization = userOrgs.find(
    (x) => x.id === dataset.organization?.id
  );

  if (
    (!userOrganization || userOrganization.capacity === "member") &&
    !session?.user.sysadmin
  ) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  if (!dataset.related_datasets || dataset.related_datasets.length === 0)
    return {
      props: {
        isUserAdminOfTheDatasetOrg:
          session?.user.sysadmin || userOrganization?.capacity === "admin",
        dataset,
        fromDatasetsRequests,
      },
    };
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
      isUserAdminOfTheDatasetOrg: userOrganization,
      fromDatasetsRequests,
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
  if (date.length > 10) {
    return new Date(date);
  }
  const [year, month, day] = date.split("-").map(Number);
  const dateObject = new Date(year as number, (month as number) - 1, day);
  return dateObject;
}

const EditDatasetDashboard: NextPage<{
  dataset: Dataset;
  isUserAdminOfTheDatasetOrg: boolean;
  fromDatasetsRequests: boolean;
}> = ({ dataset, isUserAdminOfTheDatasetOrg, fromDatasetsRequests }) => {
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
      if (fromDatasetsRequests)
        await router.push("/dashboard/datasets-approvals");
      else await router.push("/dashboard/datasets");
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
      resources: dataset.resources.map(r => ({
        ...r,
        datastore_active: undefined
      })),
      comments: dataset.comments
        ? dataset.comments.map((c) => ({
            ...c,
            date: convertStringToDate(c.date),
          }))
        : [],
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
    return editDataset.mutate({
      ...data,
      state: "active",
    });
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

  const disabledForm = isUserAdminOfTheDatasetOrg
    ? false
    : dataset.approval_status === "pending";

  const SaveAsDraft = () => {
    return dataset.approval_status !== "pending" ? (
      <SaveDraftButton
        update={true}
        form={form}
        onError={(error: TRPCClientErrorLike<any>) => {
          setErrorMessage(error.message);
        }}
        onSuccess={async (data: Dataset) => {
          setErrorMessage(null);
        }}
      />
    ) : null;
  };

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
                    fromDatasetsRequests
                      ? {
                          label: "Dataset Approval",
                          href: "/dashboard/datasets-approvals",
                        }
                      : { label: "Datasets", href: "/dashboard/datasets" },
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
                          <div className="flex flex-col gap-2 sm:flex-row">
                            {isUserAdminOfTheDatasetOrg && (
                              <>
                                {["pending", "rejected"].includes(
                                  dataset.approval_status || ""
                                ) && (
                                  <ApproveDatasetButton
                                    datasetId={dataset.id}
                                    onSuccess={() =>
                                      router.push(
                                        "/dashboard/datasets-approvals"
                                      )
                                    }
                                  />
                                )}
                                {"pending" === dataset.approval_status && (
                                  <>
                                    <RejectDatasetButton
                                      dataset={dataset as any}
                                      onSuccess={() =>
                                        router.push(
                                          "/dashboard/datasets-approvals"
                                        )
                                      }
                                    />
                                  </>
                                )}
                              </>
                            )}
                            <DeleteDatasetButton
                              datasetId={dataset.id}
                              onSuccess={() =>
                                router.push("/dashboard/datasets")
                              }
                            />
                          </div>
                        </div>
                        {dataset.approval_message && (
                          <div
                            className="mt-4 border-l-4 border-orange-500 bg-orange-100 p-4 text-base text-orange-700"
                            role="alert"
                          >
                            <p className="font-bold">Rejection reason</p>
                            <p>{dataset.approval_message}</p>
                          </div>
                        )}
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
                  <GeneralForm
                    isUserAdminOfTheDatasetOrg={isUserAdminOfTheDatasetOrg}
                    disabled={disabledForm}
                  />
                  <div className="flex w-full flex-col gap-4 md:flex-row">
                    <SaveAsDraft />
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
              {current.matches("metadata") && (
                <>
                  <MetadataForm disabled={disabledForm} />
                  <div className="flex w-full flex-col gap-4 md:flex-row">
                    <SaveAsDraft />
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => send("prev")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={async () => {
                        const next = await form.trigger();
                        if (
                          form.watch("temporal_coverage_start") >
                          form.watch("temporal_coverage_end")
                        ) {
                          form.setError("temporal_coverage_end", {
                            type: "manual",
                            message:
                              "End date should be greater than start date",
                          });
                          return;
                        }
                        if (next && checkDisableNext()) {
                          return;
                        } else {
                          return send("next");
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
              {current.matches("uploads") && (
                <>
                  <UploadsForm disabled={disabledForm} />
                  <div className="flex w-full flex-col gap-4 md:flex-row">
                    <SaveAsDraft />
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => send("prev")}
                    >
                      Previous
                    </Button>
                    {disabledForm ? (
                      <DefaultTooltip content="The dataset is pending wait for an approval or refusal to make any changes">
                        <LoaderButton
                          disabled={disabledForm}
                          className={cn(
                            disabledForm && "cursor-not-allowed",
                            "w-full"
                          )}
                          loading={editDataset.isLoading}
                          type="submit"
                        >
                          Submit
                        </LoaderButton>
                      </DefaultTooltip>
                    ) : (
                      <LoaderButton
                        className={cn(
                          disabledForm && "cursor-not-allowed",
                          "w-full"
                        )}
                        loading={editDataset.isLoading}
                        type="submit"
                      >
                        Submit
                      </LoaderButton>
                    )}
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
