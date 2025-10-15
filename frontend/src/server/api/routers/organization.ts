import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@env.mjs";
import { revalidatePath } from "@lib/utils";
import { OrganizationSchema } from "@schema/organization.schema";
import { MemberEditSchema } from "@schema/user.schema";
import {
  createOrganization,
  listOrganizations,
  getOrganization,
  listUserOrganizations,
  patchOrganizationMemberRole,
  patchOrganization,
  deleteOrganizations,
  removeOrganizationMembers,
  followOrganization,
} from "@utils/organization";
import { z } from "zod";

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(OrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      if (input.parent === "no-parent" || !input.parent)
        return await createOrganization({ apiKey, input });
      const _organization = { ...input, groups: [{ name: input.parent }] };
      const organization = await createOrganization({
        apiKey,
        input: _organization,
      });
      return organization;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const organizations = await listOrganizations({
      apiKey,
      input: { detailed: true },
    });
    return organizations;
  }),
  listForUser: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    let organizations = await listUserOrganizations({
      id: user.name ?? user.id,
      apiKey,
    });

    if (organizations.length === 0 && user.name) {
      organizations = await listUserOrganizations({
        id: user.id,
        apiKey,
      });
    }

    return organizations;
  }),
  get: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        includeUsers: z.boolean().default(false).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const organization = await getOrganization({
        input: { id: input.name, includeUsers: input.includeUsers },
        apiKey,
      });
      return organization;
    }),
  patch: protectedProcedure
    .input(OrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      if (input.parent === "no-parent" || !input.parent) {
          const result = await patchOrganization({ apiKey, input });
          await revalidatePath(`/@${result.name}`);
          return result
      }

      const _organization = { ...input, groups: [{ name: input.parent }] };
      const organization = await patchOrganization({
        apiKey,
        input: _organization,
      });

      await revalidatePath(`/@${organization.name.toLowerCase()}`);
      return organization;
    }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const organization = await deleteOrganizations({
        apiKey,
        ids: input.ids,
      });
      return organization;
    }),
  patchMemberRole: protectedProcedure
    .input(MemberEditSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      await patchOrganizationMemberRole({
        input,
        apiKey,
      });
    }),
  removeMembers: protectedProcedure
    .input(z.object({ usernames: z.array(z.string()), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const members = removeOrganizationMembers({ input, apiKey });
      return members;
    }),

  follow: protectedProcedure
    .input(z.object({ dataset: z.string(), isFollowing: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const res = await followOrganization({
        apiKey,
        isFollowing: input.isFollowing,
        id: input.dataset,
      });

      return res;
    }),
});
