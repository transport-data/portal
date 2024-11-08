import { flexRender, Table as TableType, Header } from "@tanstack/react-table";
import { Pin, PinOff } from "lucide-react";
import { useState } from "react";
import { XCircleIcon } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { DataExplorerColumnFilter } from "./DataExplorer";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { useFootnote } from "./queryHooks";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { QueryFormType } from "./search.schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

type TableProps = {
  table: TableType<any>;
  isLoading: boolean;
  resourceId: string;
  columns: {
    key: string;
    name: string;
    type: string;
    default?: string;
  }[];
  form: UseFormReturn<QueryFormType>;
};

export function ToggleColumns({
  table,
  row,
}: {
  table: TableType<any>;
  row: string;
}) {
  let [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [q, setQ] = useState("");

  let filteredItems =
    q === ""
      ? table.getAllLeafColumns()
      : table.getAllLeafColumns().filter((column) => {
          return (
            column.id.toLowerCase().includes(q.toLowerCase()) ||
            (typeof column.columnDef.header === "string" &&
              column.columnDef.header.toLowerCase().includes(q.toLowerCase()))
          );
        });
  filteredItems = filteredItems.filter((column) => {
    return column.id !== row && column.id !== "null";
  });
  return (
    <ScrollArea className="h-64">
      <div className="overflow-hiddenoverflow-y-auto rounded-md bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
              <label htmlFor="toggle-all" className="font-medium text-gray-900">
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
      </div>
    </ScrollArea>
  );
}

function FootnotePopover({
  rowType,
  row,
  rowValue,
  columnType,
  columnValue,
  column,
  resourceId,
}: {
  rowType: string;
  row: string;
  rowValue: string;
  columnType: string;
  columnValue: string;
  column: string;
  resourceId: string;
}) {
  const { data: metadata, isLoading } = useFootnote({
    rowType,
    row,
    rowValue,
    columnType,
    column,
    columnValue,
    resourceId,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!metadata) {
    return null;
  }
  return <div>{metadata.Metadata}</div>;
}

export function Table({ table, isLoading, columns, resourceId, form }: TableProps) {
  console.log('FORM', form)
  const columnName = form && form.watch ? form.watch("column") : '';
  const rowName = form && form.watch ? form.watch("row") : '';
  const columnType = columns.find((c) => c.key === columnName)?.type ?? "text";
  const rowType = columns.find((c) => c.key === rowName)?.type ?? "text";
  return (
    <div className="flex max-w-full grow">
      <table className="block w-max shadow">
        <thead className="bg-gray-100 text-left">
          {table.getLeftHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="min-w-[200px] py-8 pl-12 text-sm font-semibold text-gray-500"
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
                      className="min-w-[200px] py-8 pl-12 text-sm font-semibold text-gray-500"
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
                  {r.getCenterVisibleCells().map((c) => {
                    const rowValue =
                      (r.getAllCells()[0]?.getValue() as string) ?? "";
                    const columnValue = c.column.id;
                    if (!c.getValue() && isLoading) {
                      return (
                        <td key={c.id} className="py-2 pl-12">
                          <div className="flex min-h-[65px] items-center text-base">
                            <span className="h-4 w-24 animate-pulse rounded-md bg-accent/20" />
                          </div>
                        </td>
                      );
                    }
                    if (c.getValue() === "" || c.getValue() === " " || !c.getValue()) {
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
                          <Popover>
                            <PopoverTrigger>
                              <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                            </PopoverTrigger>
                            <PopoverContent>
                              <FootnotePopover
                                column={columnName}
                                columnType={columnType}
                                columnValue={columnValue}
                                resourceId={resourceId}
                                row={rowName}
                                rowType={rowType}
                                rowValue={rowValue}
                              />
                            </PopoverContent>
                          </Popover>
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
