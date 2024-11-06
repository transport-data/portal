import { env } from "@env.mjs";
import { CkanResponse } from "@schema/ckan.schema";
import NextAuth, { User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import CkanRequest from "@datopian/ckan-api-client-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, _req) {
          if (!credentials) return null;
          const user = await CkanRequest.post<CkanResponse<User>>(
            "user_login",
            {
              json: {
                id: credentials.username,
                password: credentials.password,
                client_secret: env.FRONTEND_AUTH_SECRET,
              },
            },
          );

          if (user.result.id) {
            return {
              ...user.result,
              image: "",
              apikey: user.result.frontend_token,
              sysadmin: user.result.sysadmin,
            };
          } else {
            return Promise.reject(
              "/auth/signin?error=Could%20not%20login%20user%20please%20check%20your%20password%20and%20username",
            );
          }
        },
      }),
      GithubProvider({
        clientId: env.GITHUB_CLIENT_ID || "",
        clientSecret: env.GITHUB_CLIENT_SECRET || "",
      }),
    ],
    secret: env.NEXTAUTH_SECRET,
    // Optional callbacks for customization
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        return true; // Allows the sign-in
      },
      session: ({ session, token }) => {
        return {
          ...session,
          user: {
            ...session.user,
            apikey: token.apikey ? token.apikey : "",
            id: token.sub,
            sysadmin: token.sysadmin,
          },
        };
      },
      async jwt({ token, user, account }) {
        if (user) {
          token.apikey = user.apikey;
          // token.teams = user.teams
          token.sysadmin = user.sysadmin;
        }
        if (account?.provider === "github" && account.access_token) {
          const access_token = account.access_token;

          if (account && account.access_token) {
            const body: any = {
              from_github: true,
              email: user?.email,
              name: user?.name,
              token: access_token,
              client_secret: env.FRONTEND_AUTH_SECRET,
            };

            if (req?.cookies?.invite_id) {
              body["invite_id"] = req.cookies.invite_id;
            }

            const userRes = await fetch(
              `${env.NEXT_PUBLIC_CKAN_URL}/api/3/action/user_login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              },
            );

            const userLoginResponse: CkanResponse<
              User & { frontend_token: string }
            > = await userRes.json();

            let userLoginResult: any;
            if (typeof userLoginResponse?.result == "string") {
              userLoginResult = JSON.parse(userLoginResponse.result as any);
            } else {
              userLoginResult = userLoginResponse.result;
            }

            if (userLoginResult.errors) {
              // TODO: improve error handling
              return { errors: userLoginResult.errors };
            }

            user = {
              ...user,
              ...userLoginResult,
              image: user?.image ?? userLoginResult?.image ?? "",
              apikey: userLoginResult.frontend_token,
              sysadmin: userLoginResult.sysadmin,
            };

            return { ...token, ...user, sub: userLoginResult.id };
          }
        }

        return token;
      },
    },
  });
}
