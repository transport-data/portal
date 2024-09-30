import z from "zod";
const emptyStringToUndefined = z.literal('').transform(() => undefined)

export const SearchDatasetSchema = z.object({
  query: z.string().default(""),
  limit: z.number().default(1000),
  offset: z.number().default(0),
  groups: z.array(z.string()).default([]).optional(),
  orgs: z.array(z.string()).default([]).optional(),
  tags: z.array(z.string()).default([]).optional(),
  sort: z.string().optional(),
  include_private: z.boolean().optional(),
  include_drafts: z.boolean().optional(),
});

export const ResourceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  package_id: z.string().optional(),
  url_type: z.string(),
  format: z.string().optional(),
  size: z.number().optional(),
  type: z.enum(["data", "documentation"]),
  resource_type: z.string().optional().nullable(),
  url: z.string().url(),
});

export const DatasetSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .regex(
      /^[^\(\) +]+$/,
      "The name cant have spaces nor the dot(.) character, it needs to be URL Compatible"
    ),
  title: z.string(),
  notes: z.string().optional().nullable(),
  overview: z.string().optional().nullable(),
  owner_org: z.string({ message: "Organization is required" }),
  topics: z.array(z.string()).default([]),
  is_archived: z.boolean().default(false),
  tags: z.array(z.object({
    name: z.string()
  })),
  userRepresents: z.boolean().default(false),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url().optional().or(emptyStringToUndefined),
    })
  ),
  language: z.string().optional(),
  frequency: z.string().optional(),
  tdc_category: z.string(),
  modes: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  sectors: z.array(z.string()).default([]),
  temporal_coverage_start: z.date(),
  temporal_coverage_end: z.date(),
  countries: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  license: z.string().optional(),
  private: z.boolean().default(false),
  indicator: z.string(),
  dimensioning: z.string(),
  units: z.array(z.string()).default([]),
  related_datasets: z.array(z.object({
    name: z.string(),
    title: z.string()
  })),
  resources: z.array(ResourceSchema),
});

export type DatasetSchemaType = {
  dataset_type: string;
  about_url: string;
  dataset_fields: DatasetField[];
};

export type DatasetField = {
  form_snippet: string;
  display_snippet: string;
  validators: string;
  field_name: string;
  label: string;
  preset: string;
  required: boolean;
  default: string;
  choices?: Array<{ label: string; value: string }>;
};

export type License = {
  domain_content: string
  id: string
  domain_data: string
  domain_software: string
  family: string
  is_generic: string
  od_conformance: string
  osd_conformance: string
  maintainer: string
  status: string
  url: string
  title: string
};

export type SearchDatasetType = z.infer<typeof SearchDatasetSchema>;
export type DatasetFormType = z.infer<typeof DatasetSchema>;
export type ResourceFormType = z.infer<typeof ResourceSchema>;
