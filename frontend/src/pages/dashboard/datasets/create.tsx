import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { api } from "@utils/api";
import { useMachine } from "@xstate/react";
import datasetOnboardingMachine from "@machines/datasetOnboardingMachine";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { NextSeo } from "next-seo";
import { formatIcon, slugify } from "@lib/utils";
import { Steps } from "@components/dataset/form/Steps";
import { MetadataForm } from "@components/dataset/form/Metadata";
import { useForm, UseFormReturn, UseFormWatch } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { ErrorAlert } from "@components/_shared/Alerts";
import { DefaultBreadCrumb } from "@components/ui/breadcrumb";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { TRPCClientErrorLike } from "@trpc/client";
import UntrackedContributorCheckbox from "@components/dataset/form/UntrackedContributorCheckbox";
import { useUserGlobalOrganizationRoles } from "@hooks/user";

const docs = [
  {
    title: "SDMX Technical Specifications",
    format: "PDF",
    url: "https://sdmx.org/?page_id=5008",
  },
  {
    title: "Help & FAQ Section of the platform",
    format: "PDF",
    url: "/faq",
  },
];

const CreateDatasetDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { canReviewDatasets } = useUserGlobalOrganizationRoles()
  const router = useRouter();
  const createDataset = api.dataset.create.useMutation({
    onSuccess: async (data) => {
      setErrorMessage(null);
      toast({
        description: `Successfully created the ${
          data.title ?? data.name
        } dataset`,
      });
      await router.push("/dashboard/datasets");
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
      id: uuidv4(),
      private: true,
      title: "",
      notes: "",
      state: "active",
      tdc_category: "public",
      geographies: [],
      topics: [],
      sectors: [],
      services: [],
      modes: [],
      tags: [],
      units: [],
      indicators: [],
      related_datasets: [],
    },
  });
  useEffect(() => {
    if (!form.formState.dirtyFields["name"])
      form.setValue("name", slugify(form.watch("title")));
  }, [form.watch("title")]);
  if (!sessionData) return <Loading />;
  function onSubmit(data: DatasetFormType) {
    return createDataset.mutate(data);
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

  return (
    <>
      <NextSeo title="Create dataset" />
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-y-4 px-4 py-8 lg:px-20">
          <nav className="mb-6 hidden sm:flex">
            <DefaultBreadCrumb
              links={[
                { label: "Home", href: "/" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Datasets", href: "/dashboard/datasets" },
                {
                  label: "Create Dataset",
                  href: "#",
                },
              ]}
            />
          </nav>

          <Steps currentStep={currentStep} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {current.matches("general") && (
                <>
                  <GeneralForm />
                  <div className="flex items-center gap-4">
                    <SaveDraftButton
                      form={form}
                      onError={(error: TRPCClientErrorLike<any>) => {
                        setErrorMessage(error.message);
                      }}
                      onSuccess={async (data: Dataset) => {
                        setErrorMessage(null);
                      }}
                    />
                    <Button
                      type="button"
                      className="w-full"
                      onClick={async () => {
                        await form.trigger();
                        if (form.watch("name").length < 2) {
                          form.setError("name", {
                            type: "manual",
                            message:
                              "Name needs to be at least 2 characters long",
                          });
                          return;
                        }
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
                  <MetadataForm />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-fit"
                      onClick={() => send("prev")}
                    >
                      Previous
                    </Button>
                    <SaveDraftButton
                      form={form}
                      onError={(error: TRPCClientErrorLike<any>) => {
                        setErrorMessage(error.message);
                      }}
                      onSuccess={async (data: Dataset) => {
                        setErrorMessage(null);
                      }}
                    />
                    <Button
                      type="button"
                      className="w-full"
                      onClick={async () => {
                        await form.trigger();
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
                        if (!next && checkDisableNext()) {
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
                  <UploadsForm />
                  {canReviewDatasets && <UntrackedContributorCheckbox form={form} />}
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => send("prev")}
                    >
                      Previous
                    </Button>
                    <SaveDraftButton
                      form={form}
                      onError={(error: TRPCClientErrorLike<any>) => {
                        setErrorMessage(error.message);
                      }}
                      onSuccess={async (data: Dataset) => {
                        setErrorMessage(null);
                      }}
                    />
                    <LoaderButton
                      loading={createDataset.isLoading}
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
                    title="Error creating dataset"
                    text={errorMessage}
                  />
                </div>
              )}
            </form>
          </Form>
        </div>
        <div className="order-first flex flex-col items-center bg-gray-50 px-4 py-8 lg:order-last lg:px-20">
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <h1 className="self-stretch text-4xl font-extrabold leading-9 text-black">
              Before you add data.
            </h1>
            <p className="self-stretch text-base font-normal leading-normal text-gray-500">
              Please make sure you familiarised yourself with our data
              submission guidelines to ensure that your data meets our quality
              standards and is properly formatted. This will help ensure that
              your data is accurately represented and can be effectively used by
              TDC users.
            </p>
            <ul
              role="list"
              className="w-full divide-y divide-gray-100 rounded-md border border-gray-200"
            >
              {docs.map((d, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
                >
                  <div className="flex flex-1 items-center">
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">{d.title}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={d.url}
                      className="font-medium text-gray-500 hover:text-accent"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDatasetDashboard;

export const SaveDraftButton = ({
  form,
  update = false,
  onSuccess,
  onError,
}: {
  update?: boolean;
  onSuccess: Function;
  onError: Function;
  form: UseFormReturn<DatasetFormType>;
}) => {
  const router = useRouter();
  const createDraftDataset = api.dataset.draft.useMutation({
    onSuccess: async (data) => {
      onSuccess(data);
      toast({
        description: `Successfully created the ${
          data?.title ?? data?.name
        } dataset as Draft`,
      });
      await router.push("/dashboard/datasets");
    },
    onError: (error) => {
      onError(error);
    },
  });

  const validatePrimeRequiredFields = () => {
    const primeRequiredFields = ["name", "notes", "owner_org"];
    let hasPrimeError = false;
    for (var name in form.formState.errors) {
      if (primeRequiredFields.find((f) => f === name)) {
        hasPrimeError = true;
        break;
      }
    }
    return !hasPrimeError;
  };

  const handleSaveDraft = async () => {
    form.trigger().then(() => {
      if (validatePrimeRequiredFields()) {
        const { id, ...otherValues } = form.getValues();
        createDraftDataset.mutate({
          ...(update ? { id } : {}),
          ...otherValues,
          private: true,
        });
      }
    });

    return false;
  };

  return (
    <Button
      variant="secondary"
      onClick={(e) => {
        e.preventDefault();
        handleSaveDraft();
        return false;
      }}
    >
      Save Draft
    </Button>
  );
};
