import {
  flexRender,
  Table as TableType,
  Column as ColumnType,
  Header,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUp,
  ChevronsUpDownIcon,
  ListFilter,
  MapPinIcon as MapPinIconSolid,
  Pin,
  PinOff,
  TableIcon,
} from "lucide-react";
import { Fragment, Ref, useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  XCircleIcon,
  MapPinIcon as MapPinIconOutline,
  Filter,
} from "lucide-react";
import { Tooltip } from "./Tooltip";
import { match } from "ts-pattern";
import { Popover, Transition } from "@headlessui/react";
import { DebouncedInput } from "./DebouncedInput";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterFormType, FilterObjType, filterSchema } from "./search.schema";
import SimpleSelect from "./SimpleSelect";
import { DataExplorerColumnFilter } from "./DataExplorer";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { Reference, usePopper } from "react-popper";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

type TableProps = {
  table: TableType<any>;
  numOfRows: number;
  isLoading: boolean;
  columnFilters: DataExplorerColumnFilter[];
};

export function TopBar({
  table,
  numOfRows,
}: {
  table: TableType<any>;
  numOfRows: number;
}) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const numOfColumns = table.getAllColumns().length;
  return (
    <>
      <span className="font-regular flex items-center text-base leading-5 text-[#3E3E3E]">
        <TableIcon className="mr-2 h-5 w-5 text-accent" />
        {numOfColumns} columns, {numOfRows} rows
      </span>
      <div>
        <div className="flex items-center gap-x-3">
          <ToggleColumns table={table} />
          <span className="flex text-sm">
            {pageIndex * pageSize + 1} - {(pageIndex + 1) * pageSize} of{" "}
            {numOfRows}
          </span>
          <button
            className={`h-4 w-4 ${
              !table.getCanPreviousPage() ? "opacity-25" : "opacity-100"
            }`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </button>
          <button
            className={`h-4 w-4 ${
              !table.getCanNextPage() ? "opacity-25" : "opacity-100"
            }`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </>
  );
}

export function ToggleColumns({ table }: { table: TableType<any> }) {
  let [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  let [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  let { styles, attributes } = usePopper(referenceElement, popperElement);
  const [q, setQ] = useState("");

  const filteredItems =
    q === ""
      ? table.getAllLeafColumns()
      : table.getAllLeafColumns().filter((column) => {
          return (
            column.id.toLowerCase().includes(q.toLowerCase()) ||
            (typeof column.columnDef.header === "string" &&
              column.columnDef.header.toLowerCase().includes(q.toLowerCase()))
          );
        });
  return (
    <Popover as="div" className="relative inline-block text-left">
      <Popover.Button
        ref={setReferenceElement as Ref<HTMLButtonElement>}
        as="div"
      >
        <Button className="flex h-8 items-center justify-center rounded-md bg-accent text-xs text-accent-foreground hover:bg-accent/90 hover:text-white ">
          Show Columns
        </Button>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          ref={setPopperElement as any}
          style={styles.popper}
          {...attributes.popper}
          className="absolute right-0 z-10 mt-2 max-h-[200px] w-64 origin-top-left overflow-hidden overflow-y-auto rounded-md bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="px-4 pb-2">
            <div className="relative w-full rounded-md">
              <input
                className="shadow-wri-small block w-full min-w-0 rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-b-2 focus:border-accent focus:bg-slate-100 focus:ring-0 focus:ring-offset-0 disabled:bg-gray-100 sm:text-sm"
                onChange={(e) => setQ(e.target.value)}
                value={q}
              />
              <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3">
                <Tooltip content="Clear input" side="left">
                  <button onClick={() => setQ("")} className="h-4 w-4">
                    <XCircleIcon className="h-4 w-4 text-gray-400" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          {q === "" && (
            <div className="relative flex items-start px-4">
              <div className="flex h-6 items-center">
                <input
                  {...{
                    type: "checkbox",
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
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
                  Toggle All
                </label>
              </div>
            </div>
          )}
          {filteredItems.map((column) => (
            <div key={column.id} className="relative flex items-start px-4">
              <div className="flex h-6 items-center">
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                  name={column.id}
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label
                  htmlFor={column.id}
                  className="truncate font-medium text-gray-900"
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </label>
              </div>
            </div>
          ))}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export function Table({ table, isLoading }: TableProps) {
  const numOfColumns = table.getAllColumns().length;
  return (
    <div className="flex max-w-full grow">
      <table className="block shadow w-max">
        <thead className="bg-gray-100 text-left">
          {table.getLeftHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="min-w-[200px] py-8 pl-12 text-sm text-gray-500 font-semibold"
                >
                  <Column h={h} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="border-b border-b-slate-200">
              {r.getLeftVisibleCells().map((c) => (
                <td key={c.id} className="py-2 pl-12">
                  <div className="flex min-h-[65px] items-center text-base">
                    {" "}
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollArea>
        <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="block w-max divide-y divide-gray-300">
            <thead className="bg-gray-100 text-left">
              {table.getCenterHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="min-w-[200px] py-8 pl-12 text-sm text-gray-500 font-semibold"
                    >
                      <Column h={h} />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading && (
              <tbody>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
                  <tr key={r} className="border-b border-b-slate-200">
                    {Array.from(Array(numOfColumns).keys()).map((c) => (
                      <td key={c} className="py-2 pl-12">
                        <div className="flex min-h-[65px] items-center text-base">
                          <span className="h-4 w-24 animate-pulse rounded-md bg-accent/20" />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
            <tbody>
              {table.getRowModel().rows.map((r) => (
                <tr key={r.id} className="border-b border-b-slate-200">
                  {r.getCenterVisibleCells().map((c) => {
                    if (c.getValue() === "" || c.getValue() === " ") {
                      return (
                        <td key={c.id} className="py-2 pl-12">
                          <div className="flex min-h-[65px] items-center text-base">
                            {c.column.columnDef.meta?.default ?? ""}
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={c.id} className="py-2 pl-12">
                        <div className="flex min-h-[65px] items-center text-base">
                          {flexRender(c.column.columnDef.cell, c.getContext())}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function Column({ h }: { h: Header<any, unknown> }) {
  return (
    <div className="relative flex items-center gap-x-2 pr-4">
      {flexRender(h.column.columnDef.header, h.getContext())}
      {match(h.column.getIsSorted())
        .with(false, () => (
          <Tooltip content="Sort by this column">
            <button onClick={() => h.column.toggleSorting(false, true)}>
              <ChevronsUpDownIcon className="h-4 w-4 opacity-75" />
            </button>
          </Tooltip>
        ))
        .with("asc", () => (
          <Tooltip content="Sorting asc">
            <button onClick={() => h.column.toggleSorting(true, true)}>
              <ChevronUp className="h-4 w-4" />
            </button>
          </Tooltip>
        ))
        .with("desc", () => (
          <Tooltip content="Sorting desc">
            <button onClick={() => h.column.clearSorting()}>
              <ChevronDown className="h-4 w-4" />
            </button>
          </Tooltip>
        ))
        .otherwise(() => (
          <></>
        ))}
      <FilterColumn column={h.column} />
      {!h.isPlaceholder && h.column.getCanPin() && (
        <div className="flex justify-center gap-1">
          {h.column.getIsPinned() !== "left" ? (
            <Tooltip content="Pin to left">
              <button
                onClick={() => {
                  h.column.pin("left");
                }}
              >
                <Pin className="h-4 w-4" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Unpin">
              <button
                onClick={() => {
                  h.column.pin(false);
                }}
              >
                <PinOff className="h-4 w-4" />
              </button>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}

function FilterColumn({ column }: { column: ColumnType<any, unknown> }) {
  return (
    <Popover as={Fragment}>
      {({ open }) => (
        <>
          <Popover.Button>
            <Tooltip content="Filter">
              <ListFilter className="h-4 w-4" />
            </Tooltip>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute left-0 top-0 z-10 mt-6 w-56 origin-bottom rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <FilterForm column={column} />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

function FilterForm({ column }: { column: ColumnType<any, unknown> }) {
  const defaultValues = column.getFilterValue();
  const formObj = useForm<FilterFormType>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      filters: (defaultValues as FilterObjType[]) ?? [
        {
          operation:
            column.columnDef.meta?.type === "timestamp"
              ? { label: "Greater than", value: ">" }
              : { label: "Equals", value: "=" },
          value: "",
          link: null,
        },
      ],
    },
  });
  const { watch } = formObj;
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      column.setFilterValue(value.filters);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <FormProvider {...formObj}>
      <div className="flex flex-col gap-y-2 px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <Filters datePicker={column.columnDef.meta?.type === "timestamp"} />
        </div>
      </div>
    </FormProvider>
  );
}

export default function Filters({
  datePicker = false,
}: {
  datePicker?: boolean;
}) {
  const formObj = useFormContext<FilterFormType>();
  const { register, control, setValue, watch, getValues } = formObj;
  const { append, fields, remove } = useFieldArray({
    control,
    name: "filters",
  });
  const addFilter = (link: "and" | "or") => {
    setValue(`filters.${lastItem}.link`, link);
    append({
      operation: { label: "Equals", value: "=" },
      value: "",
      link: null,
    });
  };
  const removeFilter = (index: number) => {
    remove(index);
    const lastItem = watch(`filters`).length - 1;
    if (lastItem >= 0) {
      setValue(`filters.${lastItem}.link`, null);
    }
  };
  const lastItem = fields.length - 1;

  return (
    <>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex w-full flex-col items-center gap-y-2"
        >
          <SimpleSelect
            formObj={formObj}
            name={`filters.${index}.operation`}
            options={[
              {
                label: "Equals",
                value: "=",
              },
              {
                label: "Not equal",
                value: "!=",
              },
              {
                label: "Greater than",
                value: ">",
              },
              {
                label: "Greater or equal than",
                value: ">=",
              },
              {
                label: "Smaller than",
                value: "<",
              },
              {
                label: "Smaller or equal than",
                value: "<=",
              },
            ].filter((o) => {
              if (!datePicker) return true;
              return datePicker && o.value !== "=" && o.value !== "!=";
            })}
            placeholder="Select a filter"
          />
          <Controller
            control={control}
            name={`filters.${index}.value`}
            render={({ field: { onChange, onBlur, value, ref } }) =>
              datePicker ? (
                <DatePicker date={value} setDate={onChange} />
              ) : (
                <DebouncedInput
                  onChange={onChange} // send value to hook form
                  onBlur={onBlur} // notify when input is touched/blur
                  value={value}
                  //icon={
                  //  fields.length > 1 && (
                  //    <Tooltip content="Remove filter">
                  //      <button
                  //        onClick={() => removeFilter(index)}
                  //        className="w-4 h-4"
                  //      >
                  //        <XCircleIcon className="text-red-600" />
                  //      </button>
                  //    </Tooltip>
                  //  )
                  //}
                />
              )
            }
          />
          {field.link && (
            <span className="text-xs uppercase text-gray-500">
              {field.link}
            </span>
          )}
        </div>
      ))}
      <div className="grid w-full grid-cols-2 gap-x-2">
        <Button
          type="button"
          onClick={() => addFilter("and")}
          className="flex h-8 w-full items-center justify-center rounded-md bg-accent text-xs text-accent-foreground hover:bg-accent/90 hover:text-white "
        >
          AND
        </Button>
        <Button
          type="button"
          onClick={() => addFilter("or")}
          className="flex h-8 w-full items-center justify-center rounded-md bg-accent text-xs text-accent-foreground hover:bg-accent/90 hover:text-white "
        >
          OR
        </Button>
      </div>
    </>
  );
}

export function ListOfFilters({
  filters,
  setFilters,
}: {
  filters: DataExplorerColumnFilter[];
  setFilters: (filters: DataExplorerColumnFilter[]) => void;
}) {
  function removeFilter(index: number) {
    if (index >= 0 && index < filters.length) {
      const newFilters = filters
        .slice(0, index)
        .concat(filters.slice(index + 1));
      setFilters(newFilters);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((f, i) => (
          <div
            key={f.id}
            className="flex h-8 w-fit items-center gap-x-2 rounded-sm bg-neutral-100 px-3 py-1 shadow transition hover:bg-neutral-200"
          >
            <div className="font-['Acumin Pro SemiCondensed'] text-xs font-semibold leading-none text-black">
              {f.id}
            </div>
            <Tooltip content="Remove filter">
              <button onClick={() => removeFilter(i)}>
                <XCircleIcon className="h-4 w-4 cursor-pointer text-red-600" />
              </button>
            </Tooltip>
          </div>
        ))}
      </div>
      {filters.length ? (
        <button
          onClick={() => setFilters([])}
          className="font-['Acumin Pro SemiCondensed'] text-sm font-normal text-black underline"
        >
          Clear all filters
        </button>
      ) : null}
    </>
  );
}
