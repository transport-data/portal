import { useMutation } from "@tanstack/react-query";
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

async function fetchData(
  resourceId: string,
  filters: FilterObjType,
  offset: number,
  limit: number
) {
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
  const url = `${ckanUrl}/api/action/datastore_search_sql?sql=SELECT * FROM "${resourceId}" WHERE 1=1 ${filtersSql} OFFSET ${offset} LIMIT ${limit}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: DataResponse = await response.json();
  if (!data.success && data.error) {
    if (data.error.message) {
      throw Error(data.error.message);
    }
    throw Error(JSON.stringify(data.error));
  }
  return data.result.records;
}

export async function exportData({
  resourceId,
  filters,
  count,
}: {
  resourceId: string;
  filters: FilterObjType;
  count: number;
}) {
  const limit = 1000;
  const batchCount = Math.ceil(count / limit);
  const fetchPromises: any[] = [];
  const allData: Array<Record<string, any>> = [];

  for (let i = 0; i < batchCount; i++) {
    fetchPromises.push(fetchData(resourceId, filters, i * limit, limit));
  }

  async function processQueue() {
    while (fetchPromises.length > 0) {
      const batch = fetchPromises.splice(0, 3);
      const results = await Promise.all(batch);
      results.forEach((data) => allData.push(...data));
    }
  }

  if (fetchPromises.length > 1) {
    await processQueue();
  }
  if (batchCount === 1) {
    const data = await fetchData(resourceId, filters, 0, 1000);
    allData.push(...data);
  }
  return downloadData({ data: allData, filename: resourceId });
}

export function downloadData({
  data,
  filename,
}: {
  data: Array<Record<string, any>>;
  filename: string;
}) {
  const csvRows = [];
  const headers = Object.keys(data[0] as Record<string, any>).filter(
    (h) => h !== "_id" && h !== "_full_text"
  ); 
  csvRows.push(headers.join(";"));

  for (const obj of data) {
    const values = headers.map((header) => {
      if (header === "_full_text") {
        return "";
      }
      if (header === "_id") {
        return ""
      }
      return typeof obj[header] === "string"
        ? `"${(obj[header] as string)
            .replace(/"/g, '""')
            .replaceAll('"', '""')
            .replace("'", '""')}"`
        : obj[header];
    });
    csvRows.push(values.join(";"));
  }
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
}

export function useExportRawData() {
  return useMutation(
    ({
      resourceId,
      filters,
      count,
    }: {
      resourceId: string;
      filters: FilterObjType;
      count: number;
    }) => exportData({ resourceId, filters, count })
  );
}

export function useExportTableData() {
  return useMutation({
    mutationKey: ["exportTableData"],
    mutationFn: async ({
      tableData,
      resourceId,
    }: {
      tableData: Array<Record<string, any>>;
      resourceId: string;
    }) => downloadData({ data: tableData, filename: resourceId }),
  });
}
