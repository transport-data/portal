/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";
import type { DataPackage } from "@interfaces/datapackage.interface";
import MetadataEditor from "./MetadataEditor";
import { Button } from "@components/ui/button";
import { api } from "@utils/api";
import { useRouter } from "next/router";
import { ErrorAlert } from "@components/_shared/Alerts";
import { useState } from "react";
import Spinner from "@components/_shared/Spinner";

const Editor: React.FC<{
  datapackage: DataPackage;
  goBack: (datapackage: DataPackage) => void;
  disableName: boolean;
}> = ({ datapackage, goBack, disableName }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createDatasetFromDatapackage =
    api.datapackage.createDatasetFromDatapackage.useMutation({
      onSuccess: () => {
        void router.push("/dashboard/datasets");
      },
      onError: (error) => setErrorMessage(error.message),
    });
  //Form(This is the entire source of truth that gets pushed to github)
  const formObject = useForm<DataPackage>({
    defaultValues: { ...datapackage },
  });

  return (
    <form
      onSubmit={formObject.handleSubmit((data) => {
        createDatasetFromDatapackage.mutate(data);
      })}
    >
      <div className="h-full rounded-md border border-slate-200 dark:border-slate-700">
        <div className="h-full p-6 py-1">
          <div>
            <MetadataEditor
              datapackage={datapackage}
              formObject={formObject}
              disableName={disableName}
            />
          </div>
        </div>
      </div>
      <div className="my-2 flex items-center space-x-2">
        <Button variant="secondary" onClick={() => goBack(formObject.watch())}>
          Go Back
        </Button>
        {match(createDatasetFromDatapackage.isLoading)
          .with(false, () => <Button type="submit">Create dataset</Button>)
          .otherwise(() => (
            <Button>
              <Spinner />
              Create dataset
            </Button>
          ))}
      </div>
      {errorMessage && (
        <div className="py-4">
          <ErrorAlert text={errorMessage} />
        </div>
      )}
    </form>
  );
};

export default Editor;
