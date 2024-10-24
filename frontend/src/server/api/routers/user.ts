import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import CkanRequest, { CkanRequestError } from "@datopian/ckan-api-client-js";
import { env } from "@env.mjs";
import { ApprovalStatus } from "@interfaces/ckan/dataset.interface";
import { type User } from "@interfaces/ckan/user.interface";
import { type Activity, type Dataset } from "@portaljs/ckan";
import { type CkanResponse } from "@schema/ckan.schema";
import { OnboardingSchema } from "@schema/onboarding.schema";
import {
  CKANUserSchema,
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
  createUser,
  deleteUsers,
  generateUserApiKey,
  getUserFollowee,
  getUsersById,
  inviteUser,
  listUsers,
  patchUser,
  getApiTokens,
  createApiToken,
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
        }
      );
      return userUpdateState;
    } catch (e) {
      console.log(e);
      throw new Error(
        "Could not reset user, please contact the system administrator"
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
          `user_invite`,
          {
            apiKey: user.apikey,
            json: {
              group_id: input.group_id,
              role: input.role,
              email: input.user,
            },
          }
        );
        if (!newUser.success && newUser.error) {
          if (newUser.error.message) throw Error(newUser.error.message);
          console.log(newUser.error);
          throw Error(
            Object.entries(newUser.error)
              .filter(([k, v]) => k !== "__type")
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")
          );
        }

        const userApiToken: string = await CkanRequest.post(
          `user_generate_apikey`,
          {
            apiKey: env.SYS_ADMIN_API_KEY,
            json: { id: newUser.result.id },
          }
        );
        if (!userApiToken)
          throw new Error("Could not generate api token for user");

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
        "Could not create user, please contact the system administrator"
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
    .input(
      z.object({ limit: z.number().default(10), offset: z.number().default(0) })
    )
    .query(async ({ ctx }) => {
      const activities = await CkanRequest.get<
        CkanResponse<{
          count: number;
          results: Array<
            Activity & {
              data?: {
                package?: { title?: string; approval_status: ApprovalStatus };
              };
            }
          >;
        }>
      >(`tdc_dashboard_activity_list`, {
        apiKey: ctx.session.user.apikey,
      });

      activities.result = await Promise.all(
        activities.result.map(async (a) => {
          if (
            a.activity_type === "new package" ||
            a.activity_type === "changed package"
          ) {
            const dataset = await CkanRequest.get<CkanResponse<Dataset>>(
              `package_show?id=${a.object_id}`,
              {
                apiKey: ctx.session.user.apikey,
              }
            );
            return { ...a, packageData: dataset.result };
          }
          return a;
        })
      );

      return activities.result;
    }),
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
      })
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
      })
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
      const list = await getGroupFollowersList({ apiKey, groups: input });
      return list.map((g) => ({
        id: g.id,
        following: g.followers?.some((follower) => follower.id === user?.id),
      }));
    }),
});
