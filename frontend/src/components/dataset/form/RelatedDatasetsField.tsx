import { DatasetFormType } from "@schema/dataset.schema";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { P, match } from "ts-pattern";
import { api } from "@utils/api";
import { useState } from "react";
import React from "react";

export function RelatedDatasetsField({ disabled }: { disabled?: boolean }) {
  const { control, register, setValue, getValues, watch } =
    useFormContext<DatasetFormType>();
  const [searchedDataset, setSearchedDataset] = useState("");
  const datasets = api.dataset.search.useQuery({
    query: searchedDataset,
  });
  return (
    <FormField
      control={control}
      name="related_datasets"
      render={({ field }) => (
        <FormItem className="flex flex-col py-4">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                    (!field.value || field.value.length === 0) &&
                      "text-gray-400"
                  )}
                >
                  {field.value && field.value.length > 0
                    ? field.value
                        .map((d) => d.title ?? d.name)
                        .join(", ")
                        .slice(0, 50)
                    : "Select datasets"}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput
                  disabled={disabled}
                  value={searchedDataset}
                  onValueChange={setSearchedDataset}
                  placeholder="Search sectors..."
                />
                <CommandList>
                  {match(datasets)
                    .with(
                      {
                        isLoading: true,
                      },
                      () => <CommandEmpty>Loading datasets</CommandEmpty>
                    )
                    .with(
                      {
                        isError: true,
                      },
                      () => (
                        <CommandEmpty>
                          Error loading datasets, refresh page
                        </CommandEmpty>
                      )
                    )
                    .with(
                      {
                        data: P.select(),
                      },
                      (data) => (
                        <>
                          {data.datasets
                            .filter((d) => d.id !== watch("id"))
                            .map((d) => (
                              <CommandItem
                                disabled={disabled}
                                value={d.name}
                                key={d.name}
                                onSelect={() => {
                                  match(
                                    field.value.some((v) => v.name === d.name)
                                  )
                                    .with(true, () =>
                                      setValue(
                                        "related_datasets",
                                        getValues("related_datasets").filter(
                                          (v) => v.name !== d.name
                                        )
                                      )
                                    )
                                    .with(false, () =>
                                      setValue(
                                        "related_datasets",
                                        getValues("related_datasets").concat({
                                          name: d.name,
                                          title: d.title ?? d.name,
                                        })
                                      )
                                    );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.some((v) => v.name === d.name)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {d.title ?? d.name}
                              </CommandItem>
                            ))}
                        </>
                      )
                    )
                    .otherwise(() => (
                      <></>
                    ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
