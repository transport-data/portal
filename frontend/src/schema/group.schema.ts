import z from "zod";
import type { Group as GroupDefault } from "@portaljs/ckan";

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

export const GroupSchema = z.object({
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
});

export type GroupFormType = z.infer<typeof GroupSchema>;
export type Group = GroupDefault & { groups: Array<{ id: string; name: string }> };
