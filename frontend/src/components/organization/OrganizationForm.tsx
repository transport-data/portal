import { ErrorMessage } from "@hookform/error-message";
import type { UseFormReturn } from "react-hook-form";
import { inputStyle } from "../../styles/formStyles";
import type { OrganizationFormType } from "@schema/organization.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { ImageUploader } from "@components/_shared/ImageUploader";
import { UploadResult } from "@uppy/core";
import { api } from "@utils/api";
import { P, match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const OrganizationForm: React.FC<{
  formObj: UseFormReturn<OrganizationFormType>;
}> = ({ formObj }) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = formObj;
  const possibleParents = api.organization.list.useQuery();
  return (
    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
      <div>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>{" "}
      <div>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="parent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parent</FormLabel>
            <FormControl>
              {match(possibleParents)
                .with({ isLoading: true }, () => (
                  <span className="flex items-center gap-x-2 text-sm">
                    <Spinner /> <span className="mt-1">Loading parents...</span>
                  </span>
                ))
                .with({ isError: true, errors: P.select() }, (errors) => (
                  <span className="flex items-center text-sm text-red-600">
                    Error({JSON.stringify(errors)}) loading parents, please
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
                        <SelectValue placeholder="Select parent for org" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-parent">No parent</SelectItem>
                      {data
                        .filter((org) => org.name !== watch("name"))
                        .map((org, index) => (
                          <SelectItem key={index} value={org.name}>
                            {org.title ?? org.display_name ?? org.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ))
                .otherwise(() => (
                  <span className="flex items-center text-sm text-red-600">
                    Error loading parents, please refresh the page
                  </span>
                ))}
            </FormControl>
            <FormDescription>
              Use this if you want to say that this organisation is a
              sub-organisation of another organisation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <FormField
          control={control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organisation Image</FormLabel>
              <FormControl>
                <ImageUploader
                  clearImage={() => setValue("image_url", "")}
                  defaultImage={
                    watch("image_url") && watch("image_display_url")
                  }
                  onUploadSuccess={(response: UploadResult) => {
                    const url = response.successful[0]?.uploadURL ?? null;
                    const name = url ? url.split("/").pop() : "";
                    setValue("image_url", name ?? "");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@tdc.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>{" "}
    </div>
  );
};
