import { type CkanResponse } from "@schema/ckan.schema";
import CkanRequest from "@datopian/ckan-api-client-js";
import { GroupFormType, type Group, GroupTree } from "@schema/group.schema";

export const getGroup = async ({
  apiKey,
  id,
}: {
  apiKey: string;
  id: string;
}) => {
  let action = "group_show";
  action += `?id=${id}`;
  const groups = await CkanRequest.get<CkanResponse<Group>>(action, {
    apiKey,
  });
  return groups.result;
};

export const listGroups = async ({
  apiKey,
  type,
  showCoordinates,
}: {
  apiKey?: string;
  type: "topic" | "geography";
  showCoordinates?: boolean;
}) => {
  // TODO: implement pagination and other parameters
  let action = "group_list?";
  action += "&all_fields=True";
  action += "&include_extras=True";
  action += `&type=${type}`;

  if (type === "geography" && showCoordinates) {
    action += `&include_shapes=${true}`;
  }

  const groups = await CkanRequest.get<
    CkanResponse<
      Group[] & { geography_shape?: { type: string; coordinates: [] } }
    >
  >(action, {
    apiKey: apiKey ?? "",
  });
  return groups.result;
};

export const groupTree = async ({
  apiKey,
  type,
}: {
  apiKey?: string;
  type: "topic" | "geography";
}) => {
  // TODO: implement pagination and other parameters
  let action = "group_tree?";
  action += `&type=${type}`;

  const groups = await CkanRequest.get<CkanResponse<GroupTree[]>>(action, {
    apiKey: apiKey ?? "",
  });
  return groups.result;
};

export const listAuthorizedGroups = ({ apiKey }: { apiKey: string }) => {};

export const createGroup = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: GroupFormType;
}) => {
  const group: CkanResponse<Group> = await CkanRequest.post("group_create", {
    apiKey,
    json: input,
  });
  return group.result;
};

export const patchGroup = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: GroupFormType;
}) => {
  const group: CkanResponse<Group> = await CkanRequest.post("group_patch", {
    apiKey,
    json: input,
  });
  return group.result;
};

export const deleteGroups = async ({
  apiKey,
  ids,
}: {
  apiKey: string;
  ids: Array<string>;
}) => {
  const groups: CkanResponse<Group>[] = await Promise.all(
    ids.map(
      async (id) =>
        await CkanRequest.post(`group_delete`, {
          apiKey: apiKey,
          json: { id },
        })
    )
  );
  return { groups: groups.map((group) => group.result) };
};

export const followGroups = async ({
  apiKey,
  ids,
}: {
  apiKey: string;
  ids: Array<string>;
}) => {
  const groups: CkanResponse<Group>[] = await Promise.all(
    ids.map(
      async (id) =>
        await CkanRequest.post(`follow_group`, {
          apiKey: apiKey,
          json: { id },
        })
    )
  );
  return { groups: groups.map((group) => group.result) };
};

