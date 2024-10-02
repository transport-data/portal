import { CkanResponse } from "@components/data-explorer/ckan.interface";
import CkanRequest from "@datopian/ckan-api-client-js";

export const listTags = async ({
  apiKey,
}: {
  apiKey?: string;
}) => {
  // TODO: pagination and other params
  let action = "tag_list";
  const tags = await CkanRequest.get<CkanResponse<string[]>>(
    action,
    { apiKey: apiKey ?? '' }
  );
  return tags.result;
};
