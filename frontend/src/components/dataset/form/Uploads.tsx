import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@components/_shared/Spinner";
import { env } from "@env.mjs";
import { TrashIcon } from "@heroicons/react/20/solid";
import { cn, formatBytes, formatIcon, getFileName } from "@lib/utils";
import { DatasetFormType } from "@schema/dataset.schema";
import { UploadResult } from "@uppy/core";
import { api } from "@utils/api";
import { useFieldArray, useFormContext } from "react-hook-form";
import { P, match } from "ts-pattern";
import { FileUploader } from "./FileUploader";
import { EyeOffIcon } from "lucide-react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { DefaultTooltip } from "@components/ui/tooltip";
import { useState } from "react";

function findIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i] as T)) {
      return i;
    }
  }
  return -1;
}

export function UploadsForm({ disabled }: any) {
  const form = useFormContext<DatasetFormType>();
  const licenses = api.dataset.listLicenses.useQuery();
  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "resources", // unique name for your Field Array
  });
  const docs = fields.filter((f) => f.resource_type === "documentation");
  const files = fields.filter((f) => f.resource_type === "data");
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
              disabled={disabled}
              id="files-upload"
              onUploadSuccess={(response: UploadResult) => {
                let url = response.successful[0]?.uploadURL as string;
                console.log("RESPONSE", response.successful[0]);
                const urlParts = url.split("/");
                const resourceId = urlParts[urlParts.length - 2];
                const fileName = urlParts[urlParts.length - 1];
                url = `${env.NEXT_PUBLIC_CKAN_URL}/dataset/${form.getValues(
                  "id",
                )}/resource/${resourceId}/${fileName ?? ""}`;
                append({
                  id: resourceId,
                  name: response.successful[0]?.name ?? "",
                  url: url as string,
                  url_type: "upload",
                  resource_type: "data",
                  size: response.successful[0]?.size ?? 0,
                  format: response.successful[0]?.extension ?? "",
                  hide_preview: false,
                  is_new: true,
                });
              }}
            >
              {files.length > 0 && (
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {files.map((r) => {
                    const _index = findIndex(fields, (f) => f.id === r.id);
                    const datapusherAcceptedFormats = [
                      "csv",
                      "xls",
                      "xlsx",
                      "xlsm",
                      "xlsb",
                      "tsv",
                      "tab",
                    ];
                    const fileFormat = (r.format ?? "").toLowerCase();
                    const isTabular =
                      datapusherAcceptedFormats.includes(fileFormat);

                    const isNewTabular = r.is_new && isTabular;
                    const notNewTabular = !r.is_new && !!r._datastore_active;
                    const displayHidePreview = isNewTabular || notNewTabular;

                    return (
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
                        <div className="ml-4 flex flex-shrink-0 flex-row gap-x-5">
                          <FormField
                            control={form.control}
                            name={`resources.${_index}.hide_preview`}
                            render={({ field }) => {
                              const tooltip = !field.value
                                ? "Click to disable the preview of this data file on the dataset page"
                                : "Click to enable the preview of this data file on the dataset page";

                              if (!displayHidePreview) {
                                return <></>;
                              }

                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(!field.value);
                                  }}
                                  type="button"
                                  className="font-medium text-gray-500 hover:text-accent"
                                >
                                  <DefaultTooltip content={tooltip}>
                                    <div>
                                      {!field.value && (
                                        <EyeIcon className="h-5 w-5" />
                                      )}
                                      {!!field.value && (
                                        <EyeOffIcon className="h-5 w-5" />
                                      )}
                                    </div>
                                  </DefaultTooltip>
                                </button>
                              );
                            }}
                          />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(_index);
                            }}
                            type="button"
                            className="font-medium text-gray-500 hover:text-accent"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
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
              disabled={disabled}
              id="docs-upload"
              onUploadSuccess={(response: UploadResult) => {
                let url = response.successful[0]?.uploadURL as string;
                //get last and second to last items in url, last is going to be the name and second to last is going to be the resourceId
                const urlParts = url.split("/");
                const resourceId = urlParts[urlParts.length - 2];
                const fileName = urlParts[urlParts.length - 1];
                url = `${env.NEXT_PUBLIC_CKAN_URL}/dataset/${form.getValues(
                  "id",
                )}/resource/${resourceId}/${fileName ?? ""}`;
                append({
                  id: resourceId,
                  name: response.successful[0]?.name ?? "",
                  url: url as string,
                  url_type: "upload",
                  resource_type: "documentation",
                  size: response.successful[0]?.size ?? 0,
                  format: response.successful[0]?.extension ?? "",
                  hide_preview: false,
                });
              }}
            >
              {docs.length > 0 && (
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  {docs.map((r) => (
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
                          type="button"
                          disabled={disabled}
                          className={cn(
                            disabled && "cursor-not-allowed",
                            "font-medium text-gray-500 hover:text-accent",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            const _index = findIndex(
                              fields,
                              (f) => f.id === r.id,
                            );
                            remove(_index);
                          }}
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
            name="license_id"
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
                        disabled={disabled}
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
