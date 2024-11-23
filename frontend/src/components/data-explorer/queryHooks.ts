import {
  ColumnSort,
  PaginationState,
  ColumnFilter,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { DataExplorerColumnFilter } from "./DataExplorer";
import { CkanResponse } from "./ckan.interface";
import { env } from "@env.mjs";
import { useSession } from "next-auth/react";

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
  const session = useSession();
  const apiKey = session?.data?.user?.apikey ?? "";
  return useQuery({
    queryKey: ["fields", resourceId],
    queryFn: async () => {
      const fieldsRes = await fetch(
        `${ckanUrl}/api/3/action/datastore_search?resource_id=${resourceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
        },
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

export function useNumberOfRows({
  resourceId,
  filters,
}: {
  resourceId: string;
  filters: DataExplorerColumnFilter[];
}) {
  const session = useSession();
  const apiKey = session?.data?.user?.apikey ?? "";
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
                        }`,
                    )
                    .join("")})`,
              )
              .join(" AND ")
          : "";
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT count(*) FROM "${resourceId}" ${filtersSql}`;
      const numRowsRes = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
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
  pagination,
  columns,
  sorting,
  enabled = true,
  filters,
  columnsType,
}: {
  resourceId: string;
  pagination: PaginationState;
  columns: string[];
  sorting: ColumnSort[];
  enabled?: boolean;
  filters: ColumnFilter[];
  columnsType: string;
}) {
  const session = useSession();
  const apiKey = session?.data?.user?.apikey ?? "";
  return useQuery({
    queryKey: ["query", resourceId, pagination, columns, sorting, filters],
    queryFn: async () => {
      console.log("FILTERS", filters);
      const paginationSql = `LIMIT ${
        pagination.pageSize
      } OFFSET ${pagination.pageIndex * pagination.pageSize}`;
      const sortSql =
        sorting.length > 0
          ? "ORDER BY " +
            sorting
              .map((sort) => `"${sort.id}" ${sort.desc ? "DESC" : "ASC"}`)
              .join(", ")
          : "";
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
                        }`,
                    )
                    .join("")})`,
              )
              .join(" AND ")
          : "";
      console.log("FILTERS SQL", filtersSql);
      const parsedColumns = columns.map((column) => `"${column}"`);
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT ${parsedColumns.join(
        " , ",
      )} FROM "${resourceId}" ${filtersSql} ${sortSql} ${paginationSql}`;
      const tableDataRes = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
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
