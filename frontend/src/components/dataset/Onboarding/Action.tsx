import type { DataPackage } from "@interfaces/datapackage.interface";
import { MetadataPreview } from "./MetadataPreview";
import { Button } from "@components/ui/button";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "@utils/api";
import { match } from "ts-pattern";
import { ErrorAlert } from "@components/_shared/Alerts";
import Spinner from "@components/_shared/Spinner";

const Action = ({
  datapackage,
  onEdit,
}: {
  datapackage: DataPackage;
  onEdit: () => void;
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createDatasetFromDatapackage =
    api.datapackage.createDatasetFromDatapackage.useMutation({
      onSuccess: () => {
        void router.push("/dashboard/datasets");
      },
      onError: (error) => setErrorMessage(error.message),
    });
  return (
    <div className="my-10 text-center">
      <h2 className="text-lg font-semibold text-secondary">Metadata</h2>
      <p className="mb-5 mt-1 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        It&apos;s ready to go!
      </p>
      <MetadataPreview datapackage={datapackage} />

      <div className="flex items-center justify-center space-x-2 pt-4">
        <Button variant="secondary" onClick={onEdit}>
          Edit metadata
        </Button>
        {match(createDatasetFromDatapackage.isLoading)
          .with(false, () => (
            <Button
              onClick={() => createDatasetFromDatapackage.mutate(datapackage)}
            >
              Create dataset
            </Button>
          ))
          .otherwise(() => (
            <Button>
              <Spinner />
              Create dataset
            </Button>
          ))}
      </div>
      {errorMessage && (
        <div className="mx-auto w-fit py-4">
          <ErrorAlert text={errorMessage} />
        </div>
      )}
    </div>
  );
};

export default Action;
