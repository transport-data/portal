import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import CkanRequest, { CkanRequestError } from "@datopian/ckan-api-client-js";
import { env } from "@env.mjs";
import { type User } from "@interfaces/ckan/user.interface";
import { type Activity, type Dataset } from "@portaljs/ckan";
import { type CkanResponse } from "@schema/ckan.schema";
import {
  CKANUserSchema,
  UserInviteSchema,
  UserSchema,
} from "@schema/user.schema";
import { OnboardingSchema } from "@schema/onboarding.schema";
import {
  addOrganizationMember,
  requestOrganizationOwner,
  requestNewOrganization,
} from "@utils/organization";
import {
  createUser,
  deleteUsers,
  generateUserApiKey,
  getUsersById,
  listUsers,
  patchUser,
  inviteUser,
} from "@utils/user";
import { followGroups } from "@utils/group";
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
              groupd_id: input.group_id,
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
  listDashboardActivities: protectedProcedure.query(async ({ ctx }) => {
    const activities = await CkanRequest.get<CkanResponse<Activity[]>>(
      `dashboard_activity_list`,
      {
        apiKey: ctx.session.user.apikey,
      }
    );

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
      // if interests tab is not skipped.
      if (input.isInterestSubmitted && input.followingGroups) {
        await followGroups({
          apiKey: apiKey,
          ids: input.followingGroups,
        });
      }
      // if organization selection tab is not skipped
      if (input.isOrganizationSubmitted) {
        // if request new organization is selected.
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
      }
      if (input.newUsersEmailsToInvite && input.messageToInviteNewUsers) {
        await inviteUser({
          apiKey: apiKey,
          emails: input.newUsersEmailsToInvite,
          message: input.messageToInviteNewUsers,
        });
      }
    }),
});
