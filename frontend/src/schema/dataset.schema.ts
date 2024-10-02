import z from "zod";
const emptyStringToUndefined = z.literal('').transform(() => undefined)

export const SearchDatasetSchema = z.object({
  query: z.string().default("").optional(),
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
  notes: z.string().min(1, { message: "Description is required" }),
  overview_text: z.string().optional().nullable(),
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
  comments: z.array(
    z.object({
      initials: z.string(),
      comment: z.string(),
      date: z.date().default(() => new Date()),
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
  geographies: z.array(z.string()).default([]),
  license_id: z.string().optional(),
  private: z.boolean().default(true),
  indicators: z.array(z.string()).default([]),
  dimensioning: z.string(),
  units: z.array(z.string()).default([]),
  url: z.string().url().optional().or(emptyStringToUndefined),
  data_provider: z.string().optional().or(emptyStringToUndefined),
  data_access: z.string().optional().or(emptyStringToUndefined),
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
