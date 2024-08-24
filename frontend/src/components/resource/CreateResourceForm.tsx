import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../utils/api";
import { Button } from "../ui/button";
import { useState } from "react";
import { ErrorAlert } from "@components/_shared/Alerts";
import NotificationSuccess from "@components/_shared/Notifications";
import { match } from "ts-pattern";
import { ResourceForm } from "./ResourceForm";
import { useRouter } from "next/router";
import { type ResourceFormType, ResourceSchema } from "@schema/dataset.schema";
import type { SuccessResponse, UploadResult, UppyFile } from "@uppy/core";
import { env } from "@env.mjs";
import { FileUploader } from "@components/_shared/FileUploader";
import notify from "@utils/notify";
import Spinner from "@components/_shared/Spinner";

export const CreateResourceForm: React.FC = () => {
  const { datasetName } = useRouter().query;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resourceCreated, setResourceCreated] = useState("");

  const formObj = useForm<ResourceFormType>({
    resolver: zodResolver(ResourceSchema),
  });

  const utils = api.useContext();
  const createResource = api.resource.create.useMutation({
    onSuccess: async () => {
      notify(`Successfully created the ${resourceCreated} resource`);
      await utils.dataset.get.invalidate({
        name: datasetName as string,
      });
      formObj.reset();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const onUploadSuccess = (response: UploadResult) => {
    const url = response.successful[0]?.uploadURL
      ? new URL(response.successful[0]?.uploadURL).pathname
      : null;
    formObj.setValue(
      "url",
      url ? `${env.NEXT_PUBLIC_R2_PUBLIC_URL}${url}` : "No url found"
    );
  };

  return (
    <>
      <div className="col-span-full">
        <FileUploader onUploadSuccess={onUploadSuccess} />
      </div>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setResourceCreated(data.name);
          createResource.mutate(data);
        })}
      >
        {datasetName && typeof datasetName === "string" && (
          <ResourceForm formObj={formObj} datasetName={datasetName} />
        )}
        {formObj.watch("url") && (
          <div className="col-span-full">
            {match(createResource.isLoading)
              .with(false, () => (
                <Button
                  type="submit"
                  color="stone"
                  className="mt-8 w-full py-4"
                >
                  Create resource
                </Button>
              ))
              .otherwise(() => (
                <Button
                  type="submit"
                  color="stone"
                  disabled
                  className="mt-8 flex w-full py-4"
                >
                  <Spinner className="text-slate-900" />
                  Create resource
                </Button>
              ))}
          </div>
        )}
        {errorMessage && (
          <div className="py-4">
            <ErrorAlert text={errorMessage} />
          </div>
        )}
      </form>
    </>
  );
};
