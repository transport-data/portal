import { useMemo, useState } from "react";
import { ListOfFilters, Table, ToggleColumns, TopBar } from "./Table";
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
import { Form } from "@components/ui/form";

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
  const [columnPinning, setColumnPinning] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const filteredColumns = columnFilters
    .map((filter) => ({
      ...filter,
      value: filter.value.filter((v) => v.value !== ""),
    }))
    .filter((filter) => filter.value.length > 0);
  const form = useForm<QueryFormType>({
    resolver: zodResolver(querySchema),
  });
  const { data: possibleValuesColumns } = usePossibleValues(
    resourceId,
    form.watch("column"),
    !!form.watch("column") && !!form.watch("row")
  );
  const { data: possibleValuesRows, isLoading: rowsLoading } =
    usePossibleValues(resourceId, form.watch("row"), !!form.watch("row"));

  console.log('COLUMNS', columns)
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
    filters: filteredColumns,
    enabled: dataEnabled,
    columnsType: columns.find((c) => c.key === form.watch("column"))?.type ?? 'text',
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
      columnFilters: filteredColumns,
    },
  });
  return (
    <div className="grid grid-cols-4 gap-4">
      <div
        className={`relative col-span-full flex w-full grow flex-col gap-y-2 lg:col-span-3`}
      >
        <div className="flex flex-row justify-between gap-x-2">
          <div className="flex grow flex-row justify-between">
            <ListOfFilters
              filters={filteredColumns}
              setFilters={setColumnFilters}
            />
          </div>
        </div>
        <div className="flex grow flex-col shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {isFetching && isPlaceholderData && (
            <span className="animate-pulse-fast h-1.5 w-full bg-accent/10" />
          )}
          {data && data.length > 0 && (
            <Table
              table={table}
              numOfRows={0}
              isLoading={rowsLoading || (dataLoading && dataEnabled)}
              columnFilters={columnFilters}
            />
          )}
        </div>
      </div>
      <div className="col-span-full flex w-full flex-col gap-y-4 lg:col-span-1">
        <Form {...form}>
          <ColumnSelect
            label="Row"
            name="row"
            options={columns
              .map((c) => c.key)
              .filter((c) => c !== form.watch("column"))}
          />
          <div>
            <ColumnSelect
              label="Column"
              name="column"
              options={columns
                .map((c) => c.key)
                .filter((c) => c !== form.watch("row"))}
            />
            {possibleValuesColumns && (
              <ToggleColumns table={table} row={form.watch("row")} />
            )}
          </div>
          <ColumnSelect
            label="Value"
            name="value"
            options={columns
              .filter((c) => c.type === "numeric" || c.type === "int")
              .map((c) => c.key)
              .filter(
                (c) => c !== form.watch("row") && c !== form.watch("column")
              )}
          />
        </Form>
      </div>
    </div>
  );
}
