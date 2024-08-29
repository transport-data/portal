import { useMemo, useState } from "react";
import { ListOfFilters, Table, TopBar } from "./Table";
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
import { useFields, useNumberOfRows, useTableData } from "./queryHooks";
import Spinner from "./Spinner";
import { FilterObjType } from "./search.schema";
import "@tanstack/react-table";

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
      <div className="bg-lima-700 my-auto flex w-full flex-col items-center justify-center overflow-hidden opacity-75 h-full">
        <Spinner className="text-blue-800 w-12 h-12" />
        <h2 className="text-center text-xl font-semibold text-blue-800">
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
  const cols = useMemo(() => columns ?? [], [columns]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const resetPagination = () => {
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  const [columnFilters, setColumnFilters] = useState<
    DataExplorerColumnFilter[]
  >([]);
  const filteredColumns = columnFilters
    .map((filter) => ({
      ...filter,
      value: filter.value.filter((v) => v.value !== ""),
    }))
    .filter((filter) => filter.value.length > 0);

  const [columnPinning, setColumnPinning] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data: numOfRows } = useNumberOfRows({
    resourceId,
    filters: filteredColumns,
  });
  const pageCount = numOfRows ? Math.ceil(numOfRows / 10) : 0;

  const {
    data: tableData,
    isLoading,
    isPlaceholderData,
    isFetching,
  } = useTableData({
    resourceId,
    pagination,
    sorting,
    columns: columns.map((c) => c.key),
    filters: filteredColumns,
  });

  const _prefetchData = useTableData({
    resourceId,
    pagination: {
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    },
    sorting,
    filters: filteredColumns,
    columns: columns.map((c) => c.key),
    enabled: !isLoading,
  });

  const data = useMemo(() => tableData ?? [], [tableData]);
  const tableCols = useMemo(() => {
    return cols.map((c) => ({
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
  }, [cols]);

  const table = useReactTable({
    data,
    columns: tableCols,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    manualSorting: true,
    onSortingChange: setSorting,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters as (
      filters: Updater<ColumnFiltersState>
    ) => void,
    pageCount,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination,
      sorting,
      columnPinning,
      columnVisibility,
      columnFilters: filteredColumns,
    },
  });
  if (pageCount < pagination.pageIndex) resetPagination();
  return (
    <div className={`w-full relative grow flex flex-col gap-y-2`}>
      <div className="flex flex-col gap-y-4 sm:flex-row justify-between items-end sm:items-center px-6">
        <TopBar table={table} numOfRows={numOfRows ?? 0} />
      </div>
      <div className="flex flex-row justify-between gap-x-2 px-6">
        <div className="flex flex-row justify-between grow">
          <ListOfFilters
            filters={filteredColumns}
            setFilters={setColumnFilters}
          />
        </div>
      </div>
      <div className="flex flex-col grow border border-gray-200">
        {isFetching && isPlaceholderData && (
          <span className="w-full h-1.5 animate-pulse-fast bg-blue-400" />
        )}
        <Table
          table={table}
          numOfRows={numOfRows ?? 0}
          isLoading={isLoading}
          columnFilters={columnFilters}
        />
      </div>
    </div>
  );
}
