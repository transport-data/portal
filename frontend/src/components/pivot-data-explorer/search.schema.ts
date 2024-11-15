import z from "zod";

export const filterObj = z.array(
z.object({
    column: z.string(),
    type: z.string(),
    values: z.array(z.string()),
  })
);

export const querySchema = z.object({
  filters: filterObj,
  column: z.string(),
  row: z.string(),
  value: z.string(),
  tableName: z.string(),
});

export type QueryFormType = z.infer<typeof querySchema>;
export type FilterObjType = z.infer<typeof filterObj>;
