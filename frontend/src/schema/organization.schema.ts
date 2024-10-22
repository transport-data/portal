import z from "zod";
import type { Organization as OrganizationDefault } from "@portaljs/ckan";

// TODO: implement the search schema
/*export const SearchOrganizationSchema = z.object({
  query: z.string().default(""),
  limit: z.number().default(10),
  offset: z.number().default(0),
  groups: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sort: z.string().optional(),
  include_private: z.boolean().optional()
});*/

const emptyStringToUndefined = z.literal('').transform(() => undefined)

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .regex(
      /^[^\(\) +]+$/,
      "The name cant have spaces nor the dot(.) character, it needs to be URL Compatible"
    ),
  title: z.string(),
  description: z.string().default(""),
  image_display_url: z.string().default(""),
  parent: z.string().optional(),
  image_url: z.string().default(""),
  email: z.string().email().optional().or(emptyStringToUndefined),
  url: z.string().url().optional().or(emptyStringToUndefined)
});

export type OrganizationFormType = z.infer<typeof OrganizationSchema>;
export type Organization = OrganizationDefault & { groups: Array<{ id: string; name: string }> };
