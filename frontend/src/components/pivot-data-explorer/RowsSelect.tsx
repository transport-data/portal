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
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { usePossibleValues } from "./queryHooks";
import { QueryFormType } from "./search.schema";
import { match, P } from "ts-pattern";
import { Skeleton } from "@components/ui/skeleton";

interface ColumnSelectProps<T extends FieldValues, V extends Object> {
  options: string[];
  label: string;
}

export function RowsSelect<T extends FieldValues, V extends Object>({
  options,
  label,
}: ColumnSelectProps<QueryFormType, V>) {
  const form = useFormContext<QueryFormType>();
  const possibleRows = usePossibleValues({
    resourceId: form.watch("tableName"),
    column: form.watch("row"),
    enabled: !!form.watch("row"),
  });
  return (
    <FormField
      control={form.control}
      name="row"
      render={({ field }) => (
        <FormItem className="space-y-0">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="rounded-b-none rounded-t-lg">
                <SelectValue
                  className="font-bold"
                  placeholder="Select a row to be used"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Accordion
            type="single"
            collapsible
            className="-mt-2 rounded-b-lg border-b border-l border-r border-input bg-background"
          >
            <AccordionItem value="item-1">
              <AccordionPrimitive.Trigger className="flex h-12 w-full items-center justify-between px-3 py-0 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-400 [&>span]:line-clamp-1">
                {!!form.watch("row") && (
                  <div>
                    {match(possibleRows)
                      .with(
                        {
                          isLoading: true,
                        },
                        () => <Skeleton className="h-4 w-12" />
                      )
                      .with(
                        {
                          isError: true,
                        },
                        () => <p>Error loading number of rows</p>
                      )
                      .with(
                        {
                          data: P.select("rows"),
                        },
                        ({ rows }) => (
                          <div className="inline-flex items-center justify-start gap-2.5">
                            <div>
                              <span className="text-sm font-normal leading-normal text-gray-500">
                                {rows.length} values displayed
                              </span>
                            </div>
                          </div>
                        )
                      )
                      .otherwise(() => (
                        <></>
                      ))}
                  </div>
                )}
              </AccordionPrimitive.Trigger>
              <AccordionContent>
                {!!form.watch("row") && (
                  <div>
                    {match(possibleRows)
                      .with(
                        {
                          isLoading: true,
                        },
                        () => <Skeleton className="h-4 w-12" />
                      )
                      .with(
                        {
                          isError: true,
                        },
                        () => <p>Error loading rows</p>
                      )
                      .with(
                        {
                          data: P.select("rows"),
                        },
                        ({ rows }) => (
                          <div className="inline-flex items-center justify-start gap-2.5">
                            <ul className="px-3 flex flex-col gap-y-1">
                              {rows.map((r) => (
                                <li key={r.key} className="text-sm font-normal leading-normal text-gray-500">
                                  {r.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )
                      .otherwise(() => (
                        <></>
                      ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FormItem>
      )}
    />
  );
}
