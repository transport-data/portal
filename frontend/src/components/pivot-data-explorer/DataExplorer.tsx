import { useMemo, useState } from "react";
import { Table, ToggleColumns } from "./Table";
import {
  ColumnFiltersState,
  ColumnSort,
  getCoreRowModel,
  PaginationState,
  Updater,
  useReactTable,
  VisibilityState,
  RowData,
} from "@tanstack/react-table";
import {
  useFields,
  useNumberOfRows,
  usePossibleValues,
  useTableData,
} from "./queryHooks";
import Spinner from "./Spinner";
import { FilterObjType, QueryFormType, querySchema } from "./search.schema";
import "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnSelect } from "./ColumnSelect";
import Filters from "./Filters";
import { match, P } from "ts-pattern";
import { Skeleton } from "@components/ui/skeleton";
import { RowsSelect } from "./RowsSelect";
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
  FilterIcon,
  SquareSplitHorizontal,
  SquareSplitVerticalIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { HashtagIcon } from "@heroicons/react/24/outline";
import { Button, LoaderButton } from "@components/ui/button";
import { cn } from "@lib/utils";
import { FunnelIcon } from "@heroicons/react/20/solid";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@components/ui/scroll-area";
import {
  exportData,
  useExportRawData,
  useExportTableData,
} from "./exportMutation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Filter {
  operation: "=" | "!=" | ">" | "<" | "contains";
  value: string;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    type: string;
    default?: string;
  }
}

export function DataExplorer({ resourceId }: { resourceId: string }) {
  const { data: tableData } = useFields(resourceId);
  if (!tableData)
    return (
      <div className="bg-lima-700 my-auto flex h-full w-full flex-col items-center justify-center overflow-hidden opacity-75">
        <Spinner className="h-12 w-12 text-accent" />
        <h2 className="text-center text-xl font-semibold text-accent">
          Loading...
        </h2>
      </div>
    );
  return (
    <DataExplorerInner
      key={resourceId}
      resourceId={resourceId}
      columns={tableData.columns}
    />
  );
}

export interface DataExplorerInnerProps {
  resourceId: string;
  columns: { key: string; name: string; type: string; default?: string }[];
}

export interface DataExplorerColumnFilter {
  id: string;
  value: FilterObjType[];
}

function DataExplorerInner({ resourceId, columns }: DataExplorerInnerProps) {
  const [columnFilters, setColumnFilters] = useState<
    DataExplorerColumnFilter[]
  >([]);
  const [sidebarHidden, hideSidebar] = useState(false);
  const [columnPinning, setColumnPinning] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const form = useForm<QueryFormType>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      filters: [],
      tableName: resourceId,
    },
  });
  const exportRawData = useExportRawData();
  const exportTableData = useExportTableData();
  const { data: possibleValuesColumns } = usePossibleValues({
    resourceId,
    column: form.watch("column"),
    enabled: !!form.watch("column") && !!form.watch("row"),
  });
  const { data: possibleValuesRows, isLoading: rowsLoading } =
    usePossibleValues({
      resourceId,
      column: form.watch("row"),
      enabled: !!form.watch("row"),
    });

  const dataEnabled =
    form.watch("row") &&
    form.watch("column") &&
    form.watch("value") &&
    possibleValuesColumns
      ? true
      : false;
  const {
    data: tableData,
    isLoading: dataLoading,
    isPlaceholderData,
    isFetching,
  } = useTableData({
    resourceId,
    column: form.watch("column"),
    row: form.watch("row"),
    value: form.watch("value"),
    pivotColumns: possibleValuesColumns?.map((v) => v.key) ?? [],
    filters:
      form.watch && form.watch("filters")
        ? form.watch("filters").filter((f) => f.values.length > 0)
        : [],
    enabled: dataEnabled,
    columnsType:
      columns.find((c) => c.key === form.watch("column"))?.type ?? "text",
  });
  const numberOfRows = useNumberOfRows({
    resourceId,
    enabled: true,
    filters:
      form.watch && form.watch("filters")
        ? form.watch("filters").filter((f) => f.values.length > 0)
        : [],
  });
  const data = useMemo(() => {
    if (!tableData && possibleValuesRows) {
      const rows = possibleValuesRows.map((r) => ({
        [form.watch("row")]: r.key,
      }));
      return rows;
    }
    if (!tableData) return [];
    return tableData;
  }, [tableData, possibleValuesRows]);
  const cols = useMemo(
    () => possibleValuesColumns ?? [],
    [possibleValuesColumns]
  );
  const tableCols = useMemo(() => {
    if (!cols) return [];
    const fetchedCols = cols.map((c) => ({
      accessorKey: c.key,
      header: c.name,
      meta: {
        type: c.type,
        default: c.default,
      },
      filterFn: () => {
        // not sure why this needs to be added
        return true;
      },
    }));
    return [
      {
        accessorKey: form.watch("row"),
        header: form.watch("row"),
        meta: { type: "string" },
      },
      ...fetchedCols,
    ];
  }, [cols, form.watch("row")]);

  const table = useReactTable({
    data,
    columns: tableCols,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters as (
      filters: Updater<ColumnFiltersState>
    ) => void,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnPinning,
      columnVisibility,
    },
  });
  const sidebar = (
    <>
      <div>
        <div>
          {match(numberOfRows)
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
                data: P.select("count"),
              },
              ({ count }) => (
                <div className="inline-flex items-center justify-start gap-2.5">
                  <div>
                    <span className="text-base font-semibold leading-normal text-[#111928]">
                      {count}
                    </span>
                    <span className="text-sm font-normal leading-tight text-[#111928]">
                      {" "}
                    </span>
                    <span className="text-base font-normal leading-normal text-gray-500">
                      Records
                    </span>
                  </div>
                </div>
              )
            )
            .otherwise(() => (
              <p>Number of rows: 0</p>
            ))}
        </div>
        {dataEnabled && (
          <>
            {form &&
            form.watch("filters") &&
            form.watch("filters").length > 0 ? (
              <div className="inline-flex items-center justify-start gap-2.5">
                <div className="text-xs font-normal leading-none text-gray-500">
                  {form.watch("filters").length} active filter
                  {form.watch("filters").length > 1 ? "s" : ""}
                </div>
              </div>
            ) : (
              <div className="inline-flex h-4 items-center justify-start gap-2.5">
                <div className="text-xs font-normal leading-none text-gray-500">
                  No active filters
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Form {...form}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-sm font-semibold leading-tight text-[#111928]">
            <SquareSplitHorizontal className="h-5 w-5" />
            Row
          </div>
        </div>
        <RowsSelect
          label="Row"
          options={columns
            .map((c) => c.key)
            .filter((c) => c !== form.watch("column"))}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-sm font-semibold leading-tight text-[#111928]">
            <SquareSplitVerticalIcon className="h-5 w-5" />
            Column
          </div>
        </div>
        <ColumnSelect
          table={table}
          label="Column"
          options={columns
            .map((c) => c.key)
            .filter((c) => c !== form.watch("row"))}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-sm font-semibold leading-tight text-[#111928]">
            <HashtagIcon className="h-5 w-5" />
            Value
          </div>
        </div>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a value to be aggregated" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {columns
                    .filter((c) => c.type === "numeric" || c.type === "int")
                    .map((c) => c.key)
                    .filter(
                      (c) =>
                        c !== form.watch("row") && c !== form.watch("column")
                    )
                    .map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-sm font-semibold leading-tight text-[#111928]">
            <FilterIcon className="h-5 w-5" />
            Filters
          </div>
        </div>
        <Filters columns={columns} resourceId={resourceId} />
      </Form>
    </>
  );
  return (
    <Drawer>
      <div className="container grid h-full grow grid-cols-4 gap-4">
        <div
          className={cn(
            `relative col-span-full flex w-full grow flex-col gap-y-2 py-4 lg:col-span-3`,
            sidebarHidden && "lg:col-span-4"
          )}
        >
          <div className="container flex justify-end gap-x-4 pt-4 ml-auto pr-0">
            {tableData && dataEnabled && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-x-2 px-2 py-2">
                    <UploadIcon className="h-4 w-4" />
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-64">
                  <div className="flex flex-col gap-y-2">
                    <span className="text-sm font-semibold leading-tight text-[#111928]">
                      Export Data
                    </span>
                    <LoaderButton
                      onClick={() =>
                        exportRawData.mutate({
                          resourceId,
                          filters: form.watch("filters"),
                          count: numberOfRows.data ?? 0,
                        })
                      }
                      loading={exportRawData.isLoading}
                      variant="outline"
                    >
                      Export Raw Data
                    </LoaderButton>
                    <LoaderButton
                      onClick={() =>
                        exportTableData.mutate({
                          resourceId,
                          tableData,
                        })
                      }
                      loading={exportTableData.isLoading}
                      variant="outline"
                    >
                      Export Table Data
                    </LoaderButton>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <DrawerTrigger asChild>
              <Button className="gap-x-2 px-2 py-2 lg:hidden">
                <FunnelIcon className="h-4 w-4" />
                Structure & Filtering{" "}
              </Button>
            </DrawerTrigger>
            {sidebarHidden && (
              <Button
                className="hidden gap-x-2 px-2 py-2 lg:flex"
                onClick={() => hideSidebar(false)}
              >
                <FunnelIcon className="h-4 w-4" />
                Structure & Filtering{" "}
              </Button>
            )}
          </div>
          <div className="flex grow flex-col shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            {isFetching && isPlaceholderData && (
              <span className="animate-pulse-fast h-1.5 w-full bg-accent/10" />
            )}
            {!tableData && !possibleValuesRows && (
              <div className="flex grow items-center justify-between border-b border-gray-200 bg-white p-4">
                <h2 className="grow p-4 text-center text-lg font-semibold text-accent">
                  Please select a row a column and a value to display the data
                </h2>
              </div>
            )}
            {data && data.length > 0 && (
              <Table
                table={table}
                isLoading={rowsLoading || (dataLoading && dataEnabled)}
                columns={columns}
                resourceId={resourceId}
                form={form}
              />
            )}
          </div>
        </div>
        <div
          className={cn(
            "relative col-span-full hidden h-full w-full flex-col gap-y-4 border-l border-gray-200 bg-white p-4 lg:col-span-1 lg:flex",
            sidebarHidden && "hidden"
          )}
        >
          <Button
            variant="outline"
            className="absolute right-4 top-2 px-2 py-2"
            onClick={() => hideSidebar(true)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
          {sidebar}
        </div>
        <DrawerContent>
          <div className="max-h-[80vh] overflow-y-scroll">
            <div className="flex flex-col gap-y-4 p-4">{sidebar}</div>
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
