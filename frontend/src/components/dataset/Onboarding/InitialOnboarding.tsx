import { FileUploader } from "@components/_shared/FileUploader";
import { env } from "@env.mjs";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputStyle } from "@styles/formStyles";
import { ErrorMessage } from "@hookform/error-message";
import { Button } from "@components/ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

export default function InitialOnboarding({
  setFileUrls,
}: {
  setFileUrls: (urls: string[]) => void;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-y-1 py-8">
      <FileUploader
        onUploadSuccess={(result) => {
          const urls = result.successful.map((file) => {
            const url = file.uploadURL
              ? new URL(file.uploadURL).pathname
              : null;
            return url
              ? `${env.NEXT_PUBLIC_R2_PUBLIC_URL}${url}`
              : "No url found";
          });
          setFileUrls(urls);
        }}
      />
      <UrlForm onSubmit={(data) => setFileUrls(data)} />
    </div>
  );
}

const UrlForm: React.FC<{
  onSubmit: (urls: string[]) => void;
}> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ urls: { name: string }[] }>({
    defaultValues: { urls: [{ name: "" }] },
    resolver: zodResolver(
      z.object({ urls: z.array(z.object({ name: z.string().url() })) })
    ),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "urls",
  });
  return (
    <div className="py-4">
      <div className="flex w-full items-center justify-between pb-2">
        <label
          htmlFor="URL"
          className="block w-fit text-sm font-medium"
        >
          URLs
        </label>
        <Button
          onClick={() => append({ name: "" })}
          variant="success"
          className="px-2 text-xs"
        >
          <PlusIcon className="mr-1 inline-block h-4 w-4" />
          Add URL
        </Button>
      </div>
      <form
        className="flex flex-col space-y-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit((data) =>
          onSubmit(data.urls.map((u) => u.name))
        )}
      >
        {fields.map((field, index) => (
          <div key={field.id} className="flex w-full flex-col">
            <div className="flex space-x-2">
              <input
                type="text"
                className={inputStyle}
                {...register(`urls.${index}.name`)}
              />
              <Button
                className="px-2 text-xs"
                variant="danger"
                onClick={() => remove(index)}
              >
                <TrashIcon className="mt-0.5 inline-block h-4 w-4" />
              </Button>
            </div>
            <ErrorMessage
              errors={errors}
              name={`urls.${index}.name`}
              render={({ message }) => (
                <p className="text-justify text-xs text-red-600">{message}</p>
              )}
            />
          </div>
        ))}
        <div className="col-span-full">
          <Button type="submit" color="stone" className="w-full py-2">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
