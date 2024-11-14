import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import CkanRequest, { CkanRequestError } from "@datopian/ckan-api-client-js";
import { env } from "@env.mjs";
import { ApprovalStatus } from "@interfaces/ckan/dataset.interface";
import { type User } from "@interfaces/ckan/user.interface";
import { type Activity } from "@portaljs/ckan";
import { type CkanResponse } from "@schema/ckan.schema";
import { OnboardingSchema } from "@schema/onboarding.schema";
import {
  CKANUserSchema,
  SearchNewsfeedActivitySchema,
  UserInviteSchema,
  UserSchema,
} from "@schema/user.schema";
import { getDatasetFollowersList } from "@utils/dataset";

import { followGroups, getGroupFollowersList } from "@utils/group";
import {
  addOrganizationMember,
  getOrgFollowersList,
  requestNewOrganization,
  requestOrganizationOwner,
} from "@utils/organization";
import {
  createApiToken,
  createUser,
  deleteUsers,
  generateUserApiKey,
  getApiTokens,
  getUserFollowee,
  getUsersById,
  inviteUser,
  listUsers,
  patchUser,
  revokeApiToken,
} from "@utils/user";
import { z } from "zod";

// TODO: extract business logic to utils/user.ts

export const userRouter = createTRPCRouter({
  resetUser: publicProcedure.input(z.any()).mutation(async ({ input }) => {
    try {
      const user = await CkanRequest.post<CkanResponse<User>>(`user_update`, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        json: {
          ...input,
        },
      });
      const userUpdateState = await CkanRequest.post<CkanResponse<User>>(
        `user_update`,
        {
          apiKey: env.SYS_ADMIN_API_KEY,
          json: {
            ...user.result,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            email: input.email,
            state: "active",
          },
        },
      );
      return userUpdateState;
    } catch (e) {
      console.log(e);
      throw new Error(
        "Could not reset user, please contact the system administrator",
      );
    }
  }),
  inviteUser: protectedProcedure
    .input(UserInviteSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;

      if (!input.existingUser) {
        const newUser = await CkanRequest.post<CkanResponse<User>>(
          `github_user_invite`,
          {
            apiKey: user.apikey,
            json: {
              group_id: input.group_id,
              role: input.role,
              email: input.user,
            },
          },
        );
        if (!newUser.success && newUser.error) {
          if (newUser.error.message) throw Error(newUser.error.message);
          console.log(newUser.error);
          throw Error(
            Object.entries(newUser.error)
              .filter(([k, v]) => k !== "__type")
              .map(([k, v]) => `${k}: ${v}`)
              .join(", "),
          );
        }

        // TODO: is this needed? It's throwing errors. Action doesn't exist.
        // const userApiToken: string = await CkanRequest.post(
        //   `user_generate_apikey`,
        //   {
        //     apiKey: env.SYS_ADMIN_API_KEY,
        //     json: { id: newUser.result.id },
        //   }
        // );
        // if (!userApiToken)
        //   throw new Error("Could not generate api token for user");

        return newUser.result;
      } else if (input.existingUser) {
        const newUser = await addOrganizationMember({
          input: {
            id: input.group_id,
            role: input.role,
            username: input.user,
          },
          apiKey,
        });

        return newUser;
      }
    }),
  createUser: publicProcedure.input(UserSchema).mutation(async ({ input }) => {
    let user: User | null = null,
      userApiKey: User | null = null;
    try {
      user = await createUser({
        user: input,
        apiKey: env.SYS_ADMIN_API_KEY,
      });

      userApiKey = await generateUserApiKey({
        id: input.name,
        apiKey: env.SYS_ADMIN_API_KEY,
      });

      return {
        success: true,
        user: user,
      };
    } catch (error) {
      if (error instanceof CkanRequestError) {
        throw error;
      }
      throw new Error(
        "Could not create user, please contact the system administrator",
      );
    }
  }),
  getUsersByIds: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      // NOTE: user_list cannot be used here because it only
      // finds users by name
      const users = await getUsersById({ ids: input.ids, apiKey });
      return users;
    }),
  listDashboardActivities: protectedProcedure
    .input(SearchNewsfeedActivitySchema)
    .query(
      async ({
        ctx,
        input: { query, limit, offset, action, activityType, sort },
      }) => {
        action = !action || action === "All" ? "" : action;
        action =
          action === "updated"
            ? "changed"
            : action === "created"
              ? "new"
              : action === "requested"
                ? "pending"
                : action;
        activityType = activityType ?? "";
        query = query ?? "";
        limit = limit ?? 10;
        offset = offset ?? 0;
        sort = sort ?? "latest";
        return (
          await CkanRequest.get<
            CkanResponse<{
              count: number;
              results: Array<
                Activity & {
                  data?: {
                    package?: {
                      title?: string;
                      approval_status: ApprovalStatus;
                    };
                  };
                }
              >;
            }>
          >(
            `tdc_dashboard_activity_list?limit=${limit}&offset=${offset}&query=${query}&action=${action}&status=${activityType}&${
              sort === "oldest"
                ? `after=${new Date(1600, 1, 1).getTime() / 1000}`
                : ""
            }`,
            {
              apiKey: ctx.session.user.apikey,
            },
          )
        ).result;
      },
    ),
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const users = await listUsers({ apiKey });
    return users;
  }),
  patch: protectedProcedure
    .input(CKANUserSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const updatedUser = await patchUser({ user: input, apiKey });
      return updatedUser;
    }),
  removeSysadminUsers: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const response = input.ids.map(async (id) => {
        const user = await patchUser({
          user: { id: id, sysadmin: false },
          apiKey,
        });
        return user;
      });
      return response;
    }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const users = await deleteUsers({ apiKey, ids: input.ids });
      return users;
    }),
  onboard: protectedProcedure
    .input(OnboardingSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;

      if (input.onBoardingStep === 0 && input.followingGroups) {
        await followGroups({
          apiKey: apiKey,
          followedGroups: input.followingGroups,
        });
      } else if (input.onBoardingStep === 1) {
        if (
          input.isNewOrganizationSelected &&
          input.newOrganizationName &&
          input.newOrganizationDescription &&
          input.newOrganizationDataDescription
        ) {
          await requestNewOrganization({
            apiKey: apiKey,
            orgName: input.newOrganizationName,
            orgDescription: input.newOrganizationDescription,
            datasetDescription: input.newOrganizationDataDescription,
          });
        } else if (
          !input.isNewOrganizationSelected &&
          input.orgInWhichItParticipates?.id &&
          input.messageToParticipateOfTheOrg
        ) {
          await requestOrganizationOwner({
            apiKey: apiKey,
            id: input.orgInWhichItParticipates?.id,
            message: input.messageToParticipateOfTheOrg,
          });
        }
      } else if (
        input.onBoardingStep === 2 &&
        input.newUsersEmailsToInvite &&
        input.messageToInviteNewUsers
      ) {
        await inviteUser({
          apiKey: apiKey,
          emails: input.newUsersEmailsToInvite,
          message: input.messageToInviteNewUsers,
        });
      }
    }),
  getFollowee: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const followee = await getUserFollowee({ id: user.id, apiKey });
    return followee;
  }),
  listApiTokens: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const user_id = user.id;
    const apiKey = user.apikey;
    const tokens = await getApiTokens({ user_id, apiKey });
    return tokens.result;
  }),
  createApiToken: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const result = await createApiToken({
        user_id: user.id,
        name: input.name,
        apiKey,
      });
      return result;
    }),
  revokeApiToken: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const apiKey = ctx.session.user.apikey;
      const result = await revokeApiToken({
        id: input.id,
        apiKey,
      });
      return result;
    }),
  isFollowingDataset: protectedProcedure
    .input(z.object({ dataset: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = env.SYS_ADMIN_API_KEY;
      const list = await getDatasetFollowersList({ apiKey, id: input.dataset });

      return list?.some((follower) => follower.id === user?.id);
    }),

  isFollowingOrganization: protectedProcedure
    .input(z.object({ org: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = env.SYS_ADMIN_API_KEY;
      const list = await getOrgFollowersList({ apiKey, id: input.org });

      return list?.some((follower) => follower.id === user?.id);
    }),

  isFollowingGeographies: protectedProcedure
    .input(z.array(z.string()))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = env.SYS_ADMIN_API_KEY;
      const data = await CkanRequest.post<CkanResponse<string[]>>(
        `user_following_groups`,
        {
          apiKey: apiKey,
          json: {
            user_id: user.id,
            group_list: input,
          },
        },
      );
      return data.result;
    }),
  setOnboardingCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;
    const id = user.id;
    return patchUser({
      apiKey: env.SYS_ADMIN_API_KEY,
      user: {
        id,
        plugin_extras: {
          onboarding_completed: true,
        },
      },
    });
  }),
});
