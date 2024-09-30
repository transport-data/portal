import { DatasetFormType } from "@schema/dataset.schema";
import { format } from "date-fns";
import { useFieldArray, useFormContext } from "react-hook-form";
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
import { UnitsField } from "./UnitsField";

function SourcesForm() {
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

export function MetadataForm() {
  const { control, setValue, getValues, watch } =
    useFormContext<DatasetFormType>();
  const geographies = api.group.tree.useQuery({
    type: "geography",
  });
  const datasetSchema = api.dataset.schema.useQuery();
  return (
    <div className="w-full">
      <div className="text-xl font-bold leading-normal text-primary">
        Add metadata
      </div>
      <SourcesForm />
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
        TDC Category
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
          <RelatedDatasetsField />
        </>
      )}
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Units
      </div>
      <UnitsField />
      <div className="flex items-center whitespace-nowrap text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Language
      </div>
      <FormField
        control={control}
        name="language"
        render={({ field }) => (
          <FormItem className="flex flex-col py-4">
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
                    {field.value
                      ? languages.find(
                          (language) => language.code === field.value
                        )?.name
                      : "Select language"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          value={language.code}
                          key={language.code}
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
                      variant={"outline"}
                      className={cn(
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
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
                      variant={"outline"}
                      className={cn(
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
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
        name="countries"
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
                            className={cn(
                              "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
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
                                  .slice(0, 50)
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
                            {geographies.map((r) => (
                              <CommandGroup
                                key={r.name}
                                heading={
                                  <DefaultTooltip content="Select all countries in this region">
                                    <span
                                      className="text-gray-600"
                                      onClick={() => {
                                        const countries = r.children.map(
                                          (c) => c.name
                                        );
                                        let newCountries =
                                          field.value.concat(countries);
                                        newCountries = newCountries.filter(
                                          (v, i, a) => a.indexOf(v) === i
                                        );
                                        setValue("countries", newCountries);
                                      }}
                                    >
                                      {r.title ?? r.name}
                                    </span>
                                  </DefaultTooltip>
                                }
                                className="cursor-pointer"
                              >
                                {r.children.map((c) => (
                                  <CommandItem
                                    value={c.name}
                                    key={c.name}
                                    onSelect={() => {
                                      match(field.value.includes(c.name))
                                        .with(true, () => {
                                          console.log("testing");
                                          setValue(
                                            "countries",
                                            getValues("countries").filter(
                                              (v) => v !== c.name
                                            )
                                          );
                                        })
                                        .with(false, () => {
                                          console.log("testing 2");
                                          setValue(
                                            "countries",
                                            getValues("countries").concat(
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
                            role="combobox"
                            className={cn(
                              "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
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
                            {sectors.map((s) => (
                              <CommandItem
                                value={s.value}
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
                            className={cn(
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
                            className={cn(
                              "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
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
                            {modes.map((m) => (
                              <CommandItem
                                value={m.value}
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
        <FormField
          control={control}
          name="indicator"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="indicator..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input placeholder="Dimensioning..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
