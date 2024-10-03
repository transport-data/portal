import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { listTags } from "@utils/tag";
import z from "zod";

export const tagsRouter = createTRPCRouter({
  list: publicProcedure
    .query(async ({ ctx }) => {
      const user = ctx.session?.user ?? null;
      const apiKey = user?.apikey ?? '';
      const tags = await listTags({ apiKey });
      return tags;
    }),
});
