import { CKAN, Dataset } from "@portaljs/ckan";
import { CkanResponse } from "@schema/ckan.schema";
import { env } from "@env.mjs";
import { DatasetFormType, SearchDatasetType } from "@schema/dataset.schema";
import CkanRequest from "@datopian/ckan-api-client-js";

export const searchDatasets = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: SearchDatasetType;
}) => {
  const ckan = new CKAN(`${env.NEXT_PUBLIC_CKAN_URL}`);
  const datasets = await ckan.packageSearch(input, {
    headers: {
      Authorization: apiKey,
    },
  });

  const results = datasets.datasets;
  return results;
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
