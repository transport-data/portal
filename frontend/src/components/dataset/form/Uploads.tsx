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
import { useFormContext } from "react-hook-form";
import { DatasetFormType } from "@schema/dataset.schema";

const licenses = [
  {
    label: "CC BY",
    value: 'cc_by'
  },
  {
    label: "CC BY-SA",
    value: 'cc_by_sa'
  },
  {
    label: "CC BY-NC",
    value: 'cc_by_nc'
  },
  {
    label: "CC BY-NC-SA",
    value: 'cc_by_nc_sa'
  },
  {
    label: "CC BY-NC-ND",
    value: 'cc_by_nc_nd'
  },
  {
    label: "CC BY-ND",
    value: 'cc_by_nd'
  },
  {
    label: "CC0",
    value: 'cc0'
  },
  {
    label: "Public Domain",
    value: 'public_domain'
  },
  {
    label: "Proprietary",
    value: 'proprietary'
  },
  {
    label: "Other",
    value: 'other'
  },
]

export function UploadsForm() {
  const form = useFormContext<DatasetFormType>();
  return (
    <div className="py-4">
      <div className="text-xl pb-4 font-bold leading-normal text-primary">
        Upload dataset files & documentation
      </div>

      <div className="flex flex-col gap-y-4">
      <div>
        <div className="pb-3 flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Dataset Files
        </div>
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Max. File Size: 30 MB
              </p>
              <div className="py-6">
                <Button size="sm" className="gap-x-2">
                  <SearchIcon className="h-4 w-4" /> Browse Files
                </Button>
              </div>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
      </div>
      <div>
        <div className="pb-3 flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Documentation and metadata files
        </div>
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Max. File Size: 30 MB
              </p>
              <div className="py-6">
                <Button size="sm" className="gap-x-2">
                  <SearchIcon className="h-4 w-4" /> Browse Files
                </Button>
              </div>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
      </div>
      <div>
        <div className="pb-3 flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          License
        </div>
      <FormField
        control={form.control}
        name="license"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select copyright license" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                  {
                    licenses.map((license, index) => (
                      <SelectItem key={index} value={license.value}>{license.label}</SelectItem>
                    ))
                  }
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
