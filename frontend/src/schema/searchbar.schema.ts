import z from "zod";

export const SearchbarSchema = z.object({
    query: z.string(),
    facetName: z.string(),
    facetValue:z.object({name:z.string(), value:z.string(), display_name:z.string()})
});

export type SearchbarFormType = z.infer<typeof SearchbarSchema>;