import { env } from "@env.mjs";
import { CkanResponse } from "@schema/ckan.schema";
import { Account, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

export type CkanUserLoginWithGitHubParams = {
  account: Account;
  user: User | AdapterUser;
  invite_id?: string;
};

export async function ckanUserLoginWithGithub({
  account,
  user,
  invite_id,
}: CkanUserLoginWithGitHubParams) {
  const access_token = account.access_token;

  const body: any = {
    from_github: true,
    email: user?.email,
    name: user?.name,
    token: access_token,
    client_secret: env.FRONTEND_AUTH_SECRET,
  };

  if (invite_id) {
    body["invite_id"] = invite_id;
  }

  const userLoginRes = await fetch(
    `${env.NEXT_PUBLIC_CKAN_URL}/api/3/action/user_login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const userLoginData: CkanResponse<User & { frontend_token: string }> =
    await userLoginRes.json();

  let userLoginResult: any;
  if (typeof userLoginData?.result == "string") {
    userLoginResult = JSON.parse(userLoginData.result as any);
  } else {
    userLoginResult = userLoginData.result;
  }

  return userLoginResult;
}
