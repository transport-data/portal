import { DatasetFormType } from "@schema/dataset.schema";
import { format } from "date-fns";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";
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
import { Button } from "@components/ui/button";
import { RTEForm } from "@components/ui/formRte";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { match } from "ts-pattern";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const exampleTags = [
  "Public Transport",
  "Mobility",
  "Transportation",
  "Data",
  "Infrastructure",
  "Open Data",
  "Transport",
  "Urban Mobility",
  "Traffic",
  "Transportation Planning",
  "Cars",
  "Electric Vehicles",
  "Sustainable Transport",
  "Transportation Infrastructure",
];

export function GeneralForm() {
  const formObj = useFormContext<DatasetFormType>();
  const { getValues, setValue, control, register, watch } = formObj;
  return (
    <div className="flex flex-col gap-y-4 py-4">
      <div className="text-xl font-bold leading-normal text-primary">
        General
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Title
        </div>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Slug
        </div>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Dataset slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Description
        </div>
        <RTEForm
          name="notes"
          placeholder="Write a short description of this dataset"
          formObj={formObj}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Are you or the organization you represent the owner of this dataset?
        </div>
        <FormField
          control={control}
          name="userRepresents"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="" role="group">
                <button
                  onClick={() => field.onChange(true)}
                  type="button"
                  className={cn(
                    "rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-accent focus:z-10 focus:ring-2 focus:ring-accent",
                    field.value === true && "bg-accent text-white"
                  )}
                >
                  Yes
                </button>
                <button
                  onClick={() => field.onChange(false)}
                  type="button"
                  className={cn(
                    "rounded-r-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-accent focus:z-10 focus:ring-2 focus:ring-accent",
                    field.value === false && "bg-accent text-white"
                  )}
                >
                  No
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Keywords (max. 3)
        </div>
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-wrap items-end gap-2 flex-row py-4">
              <Popover>
                {field.value.map((tag, index) => (
                  <Button
                    key={index}
                    size="pill"
                    variant="outline"
                    role="combobox"
                    type="button"
                    className="w-fit border-accent text-xs text-accent gap-x-2"
                    onClick={() =>
                      setValue(
                        "tags",
                        getValues("tags").filter((v) => v !== tag)
                      )
                    }
                  >
                    {tag}
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                ))}
                <PopoverTrigger asChild>
                  <FormControl>
                      <Button
                        size="pill"
                        variant="outline"
                      disabled={field.value.length >= 3}
                        role="combobox"
                        type="button"
                        className="w-fit border-accent text-xs text-accent gap-x-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add a keyword
                      </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search keywords..." />
                    <CommandList>
                      <CommandEmpty>No keyword found.</CommandEmpty>
                      <CommandGroup>
                        {exampleTags.map((t) => (
                          <CommandItem
                            value={t}
                            key={t}
                            onSelect={() => {
                              match(field.value.includes(t))
                                .with(true, () =>
                                  setValue(
                                    "tags",
                                    getValues("tags").filter((v) => v !== t)
                                  )
                                )
                                .with(false, () =>
                                  setValue("tags", getValues("tags").concat(t))
                                );
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(t)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {t}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
