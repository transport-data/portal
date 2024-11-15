import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Table as TableType } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { QueryFormType } from "./search.schema";
import { usePossibleValues } from "./queryHooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { match, P } from "ts-pattern";
import { Skeleton } from "@components/ui/skeleton";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ToggleColumns } from "./Table";

interface ColumnSelectProps<T extends FieldValues, V extends Object> {
  options: string[];
  label: string;
  table: TableType<any>;
}

export function ColumnSelect<T extends FieldValues, V extends Object>({
  options,
  label,
  table,
}: ColumnSelectProps<T, V>) {
  const form = useFormContext<QueryFormType>();
  const possibleRows = usePossibleValues({
    resourceId: form.watch("tableName"),
    column: form.watch("column"),
    enabled: !!form.watch("column"),
  });
  return (
    <FormField
      control={form.control}
      name="column"
      render={({ field }) => (
        <FormItem className="space-y-0">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="rounded-b-none rounded-t-lg">
                <SelectValue placeholder="Select a column to be pivoted" />
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
          <FormMessage />
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
                          <ToggleColumns
                            table={table}
                            row={form.watch("row")}
                          />
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
