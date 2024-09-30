import { Button } from "@components/ui/button";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DatasetFormType } from "@schema/dataset.schema";
import { FileUploader } from "./FileUploader";
import { formatBytes, formatIcon, getFileName } from "@lib/utils";
import { TrashIcon } from "@heroicons/react/20/solid";
import { UploadResult } from "@uppy/core";
import { api } from "@utils/api";
import { P, match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import { env } from "@env.mjs";

export function UploadsForm() {
  const form = useFormContext<DatasetFormType>();
  const licenses = api.dataset.listLicenses.useQuery();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "resources", // unique name for your Field Array
    }
  );
  const docs = fields.filter((f) => f.type === "documentation");
  const files = fields.filter((f) => f.type === "data");
  return (
    <div className="py-4">
      <div className="pb-4 text-xl font-bold leading-normal text-primary">
        Upload dataset files & documentation
      </div>

      <div className="flex flex-col gap-y-4">
        <div>
          <div className="flex items-center whitespace-nowrap pb-3 text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
            Dataset Files
          </div>
          <div className="flex w-full items-center justify-center">
            <FileUploader
              id="files-upload"
              onUploadSuccess={(response: UploadResult) => {
                let url = response.successful[0]?.uploadURL as string;
                //get last and second to last items in url, last is going to be the name and second to last is going to be the resourceId
                const urlParts = url.split("/");
                const resourceId = urlParts[urlParts.length - 2];
                url = `${env.NEXT_PUBLIC_CKAN_URL}/dataset/${form.getValues(
                  "id"
                )}/resource/${resourceId}/${
                  response.successful[0]?.name ?? ""
                }`;
                append({
                  id: resourceId,
                  name: response.successful[0]?.name ?? "",
                  url: url as string,
                  url_type: "upload",
                  resource_type: "data",
                  type: "data",
                  size: response.successful[0]?.size ?? 0,
                  format: response.successful[0]?.extension ?? "",
                });
              }}
            >
              {files.length > 0 && (
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {files.map((r, index) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <img
                          src={formatIcon(r.format?.toLowerCase() ?? "")}
                          aria-hidden="true"
                          className="h-8 w-8 flex-shrink-0 text-gray-400"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            {r.name ?? getFileName(r.url ?? "")}
                          </span>
                          {r.size && (
                            <span className="flex-shrink-0 text-gray-400">
                              {formatBytes(r.size)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <label htmlFor="nothing">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(index);
                            }}
                            type="button"
                            className="font-medium text-gray-500 hover:text-accent"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </FileUploader>
          </div>
        </div>
        <div>
          <div className="flex items-center whitespace-nowrap pb-3 text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
            Documentation and metadata files
          </div>
          <div className="flex w-full items-center justify-center">
            <FileUploader
              id="docs-upload"
              onUploadSuccess={(response: UploadResult) => {
                let url = response.successful[0]?.uploadURL as string;
                //get last and second to last items in url, last is going to be the name and second to last is going to be the resourceId
                const urlParts = url.split("/");
                const resourceId = urlParts[urlParts.length - 2];
                url = `${env.NEXT_PUBLIC_CKAN_URL}/dataset/${form.getValues(
                  "id"
                )}/resource/${resourceId}/${
                  response.successful[0]?.name ?? ""
                }`;
                append({
                  id: resourceId,
                  name: response.successful[0]?.name ?? "",
                  url: url as string,
                  url_type: "upload",
                  resource_type: "documentation",
                  type: "documentation",
                  size: response.successful[0]?.size ?? 0,
                  format: response.successful[0]?.extension ?? "",
                });
              }}
            >
              {docs.length > 0 && (
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {docs.map((r, index) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 transition hover:bg-gray-100"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <img
                          src={formatIcon(r.format?.toLowerCase() ?? "")}
                          aria-hidden="true"
                          className="h-8 w-8 flex-shrink-0 text-gray-400"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            {r.name ?? getFileName(r.url ?? "")}
                          </span>
                          {r.size && (
                            <span className="flex-shrink-0 text-gray-400">
                              {formatBytes(r.size)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => remove(index)}
                          className="font-medium text-gray-500 hover:text-accent"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </FileUploader>
          </div>
        </div>
        <div>
          <div className="flex items-center whitespace-nowrap pb-3 text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
            License
          </div>
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {match(licenses)
                    .with({ isLoading: true }, () => (
                      <span className="flex items-center gap-x-2 text-sm">
                        <Spinner />{" "}
                        <span className="mt-1">Loading licenses...</span>
                      </span>
                    ))
                    .with({ isError: true, errors: P.select() }, (errors) => (
                      <span className="flex items-center text-sm text-red-600">
                        Error({JSON.stringify(errors)}) loading licenses, please
                        refresh the page
                      </span>
                    ))
                    .with({ isSuccess: true, data: P.select() }, (data) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license for dataset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.map((license) => (
                            <SelectItem key={license.id} value={license.id}>
                              {license.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))
                    .otherwise(() => (
                      <span className="flex items-center text-sm text-red-600">
                        Error loading licenses, please refresh the page
                      </span>
                    ))}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
