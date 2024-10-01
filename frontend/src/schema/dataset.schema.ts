import z from "zod";

export const ResourceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  package_id: z.string().optional(),
  format: z.string().optional(),
  size: z.number().optional(),
  type: z.enum(["file", "doc"]),
  url: z.string().url(),
});

export const DatasetSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .regex(
      /^[^\(\) +]+$/,
      "The name cant have spaces nor the dot(.) character, it needs to be URL Compatible"
    ),
  title: z.string(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()),
  userRepresents: z.boolean().default(false),
  sources: z.array(
    z.object({
      name: z.string(),
      url: z.string().url().optional(),
    })
  ),
  language: z.string().optional(),
  referencePeriodStart: z.date(),
  referencePeriodEnd: z.date(),
  countries: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  license: z.string().optional(),
  private: z.boolean().default(true),
  resources: z.array(ResourceSchema),
});
export const SearchDatasetSchema = z.object({
  advancedQueries: z
    .array(
      z.object({
        values: z.array(z.string()),
        key: z.string()
      })
    )
    .optional(),
  query: z.string().nullable().optional(),
  mode: z.string().optional(),
  service: z.string().optional(),
  sector: z.string().optional(),
  regions: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  fuel: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  groups: z.array(z.string()).optional(),
  orgs: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sort: z.string().optional(),
  facetsFields: z.string().nullable().optional(),
  includePrivate: z.boolean().optional(),
  showArchived: z.boolean().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
  publicationDates: z.array(z.string()).optional(),
  resFormat: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  private: z.boolean().optional(),
  includeDrafts: z.boolean().optional(),
});

export type SearchDatasetType = z.infer<typeof SearchDatasetSchema>;
export type DatasetFormType = z.infer<typeof DatasetSchema>;
export type ResourceFormType = z.infer<typeof ResourceSchema>;
