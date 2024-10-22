import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  DatasetSchema,
  DraftDatasetSchema,
  SearchDatasetSchema,
} from "@schema/dataset.schema";

import {
  approveDataset,
  createDataset,
  deleteDatasets,
  draftDataset,
  followDataset,
  getDataset,
  getDatasetActivities,
  getDatasetSchema,
  getDatasetFollowersList,
  licensesList,
  patchDataset,
  rejectDataset,
  searchDatasets,
} from "@utils/dataset";
import { z } from "zod";

export const datasetRouter = createTRPCRouter({
  search: publicProcedure
    .input(SearchDatasetSchema)
    .query(async ({ input, ctx }) => {
      const user = ctx?.session?.user;
      const apiKey = user?.apikey;
      const searchResults = await searchDatasets({ apiKey, options: input });
      return searchResults;
    }),
  approve: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: datasetId, ctx }) => {
      const user = ctx?.session?.user;
      const apiKey = user?.apikey;
      const searchResults = await approveDataset({ apiKey, datasetId });
      return searchResults;
    }),

  reject: protectedProcedure
    .input(z.object({ datasetId: z.string(), reason: z.string() }))
    .mutation(async ({ input: { datasetId, reason }, ctx }) => {
      const user = ctx?.session?.user;
      const apiKey = user?.apikey;
      const searchResults = await rejectDataset({ apiKey, datasetId, reason });
      return searchResults;
    }),
  get: publicProcedure
    .input(
      z.object({ name: z.string(), includeExtras: z.boolean().optional() }),
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user ?? null;
      const apiKey = user?.apikey ?? "";
      const dataset = await getDataset({
        id: input.name,
        apiKey,
        include_extras: !!input?.includeExtras,
      });
      return dataset;
    }),
  activities: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user ?? null;
      const apiKey = user?.apikey ?? "";
      const activities = await getDatasetActivities({ id: input.name, apiKey });
      return activities;
    }),
  schema: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user ?? null;
    const apiKey = user?.apikey ?? "";
    const schema = await getDatasetSchema({ apiKey });
    return schema;
  }),
  create: protectedProcedure
    .input(DatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      //convert the date to string# YYYY-MM-DD
      const _dataset = {
        ...input,
        related_datasets: input.related_datasets.map((d) => d.name),
        temporal_coverage_start:
          input.temporal_coverage_start.toISOString().split("T")[0] ?? "",
        temporal_coverage_end:
          input.temporal_coverage_end.toISOString().split("T")[0] ?? "",
      };
      const dataset = await createDataset({ apiKey, input: _dataset });
      return dataset;
    }),
  draft: protectedProcedure
    .input(DraftDatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const dataset = await draftDataset({ apiKey, input });
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
        temporal_coverage_start:
          input.temporal_coverage_start.toISOString().split("T")[0] ?? "",
        temporal_coverage_end:
          input.temporal_coverage_end.toISOString().split("T")[0] ?? "",
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

  followersList: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const list = await getDatasetFollowersList({ apiKey, id: input.id });
      return list;
    }),

  follow: protectedProcedure
  .input(z.object({ dataset: z.string(), isFollowing:z.boolean() }))
  .mutation(async ({ input, ctx }) => {
    const user = ctx.session.user;
    const apiKey = user.apikey;
    const res = await followDataset({ 
      apiKey, 
      isFollowing: input.isFollowing,
      id: input.dataset 
    });

    return res;
  }),
});
