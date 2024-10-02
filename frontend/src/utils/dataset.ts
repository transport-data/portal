import CkanRequest from "@datopian/ckan-api-client-js";
import { env } from "@env.mjs";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { CkanResponse } from "@schema/ckan.schema";
import { DatasetFormType, SearchDatasetType } from "@schema/dataset.schema";

export async function searchDatasets<T = Dataset>({
  apiKey,
  options,
}: {
  apiKey: string;
  options: SearchDatasetType;
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

  if (options.advancedQueries?.length) {
    options.advancedQueries.forEach((element) => {
      fqAr.push(buildOrFq(element.key, element.values));
    });
  }

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

  if (options.publicationDates?.length) {
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

  if (options.startYear && options.endYear) {
    fqAr.push(
      buildOrFq("temporal_coverage_start", [
        `[${new Date(
          Number(options.startYear),
          0,
          1
        ).toISOString()} TO ${new Date(
          Number(options.endYear),
          11,
          31
        ).toISOString()}]`,
      ])
    );

    fqAr.push(
      buildOrFq("temporal_coverage_end", [
        `[${new Date(
          Number(options.startYear),
          0,
          1
        ).toISOString()} TO ${new Date(
          Number(options.endYear),
          11,
          31
        ).toISOString()}]`,
      ])
    );
  } else if (options.endYear) {
    fqAr.push(
      buildOrFq("temporal_coverage_start", [
        `[* TO ${new Date(Number(options.endYear - 1), 11, 31).toISOString()}]`,
      ])
    );

    fqAr.push(
      buildOrFq("temporal_coverage_end", [
        `[* TO ${new Date(Number(options.endYear - 1), 11, 31).toISOString()}]`,
      ])
    );
  } else if (options.startYear) {
    fqAr.push(
      buildOrFq("temporal_coverage_start", [
        `[${new Date(Number(options.startYear + 1), 0, 1).toISOString()} TO *]`,
      ])
    );

    fqAr.push(
      buildOrFq("temporal_coverage_end", [
        `[${new Date(Number(options.startYear + 1), 0, 1).toISOString()} TO *]`,
      ])
    );
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

  if (options.private || options.includePrivate) {
    queryParams.push(`include_private=${true}`);
  }

  if (queryParams?.length) {
    endpoint += `?${queryParams.join("&")}`;
  }

  if (options.facetsFields) {
    endpoint += `&facet.field=${options.facetsFields}&facet.limit=1000000000&facet.mincount=0`;
  }

  endpoint += `&include_archived=${!!options.showArchived}`;
  endpoint += `&include_drafts=${!!options.includeDrafts}`;

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