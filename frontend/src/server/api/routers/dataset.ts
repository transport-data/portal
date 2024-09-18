import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { DatasetSchema, SearchDatasetsSchema } from "@schema/dataset.schema";
import {
  createDataset,
  deleteDatasets,
  getDataset,
  patchDataset,
  searchDatasets,
} from "@utils/dataset";
import { z } from "zod";

export const datasetRouter = createTRPCRouter({
  search: protectedProcedure
    .input(SearchDatasetsSchema)
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const searchResults = await searchDatasets({ apiKey, options: input });
      return searchResults;
    }),
  get: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const dataset = await getDataset({ id: input.name, apiKey });
      return dataset.result;
    }),
  create: protectedProcedure
    .input(DatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const dataset = await createDataset({ apiKey, input });
      return dataset;
    }),
  patch: protectedProcedure
    .input(DatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const dataset = await patchDataset({ apiKey, input });
      return dataset;
    }),
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const datasets = await deleteDatasets({ apiKey, ids: input.ids });
      return datasets;
    }),
});
