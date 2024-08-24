import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DatasetFormType, DatasetSchema } from "@schema/dataset.schema";
import { DatasetForm } from "./DatasetForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import type { Dataset } from "@portaljs/ckan";
import notify from "@utils/notify";

export const EditDatasetForm: React.FC<{ initialValues: Dataset }> = ({
  initialValues,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [datasetEdited, setDatasetEdited] = useState("");
  const formObj = useForm<DatasetFormType>({
    resolver: zodResolver(DatasetSchema),
    defaultValues: {
      ...initialValues,
      groupsId: initialValues.groups
        ? initialValues.groups.map((g) => g.name)
        : [],
    },
  });

  const utils = api.useContext();
  const editDataset = api.dataset.patch.useMutation({
    onSuccess: async () => {
      notify(`Successfully edited the ${datasetEdited} dataset`);
      setErrorMessage(null);
      await utils.dataset.search.invalidate();
    },
    onError: (error) => { console.log(error); setErrorMessage(error.message); console.log(error) },
  });

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setDatasetEdited(data.name);
          editDataset.mutate(data);
        })}
      >
        <DatasetForm formObj={formObj} />
        <div className="col-span-full">
          <Button type="submit" variant="secondary" className="mt-8 w-full py-4">
            Edit dataset
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
