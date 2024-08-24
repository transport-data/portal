import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
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
} from "@utils/organization";
import { z } from "zod";

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(OrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const organization = await createOrganization({ apiKey, input });
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
    const organizations = await listUserOrganizations({
      id: user.id,
      apiKey,
    });
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
      const organization = await patchOrganization({ apiKey, input });
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
});
