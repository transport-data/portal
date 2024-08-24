import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@env.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import S3 from "@server/r2";
import { ResourceFormType } from "@schema/dataset.schema";
import CkanRequest from "@datopian/ckan-api-client-js";
import { CkanResponse } from "@schema/ckan.schema";
import { Resource } from "@portaljs/ckan";

export const getPreSignedUrl = async ({
  input,
}: {
  input: { filename: string };
}) => {
  const resourceId = uuid();
  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: `/bizdev-demo-dev/resources/${resourceId}/${input.filename}`,
    }),
    { expiresIn: 3600 }
  );
  return { resourceId, signedUrl };
};

export const createResource = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: ResourceFormType;
}) => {
  const resource = await CkanRequest.post<CkanResponse<Resource>>(
    `resource_create`,
    {
      apiKey,
      json: input,
    }
  );
  return resource.result;
};

export const updateResource = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: ResourceFormType;
}) => {
  try {
    const resource = await CkanRequest.post<CkanResponse<Resource>>(
      `resource_update`,
      {
        apiKey,
        json: { ...input },
      }
    );
    return resource.result;
  } catch (e) {
    let message = "Unknown Error";
    if (e instanceof Error) message = e.message;
    throw new Error(message);
  }
};

export const deleteResources = async ({
  apiKey,
  ids,
}: {
  apiKey: string;
  ids: string[];
}) => {
  const resources: CkanResponse<Resource>[] = await Promise.all(
    ids.map(
      async (id) =>
        await CkanRequest.post(`resource_delete`, {
          apiKey,
          json: { id },
        })
    )
  );
  return { resources: resources.map((resource) => resource.result) };
};
