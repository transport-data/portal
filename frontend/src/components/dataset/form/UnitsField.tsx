import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { DatasetFormType } from "@schema/dataset.schema";
import { Check } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { match } from "ts-pattern";

export function UnitsField({ disabled }: any) {
  const { control, register, setValue, getValues } =
    useFormContext<DatasetFormType>();
  const [typedUnit, setTypedUnit] = useState("");
  return (
    <FormField
      control={control}
      name="units"
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
                    disabled && "cursor-not-allowed",
                    "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                    (!field.value || field.value.length === 0) &&
                      "text-gray-400"
                  )}
                >
                  {field.value && field.value.length > 0
                    ? field.value.join(", ").slice(0, 50)
                    : "Define units"}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput
                  value={typedUnit}
                  onValueChange={setTypedUnit}
                  placeholder="Define units..."
                />
                <CommandList>
                  {field.value.map((f) => (
                    <CommandItem
                      value={f}
                      key={f}
                      onSelect={() => {
                        match(field.value.includes(f))
                          .with(true, () =>
                            setValue(
                              "units",
                              getValues("units").filter((v) => v !== f)
                            )
                          )
                          .with(false, () =>
                            setValue("units", getValues("units").concat(f))
                          );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value.includes(f) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {f}
                    </CommandItem>
                  ))}
                  {typedUnit?.trim()?.length > 0 &&
                    !field.value.includes(typedUnit) && (
                      <CommandGroup>
                        <CommandItem
                          value={typedUnit}
                          className={cn(
                            field.value.includes(typedUnit)
                              ? "bg-accent text-accent-foreground"
                              : ""
                          )}
                          onSelect={() => {
                            match(field.value.includes(typedUnit))
                              .with(true, () =>
                                setValue(
                                  "units",
                                  getValues("units").filter(
                                    (v) => v !== typedUnit
                                  )
                                )
                              )
                              .with(false, () =>
                                setValue(
                                  "units",
                                  getValues("units").concat(typedUnit)
                                )
                              );
                          }}
                        >
                          Add {typedUnit}
                        </CommandItem>
                      </CommandGroup>
                    )}
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
