import z from "zod";

export const SearchDatasetSchema = z.object({
  query: z.string().default(""),
  limit: z.number().default(1000),
  offset: z.number().default(0),
  groups: z.array(z.string()).default([]),
  orgs: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sort: z.string().optional(),
  include_private: z.boolean().optional(),
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
  private: z.boolean().default(true),
  groupsId: z.array(z.string()).optional(),
  author: z.string().optional(),
  author_email: z.string().optional(),
  language: z.string().optional(),
  coverage: z.string().optional(),
  rights: z.string().optional(),
  conforms_to: z.string().optional(),
  has_version: z.string().optional(),
  is_version_of: z.string().optional(),
  contact_point: z.string().optional(),
  owner_org: z.string().optional(),
});

export const DcatSchema = z.object({
  language: z.string().optional(),
  coverage: z.string().optional(),
  rights: z.string().optional(),
  conforms_to: z.string().optional(),
  has_version: z.string().optional(),
  is_version_of: z.string().optional(),
  contact_point: z.string().optional(),
});

export const ResourceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  package_id: z.string(),
  url: z.string().url(),
});

export type SearchDatasetType = z.infer<typeof SearchDatasetSchema>;
export type DatasetFormType = z.infer<typeof DatasetSchema>;
export type ResourceFormType = z.infer<typeof ResourceSchema>;
