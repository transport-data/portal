import { DatasetFormType } from "@schema/dataset.schema";
import { format } from "date-fns";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@lib/utils";
import {
  CalendarIcon,
  ChevronUpDownIcon,
  FlagIcon,
} from "@heroicons/react/20/solid";
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
import { languages } from "@utils/languages";
import Spinner from "@components/_shared/Spinner";
import { DefaultTooltip } from "@components/ui/tooltip";
import { getChoicesFromField } from "@utils/dataset";
import { RelatedDatasetsField } from "./RelatedDatasetsField";
import { IndicatorsField } from "./IndicatorField";
import { UnitsField } from "./UnitsField";
import { SourcesForm } from "./SourcesForm";
import { CommentsForm } from "./CommentsForm";
import { RTEForm } from "@components/ui/formRte";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { GroupTree } from "@schema/group.schema";

export function MetadataForm({ disabled }: any) {
  const formObj = useFormContext<DatasetFormType>();
  const { control, setValue, getValues, watch } = formObj;
  const geographies = api.group.tree.useQuery({
    type: "geography",
  });

  const formGeographies = formObj.watch("geographies") ?? [];

  const getTooltipSelectionPrefix = (region: GroupTree, field: any) => {
    if (region.name === "worldwide") {
      return formGeographies.length > 0 ? "Remove" : "Select";
    }

    return region.children
      .map((c) => c.name)
      .every((c) => field.value.includes(c))
      ? "Remove"
      : "Select";
  };

  const datasetSchema = api.dataset.schema.useQuery();
  console.log(formObj.watch("geographies"));
  return (
    <div className="w-full py-6">
      <div className="text-xl font-bold leading-normal text-primary">
        Add metadata
      </div>
      <SourcesForm disabled={disabled} />
      <CommentsForm disabled={disabled} />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Update Frequency
      </div>
      <FormField
        control={control}
        name="frequency"
        render={({ field }) => (
          <FormItem className="py-4">
            <FormControl>
              {match(datasetSchema)
                .with({ isLoading: true }, () => (
                  <span className="flex items-center gap-x-2 text-sm">
                    <Spinner />{" "}
                    <span className="mt-1">Loading frequency options...</span>
                  </span>
                ))
                .with({ isError: true, errors: P.select() }, (errors) => (
                  <span className="flex items-center text-sm text-red-600">
                    Error({JSON.stringify(errors)}) loading frequency options,
                    please refresh the page
                  </span>
                ))
                .with({ isSuccess: true, data: P.select() }, (data) => (
                  <Select
                    disabled={disabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select update frequency..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getChoicesFromField(data, "frequency").map((o) => (
                        <SelectItem value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))
                .otherwise(() => (
                  <span className="flex items-center text-sm text-red-600">
                    Error loading frequency options, please refresh the page
                  </span>
                ))}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        TDC Category{" "}
        <a target="_blank" href="/data-provider#how-tdc-datasets-work">
          <InformationCircleIcon className="ml-2 h-4 w-4 text-gray-400" />
        </a>
      </div>
      <FormField
        control={control}
        name="tdc_category"
        render={({ field }) => (
          <FormItem className="py-4">
            <FormControl>
              {match(datasetSchema)
                .with({ isLoading: true }, () => (
                  <span className="flex items-center gap-x-2 text-sm">
                    <Spinner />{" "}
                    <span className="mt-1">Loading TDC Options...</span>
                  </span>
                ))
                .with({ isError: true, errors: P.select() }, (errors) => (
                  <span className="flex items-center text-sm text-red-600">
                    Error({JSON.stringify(errors)}) loading TDC Options, please
                    refresh the page
                  </span>
                ))
                .with({ isSuccess: true, data: P.select() }, (data) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select TDC Category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getChoicesFromField(data, "tdc_category").map((o) => (
                        <SelectItem value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))
                .otherwise(() => (
                  <span className="flex items-center text-sm text-red-600">
                    Error loading TDC Category, please refresh the page
                  </span>
                ))}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {watch("tdc_category") === "tdc_harmonized" && (
        <>
          <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
            Related Datasets
          </div>
          <RelatedDatasetsField disabled={disabled} />
        </>
      )}
      {watch("tdc_category") === "tdc_harmonized" && (
        <>
          <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
            Introduction and key takeaways
          </div>
          <RTEForm
            disabled={disabled}
            name="introduction_text"
            placeholder="Write a overview description of this dataset"
            formObj={formObj}
          />
        </>
      )}
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Units
      </div>
      <UnitsField disabled={disabled} />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Language
      </div>
      <FormField
        control={control}
        name="language"
        render={({ field }) => (
          <FormItem className="flex flex-col py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      disabled && "cursor-not-allowed",
                      "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                      (!field.value || field.value.length === 0) &&
                        "text-gray-400"
                    )}
                  >
                    {field.value
                      ? languages.find(
                          (language) => language.code === field.value
                        )?.name
                      : "Select language"}
                  </Button>
                </FormControl>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="p-0"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput
                    disabled={disabled}
                    placeholder="Search language..."
                  />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <DropdownMenuItem>
                          <CommandItem
                            disabled={disabled}
                            value={language.code}
                            key={language.code}
                            keywords={[language.name]}
                            onSelect={() => {
                              setValue("language", language.code);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.code === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {language.name}
                          </CommandItem>
                        </DropdownMenuItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuContent>
            </DropdownMenu>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Reference Period
      </div>
      <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
        <FormField
          control={control}
          name="temporal_coverage_start"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={disabled}
                      variant={"outline"}
                      className={cn(
                        disabled && "cursor-not-allowed",
                        "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>From...</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromYear={1000}
                    captionLayout="dropdown"
                    toYear={4000}
                    className={cn(disabled && "cursor-not-allowed")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="temporal_coverage_end"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={disabled}
                      variant={"outline"}
                      className={cn(
                        disabled && "cursor-not-allowed",
                        "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>To...</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromYear={1970}
                    captionLayout="dropdown"
                    toYear={2030}
                    className={cn(disabled && "cursor-not-allowed")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Geographies
      </div>
      <FormField
        control={control}
        name="geographies"
        render={({ field }) => (
          <FormItem className="flex flex-col py-4">
            {match(geographies)
              .with({ isLoading: true }, () => (
                <Button
                  variant="outline"
                  role="combobox"
                  disabled
                  className="w-full justify-start gap-x-2 bg-gray-200 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary"
                >
                  <Spinner /> Loading geographies...
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
                    <Spinner /> Error loading geographies
                  </Button>
                )
              )
              .with(
                {
                  data: P.select("geographies"),
                },
                ({ geographies }) => {
                  const countries = geographies.flatMap((c) => c.children);
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={disabled}
                            className={cn(
                              disabled && "cursor-not-allowed",
                              "w-full justify-start gap-x-2 overflow-hidden pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                              (!field.value || field.value.length === 0) &&
                                "text-gray-400"
                            )}
                          >
                            <FlagIcon className="h-4 w-4" />
                            {field.value && field.value.length > 0
                              ? countries
                                  .filter((c) => field.value.includes(c.name))
                                  ?.map((v) => v.title ?? v.name)
                                  .join(", ")
                              : "Select country"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput placeholder="Search countries..." />
                          <CommandList>
                            <CommandEmpty>No country found</CommandEmpty>
                            {geographies.map((region) => (
                              <CommandGroup
                                key={region.name}
                                heading={
                                  <DefaultTooltip
                                    content={`${getTooltipSelectionPrefix(
                                      region,
                                      field
                                    )} all countries in this region`}
                                  >
                                    <span
                                      className="text-gray-600"
                                      onClick={() => {
                                        if (region.name === "worldwide") {
                                          setValue(
                                            "geographies",
                                            formGeographies.length > 0
                                              ? []
                                              : countries.map((x) => x.name)
                                          );
                                          return;
                                        }
                                        const _countries = region.children.map(
                                          (c) => c.name
                                        );
                                        if (
                                          _countries.every((c) =>
                                            field.value.includes(c)
                                          )
                                        ) {
                                          setValue(
                                            "geographies",
                                            field.value.filter(
                                              (v) => !_countries.includes(v)
                                            )
                                          );
                                        } else {
                                          let newCountries =
                                            field.value.concat(_countries);
                                          newCountries = newCountries.filter(
                                            (v, i, a) => a.indexOf(v) === i
                                          );
                                          setValue("geographies", newCountries);
                                        }
                                      }}
                                    >
                                      {region.title ?? region.name}
                                    </span>
                                  </DefaultTooltip>
                                }
                                className="cursor-pointer"
                              >
                                {region.children.map((c) => (
                                  <CommandItem
                                    value={c.name}
                                    key={c.name}
                                    keywords={[c.title ?? c.name]}
                                    onSelect={() => {
                                      match(field.value.includes(c.name))
                                        .with(true, () => {
                                          setValue(
                                            "geographies",
                                            getValues("geographies").filter(
                                              (v) => v !== c.name
                                            )
                                          );
                                        })
                                        .with(false, () => {
                                          setValue(
                                            "geographies",
                                            getValues("geographies").concat(
                                              c.name
                                            )
                                          );
                                        });
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value.includes(c.name)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {c.title ?? c.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                }
              )
              .otherwise(() => (
                <></>
              ))}
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Sectors
      </div>
      <FormField
        control={control}
        name="sectors"
        render={({ field }) => (
          <FormItem className="flex flex-col py-4">
            {match(datasetSchema)
              .with({ isLoading: true }, () => (
                <Button
                  variant="outline"
                  role="combobox"
                  disabled
                  className="w-full justify-start gap-x-2 bg-gray-200 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary"
                >
                  <Spinner /> Loading sectors...
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
                    <Spinner /> Error loading sectors
                  </Button>
                )
              )
              .with(
                {
                  data: P.select(),
                },
                (data) => {
                  const sectors = getChoicesFromField(data, "sectors");
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={disabled}
                            role="combobox"
                            className={cn(
                              disabled && "cursor-not-allowed",
                              "w-full justify-start gap-x-2 overflow-hidden pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                              (!field.value || field.value.length === 0) &&
                                "text-gray-400"
                            )}
                          >
                            {field.value && field.value.length > 0
                              ? sectors
                                  .filter((c) => field.value.includes(c.value))
                                  ?.map((v) => v.label)
                                  .join(", ")
                                  .slice(0, 50)
                              : "Select sectors"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput placeholder="Search sectors..." />
                          <CommandList>
                            <CommandEmpty>No sector found</CommandEmpty>
                            <CommandItem
                              value="all"
                              keywords={["All"]}
                              onSelect={() => {
                                match(field.value.includes("all"))
                                  .with(true, () => setValue("sectors", []))
                                  .with(false, () =>
                                    setValue(
                                      "sectors",
                                      sectors.map((s) => s.value)
                                    )
                                  );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes("all")
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              All
                            </CommandItem>
                            {sectors
                              .filter((s) => s.value !== "all")
                              .map((s) => (
                                <CommandItem
                                  value={s.value}
                                  keywords={[s.label]}
                                  key={s.value}
                                  onSelect={() => {
                                    match(field.value.includes(s.value))
                                      .with(true, () =>
                                        setValue(
                                          "sectors",
                                          getValues("sectors").filter(
                                            (v) => v !== s.value
                                          )
                                        )
                                      )
                                      .with(false, () =>
                                        setValue(
                                          "sectors",
                                          getValues("sectors").concat(s.value)
                                        )
                                      );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.includes(s.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {s.label}
                                </CommandItem>
                              ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                }
              )
              .otherwise(() => (
                <></>
              ))}
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Services
      </div>
      <FormField
        control={control}
        name="services"
        render={({ field }) => (
          <FormItem className="flex flex-col py-4">
            {match(datasetSchema)
              .with({ isLoading: true }, () => (
                <Button
                  variant="outline"
                  role="combobox"
                  disabled
                  className="w-full justify-start gap-x-2 bg-gray-200 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary"
                >
                  <Spinner /> Loading services...
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
                    <Spinner /> Error loading services
                  </Button>
                )
              )
              .with(
                {
                  data: P.select(),
                },
                (data) => {
                  const services = getChoicesFromField(data, "services");
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={disabled}
                            className={cn(
                              disabled && "cursor-not-allowed",
                              "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                              (!field.value || field.value.length === 0) &&
                                "text-gray-400"
                            )}
                          >
                            {field.value && field.value.length > 0
                              ? services
                                  .filter((c) => field.value.includes(c.value))
                                  ?.map((v) => v.label)
                                  .join(", ")
                                  .slice(0, 50)
                              : "Select services"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput placeholder="Search services..." />
                          <CommandList>
                            <CommandEmpty>No service found</CommandEmpty>
                            {services.map((s) => (
                              <CommandItem
                                value={s.value}
                                keywords={[s.label]}
                                key={s.value}
                                onSelect={() => {
                                  match(field.value.includes(s.value))
                                    .with(true, () =>
                                      setValue(
                                        "services",
                                        getValues("services").filter(
                                          (v) => v !== s.value
                                        )
                                      )
                                    )
                                    .with(false, () =>
                                      setValue(
                                        "services",
                                        getValues("services").concat(s.value)
                                      )
                                    );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(s.value)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {s.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                }
              )
              .otherwise(() => (
                <></>
              ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Modes
      </div>
      <FormField
        control={control}
        name="modes"
        render={({ field }) => (
          <FormItem className="flex flex-col py-4">
            {match(datasetSchema)
              .with({ isLoading: true }, () => (
                <Button
                  variant="outline"
                  role="combobox"
                  disabled
                  className="w-full justify-start gap-x-2 bg-gray-200 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary"
                >
                  <Spinner /> Loading modes...
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
                    <Spinner /> Error loading modes
                  </Button>
                )
              )
              .with(
                {
                  data: P.select(),
                },
                (data) => {
                  const modes = getChoicesFromField(data, "modes");
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={disabled}
                            className={cn(
                              disabled && "cursor-not-allowed",
                              "w-full justify-start gap-x-2 overflow-hidden pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                              (!field.value || field.value.length === 0) &&
                                "text-gray-400"
                            )}
                          >
                            {field.value && field.value.length > 0
                              ? modes
                                  .filter((c) => field.value.includes(c.value))
                                  ?.map((v) => v.label)
                                  .join(", ")
                                  .slice(0, 50)
                              : "Select modes"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        style={{ width: "var(--radix-popover-trigger-width)" }}
                      >
                        <Command>
                          <CommandInput placeholder="Search modes..." />
                          <CommandList>
                            <CommandEmpty>No mode found</CommandEmpty>
                            <CommandItem
                              value="all"
                              keywords={["All"]}
                              onSelect={() => {
                                match(field.value.includes("all"))
                                  .with(true, () => setValue("modes", []))
                                  .with(false, () =>
                                    setValue(
                                      "modes",
                                      modes.map((s) => s.value)
                                    )
                                  );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes("all")
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              All
                            </CommandItem>
                            {modes
                              .filter((s) => s.value !== "all")
                              .map((m) => (
                                <CommandItem
                                  value={m.value}
                                  keywords={[m.label]}
                                  key={m.value}
                                  onSelect={() => {
                                    match(field.value.includes(m.value))
                                      .with(true, () =>
                                        setValue(
                                          "modes",
                                          getValues("modes").filter(
                                            (v) => v !== m.value
                                          )
                                        )
                                      )
                                      .with(false, () =>
                                        setValue(
                                          "modes",
                                          getValues("modes").concat(m.value)
                                        )
                                      );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.includes(m.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {m.label}
                                </CommandItem>
                              ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                }
              )
              .otherwise(() => (
                <></>
              ))}
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col gap-y-2 py-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Indicator
        </div>
        <IndicatorsField disabled={disabled} />
      </div>
      <div className="flex flex-col gap-y-2 py-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Dimensioning
        </div>
        <FormField
          control={control}
          name="dimensioning"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={disabled}
                  className={cn(disabled && "cursor-not-allowed")}
                  placeholder="Dimensioning..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2 py-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Data Provider
        </div>
        <FormField
          control={control}
          name="data_provider"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={disabled}
                  className={cn(disabled && "cursor-not-allowed")}
                  placeholder="Data Provider..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Organisation or individual that provides the data and any
                related metadata
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2 py-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          Data Access
        </div>
        <FormField
          control={control}
          name="data_access"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={disabled}
                  className={cn(disabled && "cursor-not-allowed")}
                  placeholder="Data Access..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Any conditions on data access, e.g. publicly available,
                proprietary, fee or subscription required, available on request,
                etc.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col gap-y-2 py-2">
        <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
          URL
        </div>
        <FormField
          control={control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={disabled}
                  className={cn(disabled && "cursor-not-allowed")}
                  placeholder="URL..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Location on the internet with further information about the
                dataset
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
