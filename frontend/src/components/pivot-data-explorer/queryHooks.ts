import {
  ColumnSort,
  PaginationState,
  ColumnFilter,
  Updater,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { DataExplorerColumnFilter } from "./DataExplorer";
import { CkanResponse } from "./ckan.interface";
import getConfig from "next/config";
import { env } from "@env.mjs";

export interface FieldsResponse {
  tableName: string;
  fields: Record<string, any> | Array<{ name: string; alias: string }>;
}

export type DataResponse = CkanResponse<{
  sql: string;
  records: Array<Record<string, any>>;
  fields: Array<Record<string, any>>;
}>;

const ckanUrl = env.NEXT_PUBLIC_CKAN_URL;

export function useFields(resourceId: string) {
  return useQuery({
    queryKey: ["fields", resourceId],
    queryFn: async () => {
      const fieldsRes = await fetch(
        `${ckanUrl}/api/3/action/datastore_search?resource_id=${resourceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fields: CkanResponse<{
        fields: Array<{
          id: string;
          name: string;
          info: { label: string | null; default: string | null };
          type: string;
        }>;
      }> = await fieldsRes.json();

      return {
        tableName: resourceId,
        columns: fields.result.fields.map((field) => ({
          key: field.id,
          name: field.id,
          type: field.type,
          default: "",
        })),
      };
    },
  });
}

export function usePossibleValues(
  resourceId: string,
  column: string,
  enabled = false
) {
  return useQuery({
    queryKey: ["possibleValues", resourceId, column],
    queryFn: async () => {
      const possibleValuesRes = await fetch(
        `${ckanUrl}/api/3/action/datastore_search_sql?sql=SELECT \"${column}\" as columnname, count(distinct \"${column}\") as count FROM \"${resourceId}\" GROUP BY \"${column}\"`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const fields: DataResponse = await possibleValuesRes.json();

      console.log("FIELDS", fields);
      return fields.result.records
        .map((field) => ({
          key: `${field.columnname}`,
          name: `${field.columnname}`,
          type: typeof field.columnname === "string" ? "string" : "number",
          default: "",
          count: field.count,
        }))
        .filter((field) => field.key);
    },
    enabled,
  });
}

export function useNumberOfRows({
  resourceId,
  filters,
}: {
  resourceId: string;
  filters: DataExplorerColumnFilter[];
}) {
  return useQuery({
    queryKey: ["query", resourceId, filters],
    queryFn: async () => {
      const filtersSql =
        filters.length > 0
          ? "WHERE " +
            filters
              .map(
                (filter) =>
                  `(${filter.value
                    .filter((v) => v.value !== "")
                    .map(
                      (v) =>
                        `"${filter.id}" ${v.operation} '${v.value}' ${
                          v.link ?? ""
                        }`
                    )
                    .join("")})`
              )
              .join(" AND ")
          : "";
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT count(*) FROM "${resourceId}" ${filtersSql}`;
      const numRowsRes = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const numRows: DataResponse = await numRowsRes.json();
      if (!numRows.success && numRows.error) {
        if (numRows.error.message) throw Error(numRows.error.message);
        throw Error(JSON.stringify(numRows.error));
      }
      if (
        numRows.result &&
        numRows.result.records[0] &&
        (numRows.result.records[0].count ||
          numRows.result.records[0].count === 0)
      ) {
        return numRows.result.records[0].count as number;
      }
      throw new Error("Could not get number of rows");
    },
    placeholderData: (previousData: any) => previousData,
  });
}

export function useTableData({
  resourceId,
  pivotColumns,
  column,
  row,
  value,
  enabled = true,
  filters,
  columnsType,
}: {
  resourceId: string;
  pivotColumns: string[];
  column: string;
  row: string;
  value: string;
  filters: ColumnFilter[];
  enabled?: boolean;
  columnsType: string;
}) {
  return useQuery({
    queryKey: ["query", resourceId, pivotColumns, row, value, filters],
    queryFn: async () => {
      const filtersSql =
        filters.length > 0
          ? "WHERE " +
            filters
              .map(
                (filter) =>
                  `(${(filter.value as any[])
                    .filter((v: any) => v.value !== "")
                    .map(
                      (v) =>
                        `"${filter.id}" ${v.operation} '${v.value}' ${
                          v.link ?? ""
                        }`
                    )
                    .join("")})`
              )
              .join(" AND ")
          : "";
      const cases = pivotColumns
        .map((c) =>
          columnsType === "text"
            ? `SUM(CASE WHEN \"${column}\"  = '${c}' THEN \"${value}\" ELSE 0 END) as "${c}" `
            : `SUM(CASE WHEN \"${column}\"  = ${c} THEN \"${value}\" ELSE 0 END) as "${c}" `
        )
        .join(", ");
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT \"${row}\", ${cases} FROM "${resourceId}" ${filtersSql} GROUP BY \"${row}\"`;
      const tableDataRes = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const tableData: DataResponse = await tableDataRes.json();
      if (!tableData.success && tableData.error) {
        if (tableData.error.message) {
          throw Error(tableData.error.message);
        }
        throw Error(JSON.stringify(tableData.error));
      }
      const data = tableData.result.records;
      return data;
    },
    enabled,
    placeholderData: (previousData: any) => previousData,
  });
}
