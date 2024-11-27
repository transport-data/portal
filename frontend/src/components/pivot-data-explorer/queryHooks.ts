import { useQuery } from "@tanstack/react-query";
import { CkanResponse } from "./ckan.interface";
import { env } from "@env.mjs";
import { FilterObjType } from "./search.schema";

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
        //Nicolas requested us to hide the _id column
        columns: fields.result.fields.filter((field) => field.id !== '_id').map((field) => ({
          key: field.id,
          name: field.id,
          type: field.type,
          default: "",
        })),
      };
    },
  });
}

export function usePossibleValues({
  resourceId,
  column,
  enabled = false,
  onSuccess,
}: {
  resourceId: string;
  column: string;
  enabled?: boolean;
  onSuccess?: (
    data: {
      key: string;
      name: string;
      type: string;
      default: string;
      count: number;
    }[]
  ) => void;
}) {
  return useQuery({
    queryKey: ["possibleValues", resourceId, column],
    onSuccess: onSuccess,
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

export function useFootnote({
  rowValue,
  row,
  rowType,
  column,
  columnType,
  columnValue,
  resourceId,
}: {
  row: string;
  rowValue: string;
  rowType: string;
  column: string;
  columnValue: string;
  columnType: string;
  resourceId: string;
}) {
  return useQuery({
    queryKey: ["query", resourceId, column, row],
    queryFn: async () => {
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT \"Metadata\" FROM "${resourceId}" WHERE 1=1 AND \"${row}\" = ${
        rowType !== "text" ? `${rowValue}` : `'${rowValue}'`
      } AND \"${column}\" = ${
        columnType !== "text" ? `${columnValue}` : `'${columnValue}'`
      } LIMIT 1`;
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
      const data = tableData.result.records[0];
      return data;
    },
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
  enabled?: boolean;
  columnsType: string;
  filters: FilterObjType;
}) {
  return useQuery({
    queryKey: ["query", resourceId, pivotColumns, row, value, filters],
    queryFn: async () => {
      let filtersSql = "";
      if (filters.length > 0) {
        filtersSql =
          "AND " +
          filters
            .filter((f) => f.values.length > 0)
            .map(
              (filter) =>
                `("${filter.column}" IN (${filter.values
                  .map((v) => `${filter.type !== "text" ? `${v}` : `'${v}'`}`)
                  .join(",")}))`
            )
            .join(" AND ");
      }
      const cases = pivotColumns
        .map((c) =>
          columnsType === "text"
            ? `SUM(CASE WHEN \"${column}\"  = '${c}' THEN \"${value}\" ELSE 0 END) as "${c}" `
            : `SUM(CASE WHEN \"${column}\"  = ${c} THEN \"${value}\" ELSE 0 END) as "${c}" `
        )
        .join(", ");
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT \"${row}\", ${cases} FROM "${resourceId}" WHERE 1=1 ${filtersSql}  GROUP BY \"${row}\"`;
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

export function useNumberOfRows({
  resourceId,
  enabled = true,
  filters,
}: {
  resourceId: string;
  enabled?: boolean;
  filters: FilterObjType;
}) {
  return useQuery({
    queryKey: ["query", resourceId, filters],
    queryFn: async () => {
      let filtersSql = "";
      if (filters.length > 0) {
        filtersSql =
          "AND " +
          filters
            .filter((f) => f.values.length > 0)
            .map(
              (filter) =>
                `("${filter.column}" IN (${filter.values
                  .map((v) => `${filter.type !== "text" ? `${v}` : `'${v}'`}`)
                  .join(",")}))`
            )
            .join(" AND ");
      }
      const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT count(*) as count FROM "${resourceId}" WHERE 1=1 ${filtersSql}`;
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
      const count: number = tableData.result.records[0]?.count;
      return count;
    },
    enabled,
  });
}
