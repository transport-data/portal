import z from "zod";

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

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .regex(
      /^[^\(\) +]+$/,
      "The name cant have spaces nor the dot(.) character, it needs to be URL Compatible"
    ),
  title: z.string(),
  description: z.string().optional().nullable(),
});

export type OrganizationFormType = z.infer<typeof OrganizationSchema>;
