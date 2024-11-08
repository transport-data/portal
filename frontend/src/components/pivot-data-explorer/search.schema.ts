import z from "zod";

export const filterObj = z.array(
z.object({
    column: z.string(),
    type: z.string(),
    values: z.array(z.string()),
  })
);

export const filterSchema = z.object({
  filters: z.array(filterObj),
});

const sortSchema = z.object({
  column: z.string(),
  direction: z.enum(["asc", "desc"]),
});

const paginationSchema = z.object({
  limit: z.number(),
  offset: z.number(),
});

export const querySchema = z.object({
  filters: filterObj,
  column: z.string(),
  row: z.string(),
  value: z.string(),
  tableName: z.string(),
});

export type QueryFormType = z.infer<typeof querySchema>;
export type PaginationType = z.infer<typeof paginationSchema>;
export type FilterFormType = z.infer<typeof filterSchema>;
export type FilterObjType = z.infer<typeof filterObj>;
