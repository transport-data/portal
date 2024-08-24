import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ResourceSchema } from "@schema/dataset.schema";
import {
  createResource,
  deleteResources,
  getPreSignedUrl,
  updateResource,
} from "@utils/resource";
import z from "zod";

export const resourceRouter = createTRPCRouter({
  getPreSignedUrl: protectedProcedure
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      return getPreSignedUrl({ input });
    }),
  create: protectedProcedure
    .input(ResourceSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const resource = await createResource({ apiKey, input });
      return resource;
    }),
  update: protectedProcedure
    .input(ResourceSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const resource = await updateResource({ apiKey, input });
      return resource;
    }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const resources = await deleteResources({ apiKey, ids: input.ids });
      return resources;
    }),
});
