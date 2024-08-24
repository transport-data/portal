import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../utils/api";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { ErrorAlert } from "@components/_shared/Alerts";
import NotificationSuccess from "@components/_shared/Notifications";
import { match } from "ts-pattern";
import { ResourceForm } from "./ResourceForm";
import { useRouter } from "next/router";
import { type ResourceFormType, ResourceSchema } from "@schema/dataset.schema";
import type { Resource } from "@portaljs/ckan";
import notify from "@utils/notify";
import { FileUploader } from "@components/_shared/FileUploader";
import { UploadResult } from "@uppy/core";
import { env } from "@env.mjs";
import Spinner from "@components/_shared/Spinner";

export const EditResourceForm: React.FC<{ initialValues: Resource }> = ({
  initialValues,
}) => {
  const { datasetName } = useRouter().query;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setIsUploading] = useState(false);
  const [resourceEdited, setResourceEdited] = useState("");

  const formObj = useForm<ResourceFormType>({
    resolver: zodResolver(ResourceSchema),
    defaultValues: initialValues,
  });

  const utils = api.useContext();
  const editResource = api.resource.update.useMutation({
    onSuccess: async () => {
      notify(`Successfully created the ${resourceEdited} resource`);
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
    if (url) formObj.setValue("url", `${env.NEXT_PUBLIC_R2_PUBLIC_URL}${url}`);
    setIsUploading(false);
  };

  return (
    <>
      <div className="col-span-full">
        <FileUploader
          onUploadSuccess={onUploadSuccess}
          onUploadStart={() => setIsUploading(!uploading)}
          height={200}
        />
      </div>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setResourceEdited(data.name);
          editResource.mutate(data);
        })}
      >
        {datasetName && typeof datasetName === "string" && (
          <ResourceForm formObj={formObj} datasetName={datasetName} />
        )}
        {!uploading && formObj.watch("url") && (
          <div className="col-span-full">
            {match(editResource.isLoading)
              .with(false, () => (
                <Button
                  type="submit"
                  variant="secondary"
                  className="mt-8 w-full py-4"
                >
                  Edit resource
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
                  Edit resource
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
