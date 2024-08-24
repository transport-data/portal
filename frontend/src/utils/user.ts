import { type User } from "@interfaces/ckan/user.interface";
import { type CkanResponse } from "@schema/ckan.schema";
import { type UserFormType } from "@schema/user.schema";
import CkanRequest from "@datopian/ckan-api-client-js";

export const listUsers = async ({ apiKey }: { apiKey: string }) => {
  const users = await CkanRequest.get<CkanResponse<User[]>>("user_list", {
    apiKey,
  });
  return users.result;
};

export const getUser = async ({
  apiKey,
  id,
}: {
  apiKey: string;
  id: string;
}) => {
  const user: CkanResponse<User> = await CkanRequest.get(`user_show?id=${id}`, {
    apiKey,
  });
  return user.result;
};

export const getUsersById = async ({
  ids,
  apiKey,
}: {
  ids: string[];
  apiKey: string;
}) => {
  const users = await Promise.all(
    ids.map(async (id) => {
      return getUser({ apiKey, id });
    })
  );

  return users;
};

export const createUser = async ({
  user,
  apiKey,
}: {
  user: UserFormType;
  apiKey: string;
}) => {
  const newUser: CkanResponse<User> = await CkanRequest.post("user_create", {
    apiKey,
    json: { ...user },
  });
  return newUser.result;
};

export const generateUserApiKey = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const action = "user_generate_apikey";
  const user = await CkanRequest.post<CkanResponse<User>>(action, {
    apiKey,
    json: { id },
  });
  return user.result;
};

export const patchUser = async ({
  user,
  apiKey,
}: {
  user: User;
  apiKey: string;
}) => {
  const updatedUser: CkanResponse<User> = await CkanRequest.post(`user_patch`, {
    apiKey: apiKey,
    json: user,
  });
  return updatedUser.result;
};

export const deleteUsers = async ({
  apiKey,
  ids,
}: {
  apiKey: string;
  ids: string[];
}) => {
  const users = await Promise.all(
    ids.map(async (id) => {
      return await deleteUser({ id, apiKey });
    })
  );
  return users;
};

export const deleteUser = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const user: CkanResponse<User> = await CkanRequest.post(`user_delete`, {
    apiKey: apiKey,
    json: { id },
  });

  return user.result;
};
