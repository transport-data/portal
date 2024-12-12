import { api } from "@utils/api";
import { UserOrganization } from "@utils/organization";
import { useSession } from "next-auth/react";

export function useUserOrganizations() {
  const { data: orgsForUser } = api.organization.listForUser.useQuery();
  return orgsForUser ?? [];
}

export function useUserHasOrganizations() {
  const orgsForUser = useUserOrganizations();
  const hasOrganizations = orgsForUser?.length;
  return !!hasOrganizations;
}

export function useUserIsSysadmin() {
  const { data: sessionData } = useSession();
  const isSysAdmin = sessionData?.user?.sysadmin == true;
  return isSysAdmin;
}

export function useUserGlobalOrganizationRoles() {
  const isSysadmin = useUserIsSysadmin();
  const userOrgs = useUserOrganizations();

  const getOrgsForRole = (role: string) => {
    return userOrgs?.filter((o: UserOrganization) => o.capacity == role) ?? [];
  };

  const memberOrgs = getOrgsForRole("member");
  const editorOrgs = getOrgsForRole("editor");
  const adminOrgs = getOrgsForRole("admin");

  return {
    userOrgs,
    memberOrgs,
    editorOrgs,
    adminOrgs,
    canCreateDatasets:
      !!editorOrgs?.length || !!adminOrgs?.length || isSysadmin,
    canReviewDatasets: !!adminOrgs?.length || isSysadmin,
    belongsToAnyOrg: !!userOrgs.length,
  };
}
