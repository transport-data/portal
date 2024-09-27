import { type User } from "@portaljs/ckan";
import { type CkanResponse } from "@schema/ckan.schema";
import CkanRequest from "@datopian/ckan-api-client-js";
import { OrganizationFormType, type Organization } from "@schema/organization.schema";

export const createOrganization = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: OrganizationFormType;
}) => {
  const organization: CkanResponse<Organization> = await CkanRequest.post(
    "organization_create",
    {
      apiKey,
      json: input,
    }
  );
  return organization.result;
};

export const getOrganization = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: {
    id: string;
    includeUsers?: boolean;
  };
}) => {
  const action = `organization_show?id=${
    input.id
  }&include_users=${!!input.includeUsers}`;
  const organization = await CkanRequest.get<CkanResponse<Organization>>(
    action,
    {
      apiKey: apiKey,
    }
  );
  return organization.result;
};

export const getOrganizationTree = async ({
  orgId,
  apiKey,
}: {
  orgId: string;
  apiKey: string;
}) => {
  const action = `group_tree_section?type=organization&id=${orgId}`;
  const organizationTree = await CkanRequest.get<
    CkanResponse<Organization & { children: Organization[] }>
  >(action, { apiKey });
  return organizationTree.result;
};

export const patchOrganization = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: OrganizationFormType;
}) => {
  const organization: CkanResponse<Organization> = await CkanRequest.post(
    "organization_patch",
    {
      apiKey,
      json: {
        ...input,
      },
    }
  );
  return organization.result;
};

export const listOrganizations = async ({
  apiKey,
  input,
}: {
  apiKey?: string;
  input: {
    detailed?: boolean;
    includeUsers?: boolean;
  };
}) => {
  // TODO: pagination and other params
  let action = "organization_list";
  action += `?all_fields=${!!input.detailed}`;
  action += `&include_users=${!!input.includeUsers}`;
  const organizations = await CkanRequest.get<CkanResponse<Organization[]>>(
    action,
    { apiKey: apiKey ?? '' }
  );
  return organizations.result;
};

export const listUserOrganizations = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const organizationList = await CkanRequest.get<
    CkanResponse<(Organization & { capacity: "admin" | "editor" | "member" })[]>
  >(`organization_list_for_user?id=${id}`, {
    apiKey: apiKey,
  });
  const organizations = organizationList.result;
  return organizations;
};

export const removeOrganizationMembers = async ({
  apiKey,
  input,
}: {
  apiKey: string;
  input: { id: string; usernames: string[] };
}) => {
  const members = (
    await Promise.all(
      input.usernames.map(async (username) => {
        return await removeOrganizationMember({
          input: { username, id: input.id },
          apiKey,
        });
      })
    )
  ).flat();
  return members;
};

export const removeOrganizationMember = async ({
  apiKey,
  input,
}: {
  input: {
    username: string;
    id: string;
  };
  apiKey: string;
}) => {
  const url = `organization_member_delete`;
  const memberDelete = await CkanRequest.post<CkanResponse<User>>(url, {
    apiKey,
    json: input,
  });

  return memberDelete.result;
};

export const addOrganizationMember = async ({
  input,
  apiKey,
}: {
  input: {
    username: string;
    role: "admin" | "editor" | "member";
    id: string;
  };
  apiKey: string;
}) => {
  const action = `organization_member_create`;
  const memberAdd = await CkanRequest.post<CkanResponse<User>>(action, {
    apiKey,
    json: input,
  });

  return memberAdd.result;
};

export const patchOrganizationMemberRole = async ({
  input,
  apiKey,
}: {
  input: {
    username: string;
    role: "admin" | "editor" | "member";
    id: string;
  };
  apiKey: string;
}) => {
  await removeOrganizationMember({
    input: {
      username: input.username,
      id: input.id,
    },
    apiKey,
  });
  await addOrganizationMember({
    input: {
      username: input.username,
      role: input.role,
      id: input.id,
    },
    apiKey,
  });
};

export const deleteOrganizations = async ({
  ids,
  apiKey,
}: {
  ids: string[];
  apiKey: string;
}) => {
  {
    const organizations: CkanResponse<Organization>[] = await Promise.all(
      ids.map(
        async (id) =>
          await CkanRequest.post(`organization_delete`, {
            apiKey,
            json: { id },
          })
      )
    );
    return {
      organizations: organizations.map((organization) => organization.result),
    };
  }
};

export const purgeOrganization = async ({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) => {
  const purgedOrganization: CkanResponse<Organization> = await CkanRequest.post(
    "organization_purge",
    {
      apiKey,
      json: { id },
    }
  );
  return purgedOrganization.result;
};

export const requestOrganizationOwner = async ({
  id,
  message,
  apiKey,
}: {
  id: string;
  message: string;
  apiKey: string;
}) => {
  const response: CkanResponse<String> = await CkanRequest.post(
    "request_organization_owner",
    {
      apiKey,
      json: { 
        id: id,
        message: message
      },
    }
  );
  return response;
};

export const requestNewOrganization = async ({
  orgName,
  orgDescription,
  datasetDescription,
  apiKey,
}: {
  orgName: string;
  orgDescription: string;
  datasetDescription: string;
  apiKey: string;
}) => {
  const response: CkanResponse<String> = await CkanRequest.post(
    "request_new_organization",
    {
      apiKey,
      json: { 
        org_name: orgName,
        org_description: orgDescription,
        dataset_description: datasetDescription,
      },
    }
  );
  return response;
};