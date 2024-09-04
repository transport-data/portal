import type { NextPage } from "next";
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
import { Button } from "@components/ui/button";
import { GeneralForm } from "@components/dataset/form/General";
import { UploadsForm } from "@components/dataset/form/Uploads";
import { toast } from "@components/ui/use-toast";
import { match } from "ts-pattern";

const docs = [
  {
    title: "Data Submission Guidelines",
    format: "PDF",
    url: "https://example.com",
  },
  {
    title: "Data Submission Guidelines",
    format: "PDF",
    url: "https://example.com",
  },
  {
    title: "Data Submission Guidelines",
    format: "PDF",
    url: "https://example.com",
  },
  {
    title: "Step by Step Guide to Data Submission",
    format: "MP4",
    url: "https://example.com",
  },
];

const CreateDatasetDashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const [current, send] = useMachine(datasetOnboardingMachine);
  const form = useForm<DatasetFormType>({
    resolver: zodResolver(DatasetSchema),
    mode: "onBlur",
    defaultValues: {
      countries: [],
      regions: [],
      userRepresents: false,
      tags: [],
    },
  });
  if (!sessionData) return <Loading />;
  function onSubmit(data: DatasetFormType) {
    console.log('TESTING')
    toast({
      title: "You submitted the following dataset:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  const currentStep = match(current.value)
    .with("general", () => 0)
    .with("metadata", () => 1)
    .with("uploads", () => 2)
    .otherwise(() => 4);
  const disableNext = Object.keys(form.formState.errors).length > 0;
  console.log('ERRORS', form.formState.errors)

  return (
    <>
      <NextSeo title="Create dataset" />
      <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-y-4 px-4 py-8 lg:px-20">
          <Steps currentStep={currentStep} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {current.matches("general") && (
                <>
                  <GeneralForm />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      send("next");
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
                      onClick={() => {
                        send("next");
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
                    <Button className="w-full" type="submit">
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
        <div className="flex flex-col items-center bg-gray-50 py-8 px-4 lg:px-20 order-first lg:order-last">
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
                    <img
                      src={formatIcon(d.format.toLowerCase() ?? "")}
                      aria-hidden="true"
                      className="h-8 w-8 flex-shrink-0 text-gray-400"
                    />
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
