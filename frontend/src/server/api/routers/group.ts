import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { GroupSchema } from "@schema/group.schema";
import {
  createGroup,
  deleteGroups,
  listGroups,
  patchGroup,
  getGroup,
  groupTree,
} from "@utils/group";
import { z } from "zod";

export const groupRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user;
      const apiKey = user?.apikey ?? '';
      const groups = await getGroup({ apiKey, id: input.id });
      return groups;
    }),
  list: publicProcedure
    .input(
      z.object({
        showGeographyShapes: z.boolean().optional(),
        type: z.enum(["topic", "geography"]).optional().default("topic"),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user;
      const apiKey = user?.apikey ?? '';
      const groups = await listGroups({
        apiKey,
        type: input.type,
        showCoordinates: input.showGeographyShapes,
      });
      return groups;
    }),
  tree: publicProcedure
    .input(
      z.object({
        type: z.enum(["topic", "geography"]).optional().default("topic"),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user;
      const apiKey = user?.apikey ?? '';
      const groups = await groupTree({
        apiKey,
        type: input.type,
      });
      return groups;
    }),
  create: protectedProcedure
    .input(GroupSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      if (input.parent === 'no-parent' || !input.parent) return await createGroup({ apiKey, input: { ...input, type: 'topic'}  });
      const _group = { ...input, type: "topic", groups: [{name: input.parent}] };
      const group = await createGroup({ apiKey, input: _group });
      return group;
    }),
  patch: protectedProcedure
    .input(GroupSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      if (input.parent === 'no-parent' || !input.parent) return await patchGroup({ apiKey, input });
      const _group = { ...input, groups: [{name: input.parent}] };
      const group = await patchGroup({ apiKey, input: _group });
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
