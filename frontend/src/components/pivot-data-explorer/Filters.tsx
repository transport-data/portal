import { useFieldArray, useFormContext } from "react-hook-form";
import { QueryFormType } from "./search.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePossibleValues } from "./queryHooks";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { XCircleIcon } from "lucide-react";
import { cn } from "@lib/utils";

interface Column {
  key: string;
  name: string;
  type: string;
}

function Filter({
  column,
  resourceId,
  index,
  remove,
}: {
  column: string;
  resourceId: string;
  index: number;
  remove: () => void;
}) {
  const [q, setQ] = useState("");

  const form = useFormContext<QueryFormType>();
  const { data: possibleValues } = usePossibleValues({
    resourceId,
    column,
    enabled: true,
  });
  const currentValues = form.watch(`filters.${index}.values`);
  if (!possibleValues) return null;
  return (
    <DropdownMenu>
      <div className="flex flex-col">
      <Button
        asChild
        variant="outline"
        className="hover:bg-transparent hover:text-primary justify-start h-12 rounded-b-none rounded-t-lg"
      >
        <DropdownMenuTrigger>
          {column}
        </DropdownMenuTrigger>
      </Button>
      <Button
        asChild
        variant="outline"
        className="hover:bg-transparent hover:text-primary text-sm font-normal text-gray-500 justify-start h-12 rounded-t-none rounded-b-lg border-t-0 border-l border-r border-input bg-background"
      >
        <DropdownMenuTrigger>
            {possibleValues.length} Possible values
        </DropdownMenuTrigger>
      </Button>
      </div>
      <DropdownMenuContent
        className="w-auto"
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <ScrollArea className="max-h-64">
          <div className="overflow-hidden overflow-y-auto rounded-md bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-4 pb-2">
              <div className="relative w-full rounded-md">
                <input
                  className="shadow-wri-small block w-full min-w-0 rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-b-2 focus:border-accent focus:bg-slate-100 focus:ring-0 focus:ring-offset-0 disabled:bg-gray-100 sm:text-sm"
                  onChange={(e) => setQ(e.target.value)}
                  value={q}
                />
                <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <button onClick={() => setQ("")} className="h-4 w-4">
                          <XCircleIcon className="h-4 w-4 text-gray-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear input</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            {q === "" && (
              <div className="relative flex items-start px-4">
                <div className="flex h-6 items-center">
                  <input
                    {...{
                      type: "checkbox",
                      checked: possibleValues.length === currentValues.length,
                      onChange: () =>
                        possibleValues.length === currentValues.length
                          ? form.setValue(`filters.${index}.values`, [])
                          : form.setValue(
                              `filters.${index}.values`,
                              possibleValues.map((v) => v.key)
                            ),
                    }}
                    name="toggle-all"
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="toggle-all"
                    className="font-medium text-gray-900"
                  >
                    {possibleValues.length !== currentValues.length ? 'Toggle' : 'Untoggle'} All
                  </label>
                </div>
              </div>
            )}
            {possibleValues.map((value) => {
              const hidden = q !== "" && !value.key.toLowerCase().includes(q.toLowerCase());
              return (
                <div key={value.key} className={cn("relative flex items-start px-4", hidden && 'hidden')}>
                  <div className="flex h-6 items-center">
                    <input
                      id={`${column}-${value.key}`}
                      defaultChecked={
                        form.watch(`filters.${index}.values`).length === 0
                      }
                      {...form.register(`filters.${index}.values`)}
                      type="checkbox"
                      value={value.key}
                      className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor={`${column}-${value.key}`}
                      className="truncate font-medium text-gray-900"
                    >
                      {value.name}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Filters({
  columns,
  resourceId,
}: {
  columns: Column[];
  resourceId: string;
}) {
  const form = useFormContext<QueryFormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "filters", // unique name for your Field Array
    }
  );
  const addFilter = (column: Column) => {
    append({ column: column.key, values: [], type: column.type });
  };
  return (
    <>
      <DropdownMenu>
        <Button asChild variant="outline" className="h-12">
          <DropdownMenuTrigger>Add filter</DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          {columns.map((column) => (
            <DropdownMenuItem onClick={() => addFilter(column)}>
              {column.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {fields.map((field, index) => (
        <Filter
          column={field.column}
          resourceId={resourceId}
          index={index}
          remove={() => remove(index)}
        />
      ))}
    </>
  );
}
