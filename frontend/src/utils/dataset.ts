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

  if (options.groups && options.groups.length > 0) {
    fqAr.push(buildOrFq("groups", options.groups));
  }

  if (options.orgs && options.orgs.length > 0) {
    fqAr.push(buildOrFq("organization", options.orgs));
  }

  if (options.tags && options.tags.length > 0) {
    fqAr.push(buildOrFq("tags", options.tags));
  }

  if (options.resFormat && options.resFormat.length) {
    fqAr.push(buildOrFq("res_format", options.resFormat));
  }

  if (options.type && options.type.length) {
    fqAr.push(buildOrFq("type", options.type));
  }

  // if (options.advancedQueries && options.advancedQueries.length > 0) {
  //   options.advancedQueries.forEach((element) => {
  //     fqAr.push(
  //       element.hasPants
  //         ? `${element.key}:${element.values.join("")}`
  //         : buildOrFq(element.key, element.values)
  //     );
  //   });
  // }

  if (options.private != undefined) {
    fqAr.push(`private:${options.private}`);
  }

  if (options.mode) {
    fqAr.push(`modes:${options.mode}`);
  }

  if (options.sector) {
    fqAr.push(`sectors:${options.sector}`);
  }

  if (options.service) {
    fqAr.push(`services:${options.service}`);
  }

  if (options.region) {
    fqAr.push(`regions:${options.region}`);
  }

  if (fqAr.length > 0) {
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

  if (queryParams.length > 0) {
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
