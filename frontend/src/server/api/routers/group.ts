import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { GroupSchema } from "@schema/group.schema";
import {
  createGroup,
  deleteGroups,
  listGroups,
  patchGroup,
  getGroup,
} from "@utils/group";
import { z } from "zod";

export const groupRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const groups = await getGroup({ apiKey, id: input.id });
      return groups;
    }),
  list: protectedProcedure.query(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const groups = await listGroups({ apiKey });
    return groups;
  }),
  create: protectedProcedure
    .input(GroupSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const _group = { ...input, type: "topic" };
      const group = await createGroup({ apiKey, input: _group });
      return group;
    }),
  patch: protectedProcedure
    .input(GroupSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const group = await patchGroup({ apiKey, input });
      return group;
    }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const groups = await deleteGroups({ apiKey, ids: input.ids });
      return groups;
    }),
});
