import { DatasetFormType } from "@schema/dataset.schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

export function SourcesForm() {
  const { control, register } = useFormContext<DatasetFormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "sources", // unique name for your Field Array
    }
  );
  return (
    <div className="py-4">
      <div className="flex items-center pb-4 text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Sources
      </div>
      {fields.map((field, index) => (
        <>
          <div
            className="grid grid-cols-1 gap-4 pb-2 lg:grid-cols-2"
            key={field.id}
          >
            <FormField
              control={control}
              name={`sources.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Source title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`sources.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Link (Optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      ))}
      <Button
        onClick={() =>
          append({
            title: "",
            url: "",
          })
        }
        type="button"
        variant="secondary"
      >
        Add a source
      </Button>
    </div>
  );
}


