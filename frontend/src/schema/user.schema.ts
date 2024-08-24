import z from "zod";

export const CKANUserSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .regex(
      /^[a-z0-9_-]+$/,
      "Please, use only letters (a-z), numbers, hyphens (-) and underscores (_)."
    ),
  email: z.string().email(),
  fullname: z.string().optional().default(""),
  about: z.string().optional(),
});

export type CKANUserFormType = z.infer<typeof CKANUserSchema>;

export const UserSchema = z
  .object({
    name: z
      .string()
      .regex(
        /^[a-z0-9_-]+$/,
        "Please, use only letters (a-z), numbers, hyphens (-) and underscores (_)."
      ),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    fullname: z.string().optional(),
    organizationTitle: z
      .string()
      .min(1, { message: "Title must be at least 1 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type UserFormType = z.infer<typeof UserSchema>;

export const UserResetSchema = z
  .object({
    name: z
      .string()
      .regex(
        /^[a-z0-9_-]+$/,
        "Please, use only letters (a-z), numbers, hyphens (-) and underscores (_)."
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string().email(),
    confirmPassword: z.string(),
    reset_key: z.string(),
    id: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type UserResetFormType = z.infer<typeof UserResetSchema>;

export const UserInviteSchema = z
  .object({
    email: z.string().email().or(z.literal("")),
    name: z.string(),
    role: z.enum(["admin", "editor", "member"]),
    group_id: z.string(), //  ... or orgId,
  })
  .partial({ email: true, name: true })
  .refine(
    (data) => !!data.email || !!data.name,
    "You must either choose the name of a preexisting user OR the email of a new user."
  );

export type UserInviteFormType = z.infer<typeof UserInviteSchema>;

export const MemberEditSchema = z.object({
  username: z.string(),
  role: z.enum(["admin", "editor", "member"]),
  id: z.string(), //  ... or orgId,
});

export type MemberEditFormType = z.infer<typeof MemberEditSchema>;
