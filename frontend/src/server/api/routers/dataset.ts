import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { ListboxLabel } from "@headlessui/react";
import { DatasetSchema, SearchDatasetSchema } from "@schema/dataset.schema";
import {
  createDataset,
  deleteDatasets,
  getDataset,
  getDatasetSchema,
  licensesList,
  patchDataset,
  searchDatasets,
} from "@utils/dataset";
import { z } from "zod";

export const datasetRouter = createTRPCRouter({
  search: publicProcedure
    .input(SearchDatasetSchema)
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const apiKey = user?.apikey ?? '';
      const searchResults = await searchDatasets({ apiKey, options: input });
      return searchResults;
    }),
  get: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const dataset = await getDataset({ id: input.name, apiKey });
      return dataset;
    }),
  schema: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const schema = await getDatasetSchema({ apiKey });
    return schema;
  }),
  create: protectedProcedure
    .input(DatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const _dataset = {
        ...input,
        related_datasets: input.related_datasets.map((d) => d.name),
        temporal_coverage_start: input.temporal_coverage_start.toISOString().split('T')[0] ?? '',
        temporal_coverage_end: input.temporal_coverage_end.toISOString().split('T')[0] ?? '',
      };
      const dataset = await createDataset({ apiKey, input: _dataset });
      return dataset;
    }),
  patch: protectedProcedure
    .input(DatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const _dataset = {
        ...input,
        related_datasets: input.related_datasets.map((d) => d.name),
        temporal_coverage_start: input.temporal_coverage_start.toISOString().split('T')[0] ?? '',
        temporal_coverage_end: input.temporal_coverage_end.toISOString().split('T')[0] ?? '',
      };
      const dataset = await patchDataset({ apiKey, input: _dataset });
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
  listLicenses: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const licenses = await licensesList({ apiKey });
    return licenses;
  }),
});
