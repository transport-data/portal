import { env } from "@env.mjs";
import { CkanResponse } from "@schema/ckan.schema";
import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { Account, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

export type CkanUserLoginWithGitHubParams = {
  account: Account;
  user: User | AdapterUser;
  invite_id?: string;
};

export const clearAllAuxAuthCookies = (context?: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const cookies = ["origin", "invite_id", "onboarding_completed"];
  cookies.forEach((c) => {
    if (context) {
      deleteCookie(c, context);
    } else {
      deleteCookie(c);
    }
  });
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

  const userLoginData: CkanResponse<
    (User & { frontend_token: string }) | { errors: { [k: string]: string[] } }
  > = await userLoginRes.json();

  const userLoginResult = userLoginData.result;

  return userLoginResult;
}
