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

const licenses = [
  {
    label: "CC BY",
    value: "cc_by",
  },
  {
    label: "CC BY-SA",
    value: "cc_by_sa",
  },
  {
    label: "CC BY-NC",
    value: "cc_by_nc",
  },
  {
    label: "CC BY-NC-SA",
    value: "cc_by_nc_sa",
  },
  {
    label: "CC BY-NC-ND",
    value: "cc_by_nc_nd",
  },
  {
    label: "CC BY-ND",
    value: "cc_by_nd",
  },
  {
    label: "CC0",
    value: "cc0",
  },
  {
    label: "Public Domain",
    value: "public_domain",
  },
  {
    label: "Proprietary",
    value: "proprietary",
  },
  {
    label: "Other",
    value: "other",
  },
];

export function UploadsForm() {
  const form = useFormContext<DatasetFormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "resources", // unique name for your Field Array
    }
  );
  const docs = fields.filter(f => f.type === "doc")
  const files = fields.filter(f => f.type === "file")
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
                const url = response.successful[0]?.uploadURL ?? null;
                append({
                  name: response.successful[0]?.name ?? "",
                  url: url as string,
                  type: "file",
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
                        <div className="ml-4 flex flex-col min-w-0 flex-1">
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
            Documentation and metadata files
          </div>
          <div className="flex w-full items-center justify-center">
            <FileUploader
              id="docs-upload"
              onUploadSuccess={(response: UploadResult) => {
                console.log('Upload success', response.successful[0])
                const url = response.successful[0]?.uploadURL ?? null;
                append({
                  name: response.successful[0]?.name ?? "",
                  url: url as string,
                  type: "doc",
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
                        <div className="ml-4 flex flex-col min-w-0 flex-1">
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select copyright license" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {licenses.map((license, index) => (
                      <SelectItem key={index} value={license.value}>
                        {license.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
