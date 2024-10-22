import CkanRequest from "@datopian/ckan-api-client-js";
import { env } from "@env.mjs";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { User } from "@interfaces/ckan/user.interface";
import { Activity } from "@portaljs/ckan";
import { CkanResponse } from "@schema/ckan.schema";
import {
  DatasetDraftType,
  DatasetFormType,
  SearchDatasetType,
} from "@schema/dataset.schema";

import { DatasetSchemaType, License } from "@schema/dataset.schema";

//We need to use this cause the way the combobox to input related_datasets is setup
type DatasetCreateEditType = Omit<
  DatasetFormType,
  "related_datasets" | "temporal_coverage_start" | "temporal_coverage_end"
> & {
  related_datasets: Array<string>;
  temporal_coverage_start: string;
  temporal_coverage_end: string;
};

export async function searchDatasets<T = Dataset>({
  apiKey,
  options,
}: {
  apiKey?: string;
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

  if (options.sectors?.length) {
    fqAr.push(buildOrFq("sectors", options.sectors));
  }

  if (options.modes?.length) {
    fqAr.push(buildOrFq("modes", options.modes));
  }

  if (options.services?.length) {
    fqAr.push(buildOrFq("services", options.services));
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

  if (options.fuel) {
    fqAr.push(buildOrFq("fuel", [options.fuel]));
  }

  if (options.tdc_category) {
    fqAr.push(buildOrFq("tdc_category", [options.tdc_category]));
  }

  if (options.data_provider) {
    fqAr.push(buildOrFq("data_provider", [options.data_provider]));
  }

  if (options.query) {
    fqAr.push(buildOrFq("text", [`*"${options.query}"*`]));
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

  const headers: any = {};
  if (apiKey) {
    headers["Authorization"] = apiKey;
  }

  const response = await CkanRequest.get<any>(endpoint, {
    headers,
  });

  return {
    datasets: response.result.results,
    count: response.result.count,
    facets: response.result.search_facets,
  };
}

export async function approveDataset<T = Dataset>({
  apiKey,
  datasetId,
}: {
  apiKey: string;
  datasetId: string;
}): Promise<boolean> {
  const endpoint = "dataset_approval_update";
  const headers = { Authorization: apiKey };
  const response = await CkanRequest.post<CkanResponse<null>>(endpoint, {
    headers,
    json: {
      id: datasetId,
      status: "approved",
    },
  });

  return response.success;
}

export async function rejectDataset({
  apiKey,
  datasetId,
  reason,
}: {
  apiKey: string;
  datasetId: string;
  reason: string;
}): Promise<boolean> {
  const endpoint = "dataset_approval_update";
  const headers = { Authorization: apiKey };
  const response = await CkanRequest.post<CkanResponse<null>>(endpoint, {
    headers,
    json: {
      feedback: reason,
      id: datasetId,
      status: "rejected",
    },
  });

  return response.success;
}

export const getDataset = async ({
  id,
  apiKey,
  include_extras = false,
}: {
  id: string;
  apiKey: string;
  include_extras?: boolean;
}) => {
  const dataset: CkanResponse<Dataset> = await CkanRequest.post(
    "package_show",
    {
      apiKey,
      json: { id, include_extras },
    }
  );

  return dataset;
};

export const getDatasetActivities = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const activities: CkanResponse<Activity[]> = await CkanRequest.post(
    "package_activity_list",
    {
      apiKey,
      json: { id },
    }
  );

  return activities;
};

export const getDatasetSchema = async ({ apiKey }: { apiKey: string }) => {
  const dataset: CkanResponse<DatasetSchemaType> = await CkanRequest.get(
    "scheming_dataset_schema_show?type=dataset",
    {
      apiKey,
    }
  );
  return dataset.result;
};

export function getChoicesFromField(schema: DatasetSchemaType, field: string) {
  const fieldSchema = schema.dataset_fields.find((f) => f.field_name === field);
  if (!fieldSchema || !fieldSchema.choices)
    return [] as Array<{ value: string; label: string }>;
  return fieldSchema.choices;
}

export const createDataset = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: DatasetCreateEditType;
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

export const draftDataset = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: DatasetDraftType;
}) => {
  const dataset = await CkanRequest.post<CkanResponse<Dataset>>(
    `package_create`,
    {
      apiKey,
      json: {
        ...input,
        state: "draft", //todo: state:"draft" is not working when creating datasets
      },
    }
  );
  if (dataset.result?.id && dataset.result?.state !== "draft") {
    const draft = await CkanRequest.post<CkanResponse<Dataset>>(
      "package_patch",
      {
        apiKey: apiKey,
        json: {
          id: dataset.result.id,
          state: "draft",
        },
      }
    );
    return draft.result;
  }
};

export const patchDataset = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: DatasetCreateEditType;
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

export const licensesList = async ({ apiKey }: { apiKey: string }) => {
  const licenses: CkanResponse<License[]> = await CkanRequest.get(
    `license_list`,
    {
      apiKey: apiKey,
    }
  );
  return licenses.result;
};

export const listDatasetActivities = async ({
  apiKey,
  ids,
}: {
  apiKey: string;
  ids: Array<string>;
}) => {
  const activities = await Promise.all(
    ids.map(async (id) => {
      const response = await CkanRequest.post<CkanResponse<Activity[]>>(
        `package_activity_list`,
        {
          apiKey: apiKey,
          json: { id },
        }
      );
      return response.result;
    })
  );
  return activities.flat();
};


export const followDataset = async ({id,isFollowing,apiKey}:{id:string,isFollowing:boolean;apiKey:string})=>{
  const response = await CkanRequest.post<CkanResponse<any>>(
    `${isFollowing ? 'unfollow' : 'follow'}_dataset`,
    {
      apiKey: apiKey,
      json: { id },
    }
  );

  return response.result
}

export const getDatasetFollowersList = async ({id,apiKey}:{id:string,apiKey:string})=>{
  const response = await CkanRequest.post<CkanResponse<User[]>>(
    `dataset_follower_list`,
    {
      apiKey: apiKey,
      json: { id },
    }
  );
  return response.result
}