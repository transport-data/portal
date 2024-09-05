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
  FlagIcon,
  GlobeAltIcon,
} from "@heroicons/react/20/solid";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import listOfCountries from "@lib/listOfCountries";
import { Check } from "lucide-react";
import { match } from "ts-pattern";
import listOfRegions from "@lib/listOfRegions";
import { useRef } from "react";

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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pb-2" key={field.id}>
            <FormField
              control={control}
              name={`sources.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Source name" {...field} />
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
            name: "",
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
  const { control, setValue, getValues } = useFormContext<DatasetFormType>();
  return (
    <div className="w-full">
      <div className="text-xl font-bold leading-normal text-primary">
        Add metadata
      </div>
      <SourcesForm />
      <div className="flex items-center text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Language
      </div>
      <FormField
        control={control}
        name="language"
        render={({ field }) => (
          <FormItem className="py-4">
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select language..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
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
          name="referencePeriodStart"
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
          name="referencePeriodEnd"
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
                      ? listOfCountries
                          .filter((c) => field.value.includes(c.code))
                          ?.map((v) => v.name)
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
                    <CommandGroup>
                      {listOfCountries.map((c) => (
                        <CommandItem
                          value={c.name}
                          key={c.code}
                          onSelect={() => {
                            match(field.value.includes(c.code))
                              .with(true, () =>
                                setValue(
                                  "countries",
                                  getValues("countries").filter(
                                    (v) => v !== c.code
                                  )
                                )
                              )
                              .with(false, () =>
                                setValue(
                                  "countries",
                                  getValues("countries").concat(c.code)
                                )
                              );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(c.code)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {c.name}
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
      <FormField
        control={control}
        name="regions"
        render={({ field }) => (
          <FormItem className="flex flex-col pb-4">
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
                    <GlobeAltIcon className="h-4 w-4" />
                    {field.value && field.value.length > 0
                      ? listOfRegions
                          .filter((c) => field.value.includes(c.value))
                          ?.map((v) => v.name)
                          .join(", ")
                      : "Select regions..."}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput placeholder="Search regions..." />
                  <CommandList>
                    <CommandEmpty>No region found.</CommandEmpty>
                    <CommandGroup>
                      {listOfRegions.map((r) => (
                        <CommandItem
                          value={r.name}
                          key={r.value}
                          onSelect={() => {
                            match(field.value.includes(r.value))
                              .with(true, () =>
                                setValue(
                                  "regions",
                                  getValues("regions").filter(
                                    (v) => v !== r.value
                                  )
                                )
                              )
                              .with(false, () =>
                                setValue(
                                  "regions",
                                  getValues("regions").concat(r.value)
                                )
                              );
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(r.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {r.name}
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
  );
}
