import { type User } from "@interfaces/ckan/user.interface";
import { type CkanResponse } from "@schema/ckan.schema";
import { type UserFormType } from "@schema/user.schema";
import CkanRequest from "@lib/ckan-request";

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

export const inviteUser = async ({
  emails,
  message,
  apiKey,
}: {
  emails: string[];
  message: string;
  apiKey?: string;
}) => {
  const response: CkanResponse<string> = await CkanRequest.post(
    `invite_user_to_tdc`,
    {
      apiKey: apiKey,
      json: {
        emails: emails,
        message: message,
      },
    }
  );

  return response;
};

export const getUserFollowee = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const followee: CkanResponse<any> = await CkanRequest.get(
    `followee_list?id=${id}`,
    {
      apiKey: apiKey,
    }
  );

  return followee.result;
};

export const getApiTokens = async ({
  user_id,
  apiKey,
}: {
  user_id: string;
  apiKey: string;
}) => {
  const tokens: CkanResponse<any> = await CkanRequest.get(
    `api_token_list?user_id=${user_id}`,
    {
      apiKey: apiKey,
    }
  );

  return tokens;
};

export const createApiToken = async ({
  user_id,
  name,
  apiKey,
}: {
  user_id: string;
  name: string;
  apiKey: string;
}) => {
  const response: CkanResponse<any> = await CkanRequest.post(
    "api_token_create",
    {
      apiKey: apiKey,
      json: {
        user: user_id,
        name: name,
      },
    }
  );

  return response;
};

export const revokeApiToken = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const response: CkanResponse<any> = await CkanRequest.post(
    "api_token_revoke",
    {
      apiKey: apiKey,
      json: {
        jti: id,
      },
    }
  );

  return response;
};
