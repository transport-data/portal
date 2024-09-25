import CkanRequest from "@datopian/ckan-api-client-js";
import { Dataset } from "@portaljs/ckan";
import { CkanResponse } from "@schema/ckan.schema";
import { DatasetFormType, SearchDatasetsType } from "@schema/dataset.schema";

export async function searchDatasets<T = Dataset>({
  apiKey,
  options,
}: {
  apiKey: string;
  options: SearchDatasetsType;
}): Promise<{
  datasets: Array<T>;
  count: number;
  facets: Record<string, any>;
}> {
  let endpoint = "package_search";
  let fqAr = [];
  let queryParams = [];

  const buildOrFq = (key: string, values: string[]) =>
    `${key}:(${values.join(" OR ")})`;

  if (options.groups?.length) {
    fqAr.push(buildOrFq("groups", options.groups));
  }

  if (options.orgs?.length) {
    fqAr.push(buildOrFq("organization", options.orgs));
  }

  if (options.tags?.length) {
    fqAr.push(buildOrFq("tags", options.tags));
  }

  if (options.resFormat?.length) {
    fqAr.push(buildOrFq("res_format", options.resFormat));
  }

  if (options.type?.length) {
    fqAr.push(buildOrFq("type", options.type));
  }

  if (options.regions?.length) {
    fqAr.push(buildOrFq("regions", options.regions));
  }

  if (options.countries?.length) {
    fqAr.push(buildOrFq("geographies", options.countries));
  }

  if (options.fuel) {
    fqAr.push(buildOrFq("fuel", [options.fuel]));
  }

  if (options.sector) {
    fqAr.push(buildOrFq("sectors", [options.sector]));
  }

  if (options.mode) {
    fqAr.push(buildOrFq("modes", [options.mode]));
  }

  if (options.service) {
    fqAr.push(buildOrFq("services", [options.service]));
  }

  if (
    options.publicationDates?.length &&
    !options.publicationDates.find((x) => x === "*")
  ) {
    fqAr.push(
      buildOrFq(
        "metadata_created",
        options.publicationDates.map((x) => {
          if (x.toLowerCase().includes("last")) {
            const date = new Date();

            const lastDayOfLastMonth = new Date(
              date.getFullYear(),
              date.getMonth(),
              0
            );

            const firstDayOfLastMonth = new Date(
              date.getFullYear(),
              date.getMonth() - 1,
              1
            );

            return `[${firstDayOfLastMonth.toISOString()} TO ${lastDayOfLastMonth.toISOString()}]`;
          }

          const startOfTheYear = new Date(Number(x), 0, 1);
          const endOfTheYear = new Date(Number(x), 11, 31);

          return `[${startOfTheYear.toISOString()} TO ${endOfTheYear.toISOString()}]`;
        })
      )
    );
  }

  if (options.private != undefined) {
    fqAr.push(`private:${options.private}`);
  }

  if (fqAr?.length) {
    queryParams.push(`fq=${fqAr.join("+")}`);
  }

  if (options.offset != undefined) {
    queryParams.push(`start=${options.offset}`);
  }

  if (options.limit != undefined) {
    queryParams.push(`rows=${options.limit}`);
  }

  if (options.query && options.query != "") {
    queryParams.push(`q=${options.query}`);
  }

  if (options.sort) {
    queryParams.push(`sort=${options.sort}`);
  }

  if (options.includePrivate != undefined) {
    queryParams.push(`include_private=${options.includePrivate}`);
  }

  if (queryParams?.length) {
    endpoint += `?${queryParams.join("&")}`;
  }

  if (options.facetsFields) {
    endpoint += `&facet.field=${options.facetsFields}&facet.limit=1000000000`;
  }

  endpoint += `&include_archived=${!!options.showArchived}`;
  console.log(endpoint);

  const response = await CkanRequest.get<any>(endpoint, {
    headers: { Authorization: apiKey },
  });

  return {
    datasets: response.result.results,
    count: response.result.count,
    facets: response.result.search_facets,
  };
}

export const getDataset = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const dataset: CkanResponse<Dataset> = await CkanRequest.post(
    "package_show",
    {
      apiKey,
      json: { id },
    }
  );

  return dataset;
};

export const createDataset = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: DatasetFormType;
}) => {
  const dataset = await CkanRequest.post<CkanResponse<Dataset>>(
    `package_create`,
    {
      apiKey,
      json: input,
    }
  );
  return dataset.result;
};

export const patchDataset = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: DatasetFormType;
}) => {
  const dataset = await CkanRequest.post<CkanResponse<Dataset>>(
    "package_patch",
    {
      apiKey: apiKey,
      json: input,
    }
  );
  return dataset.result;
};

export const deleteDatasets = async ({
  apiKey,
  ids,
}: {
  apiKey: string;
  ids: Array<string>;
}) => {
  const datasets: CkanResponse<Dataset>[] = await Promise.all(
    ids.map(
      async (id) =>
        await CkanRequest.post(`package_delete`, {
          apiKey: apiKey,
          json: { id },
        })
    )
  );
  return { datasets: datasets.map((dataset) => dataset.result) };
};
