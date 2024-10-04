import { CKAN } from "@portaljs/ckan";
import { CkanResponse } from "@schema/ckan.schema";
import { env } from "@env.mjs";
import {
  DatasetFormType,
  DatasetSchemaType,
  License,
  SearchDatasetType,
} from "@schema/dataset.schema";
import CkanRequest from "@datopian/ckan-api-client-js";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { Activity } from "@portaljs/ckan";

//We need to use this cause the way the combobox to input related_datasets is setup
type DatasetCreateEditType = Omit<
  DatasetFormType,
  "related_datasets" | "temporal_coverage_start" | "temporal_coverage_end"
> & {
  related_datasets: Array<string>;
  temporal_coverage_start: string;
  temporal_coverage_end: string;
};

export const searchDatasets = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: SearchDatasetType;
}) => {
  const ckanUrl = env.NEXT_PUBLIC_CKAN_URL;
  const baseAction = `package_search`;

  let queryParams: string[] = [];

  const buildOrFq = (key: string, values: string[]) =>
    `${key}:(${values.join(" OR ")})`;

  if (input?.offset) {
    queryParams.push(`start=${input.offset}`);
  }

  if (input.orgs?.length) {
    queryParams.push(`fq=${buildOrFq("organization", input.orgs)}`);
  }

  if (input?.offset) {
    queryParams.push(`start=${input.offset}`);
  }

  if (input?.sort) {
    queryParams.push(`sort=${input?.sort}`);
  }

  if (input?.include_private) {
    queryParams.push(`include_private=${input?.include_private}`);
  }

  if (input?.include_drafts) {
    queryParams.push(`include_drafts=${input?.include_drafts}`);
  }

  const action = `${baseAction}?${queryParams.join("&")}`;
  const datasets: CkanResponse<{ results: Dataset[]; count: number }> =
    await CkanRequest.get(action, { ckanUrl, apiKey });

  return datasets.result;
};

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
