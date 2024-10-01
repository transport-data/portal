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
import { cn, slugify } from "@lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { P, match } from "ts-pattern";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "@utils/api";
import { useEffect, useState } from "react";
import Spinner from "@components/_shared/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { Checkbox } from "@components/ui/checkbox";

export function GeneralForm({ editing = false }: { editing?: boolean} ) {
  const formObj = useFormContext<DatasetFormType>();
  const {
    getValues,
    setValue,
    control,
    register,
    watch,
    formState: { dirtyFields },
  } = formObj;

  const [searchedTag, setSearchedTag] = useState("");
  const tags = api.tags.list.useQuery();
  const datasetSchema = api.dataset.schema.useQuery();
  const tagAlreadyExists = (tag: string) =>
    tags.data && tags.data.includes(tag);

  const userOrganization = api.organization.listForUser.useQuery();
  const topics = api.group.list.useQuery({
    showGeographyShapes: false,
    type: "topic",
  });

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
                <Input disabled={editing} className="disabled:bg-gray-200" placeholder="Dataset slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Organization
        </div>
        <FormField
          control={control}
          name="owner_org"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {match(userOrganization)
                  .with({ isLoading: true }, () => (
                    <span className="flex items-center gap-x-2 text-sm">
                      <Spinner />{" "}
                      <span className="mt-1">Loading organizations...</span>
                    </span>
                  ))
                  .with({ isError: true, errors: P.select() }, (errors) => (
                    <span className="flex items-center text-sm text-red-600">
                      Error({JSON.stringify(errors)}) loading organizatoins,
                      please refresh the page
                    </span>
                  ))
                  .with({ isSuccess: true, data: P.select() }, (data) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization for dataset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data
                          .map((group, index) => (
                            <SelectItem key={index} value={group.id}>
                              {group.title ?? group.display_name ?? group.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ))
                  .otherwise(() => (
                    <span className="flex items-center text-sm text-red-600">
                      Error loading organizations, please refresh the page
                    </span>
                  ))}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Topics
      </div>
      <FormField
        control={control}
        name="topics"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {match(topics)
              .with({ isLoading: true }, () => (
                <Button
                  variant="outline"
                  role="combobox"
                  disabled
                  className="w-full justify-start gap-x-2 bg-gray-200 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary"
                >
                  <Spinner /> Loading topics...
                </Button>
              ))
              .with(
                {
                  isError: true,
                },
                () => (
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled
                    className="w-full justify-start gap-x-2 border-red-200 bg-gray-200 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary"
                  >
                    <Spinner /> Error loading topics
                  </Button>
                )
              )
              .with(
                {
                  data: P.select(),
                },
                (data) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                            (!field.value || field.value.length === 0) &&
                              "text-gray-400"
                          )}
                        >
                          {field.value && field.value.length > 0
                            ? data
                                .filter((c) => field.value.includes(c.name))
                                ?.map((v) => v.title ?? v.name)
                                .join(", ")
                                .slice(0, 50)
                            : "Select topics"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0"
                      style={{ width: "var(--radix-popover-trigger-width)" }}
                    >
                      <Command>
                        <CommandInput placeholder="Search topics..." />
                        <CommandList>
                          <CommandEmpty>No topic found</CommandEmpty>
                          {data.map((t) => (
                            <CommandItem
                              value={t.name}
                              key={t.name}
                              onSelect={() => {
                                match(field.value.includes(t.name))
                                  .with(true, () =>
                                    setValue(
                                      "topics",
                                      getValues("topics").filter(
                                        (v) => v !== t.name
                                      )
                                    )
                                  )
                                  .with(false, () =>
                                    setValue(
                                      "topics",
                                      getValues("topics").concat(t.name)
                                    )
                                  );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes(t.name)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {t.title ?? t.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              )
              .otherwise(() => (
                <></>
              ))}
            <FormMessage />
          </FormItem>
        )}
      />

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
      <div className="overview-field flex flex-col gap-y-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Overview
        </div>
        <RTEForm
          name="overview"
          placeholder="Write a overview description of this dataset"
          formObj={formObj}
        />
      </div>
      <FormField
        control={control}
        name="is_archived"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Is this dataset archived?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="private"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Is this dataset private?</FormLabel>
            </div>
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Keywords (max. 3)
        </div>
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-row flex-wrap items-end gap-2 py-4">
              <Popover>
                {field.value.map((tag, index) => (
                  <Button
                    key={index}
                    size="pill"
                    variant="outline"
                    role="combobox"
                    type="button"
                    className="w-fit gap-x-2 border-accent text-xs text-accent"
                    onClick={() =>
                      setValue(
                        "tags",
                        getValues("tags").filter((v) => v.name !== tag.name)
                      )
                    }
                  >
                    {tag.name}
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
                      className="w-fit gap-x-2 border-accent text-xs text-accent"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add a keyword
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  {field.value.length < 3 && (
                    <Command>
                      <CommandInput
                        value={searchedTag}
                        onValueChange={setSearchedTag}
                        placeholder="Search keywords..."
                      />
                      <CommandList>
                        {match(tags)
                          .with(
                            {
                              isLoading: true,
                            },
                            () => <CommandEmpty>No keyword found.</CommandEmpty>
                          )
                          .with(
                            {
                              isError: true,
                            },
                            () => (
                              <CommandEmpty>
                                Failed to load keywords.
                              </CommandEmpty>
                            )
                          )
                          .with(
                            {
                              data: P.select("data"),
                            },
                            ({ data }) => (
                              <CommandGroup>
                                {data.map((t) => (
                                  <CommandItem
                                    disabled={
                                      field.value.some(_t => _t.name === t) ||
                                      field.value.length >= 3
                                    }
                                    className="disabled:opacity-50"
                                    value={t}
                                    key={t}
                                    onSelect={() => {
                                      match(field.value.some(v => v.name === t))
                                        .with(true, () =>
                                          setValue(
                                            "tags",
                                            getValues("tags").filter(
                                              (v) => v.name !== t
                                            )
                                          )
                                        )
                                        .with(false, () =>
                                          setValue(
                                            "tags",
                                            getValues("tags").concat({ name: t})
                                          )
                                        );
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value.some(v => v.name === t)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {t}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )
                          )
                          .otherwise(() => (
                            <></>
                          ))}
                        {searchedTag.length > 2 &&
                          !tagAlreadyExists(searchedTag) && (
                            <CommandGroup>
                              <CommandItem
                                value={searchedTag}
                                className={cn(
                                  field.value.some(v => v.name === searchedTag)
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                )}
                                onSelect={() => {
                                  match(field.value.some(v => v.name === searchedTag))
                                    .with(true, () =>
                                      setValue(
                                        "tags",
                                        getValues("tags").filter(
                                          (v) => v.name !== searchedTag
                                        )
                                      )
                                    )
                                    .with(false, () =>
                                      setValue(
                                        "tags",
                                        getValues("tags").concat({ name: searchedTag})
                                      )
                                    );
                                }}
                              >
                                Add {searchedTag}
                              </CommandItem>
                            </CommandGroup>
                          )}
                      </CommandList>
                    </Command>
                  )}
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
