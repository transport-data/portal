// @ts-nocheck
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DatasetFormType, DatasetSchema } from "@schema/dataset.schema";
import { DatasetForm } from "./DatasetForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import notify from "@utils/notify";

export const CreateDatasetForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [datasetCreated, setDatasetCreated] = useState("");
  const formObj = useForm<DatasetFormType>({
    resolver: zodResolver(DatasetSchema),
  });

  const utils = api.useContext();
  const createDataset = api.dataset.create.useMutation({
    onSuccess: async () => {
      notify(`Successfully created the ${datasetCreated} dataset`);
      formObj.reset();
      setErrorMessage(null);
      await utils.dataset.search.invalidate();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setDatasetCreated(data.name);
          createDataset.mutate(data);
        })}
      >
        <DatasetForm formObj={formObj} />
        <div className="col-span-full">
          <Button type="submit" color="stone" className="mt-8 w-full py-4">
            Create dataset
          </Button>
        </div>
        {errorMessage && (
          <div className="py-4">
            <ErrorAlert text={errorMessage} />
          </div>
        )}
      </form>
    </>
  );
};
