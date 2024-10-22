import z from "zod";
const emptyStringToUndefined = z.literal('').transform(() => undefined)

export const ResourceSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  package_id: z.string().optional(),
  url_type: z.string(),
  format: z.string().optional(),
  size: z.number().optional(),
  resource_type: z.enum(["data", "documentation"]),
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
  owner_org: z.string({ description: "Organization is required" }),
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
  introduction_text: z.string().optional().nullable(),
  modes: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  sectors: z.array(z.string()).default([]),
  temporal_coverage_start: z.date(),
  temporal_coverage_end: z.date(),
  geographies: z.array(z.string()).default([]),
  license_id: z.string().optional(),
  private: z.boolean().default(true),
  indicators: z.array(z.string()).default([]),
  units: z.array(z.string()).default([]),
  dimensioning: z.string().optional().or(emptyStringToUndefined),
  url: z.string().url().optional().or(emptyStringToUndefined),
  data_provider: z.string().optional().or(emptyStringToUndefined),
  data_access: z.string().optional().or(emptyStringToUndefined),
  state:z.string().optional().default(""),
  related_datasets: z.array(z.object({
    name: z.string(),
    title: z.string()
  })),
  resources: z.array(ResourceSchema),
});

export const DraftDatasetSchema = DatasetSchema.partial().extend({
  name:z.string(),
  notes:z.string(),
  owner_org:z.string(),
  tdc_category:z.string().default("public")
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
  modes: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  sectors: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  fuel: z.string().optional(),
  tdc_category: z.string().optional(),
  data_provider: z.string().optional(),
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
  contributors: z.array( z.string() ).optional()
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
export type DatasetDraftType = z.infer<typeof DraftDatasetSchema>;
export type ResourceFormType = z.infer<typeof ResourceSchema>;
