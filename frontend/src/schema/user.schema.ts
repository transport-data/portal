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
  sysadmin: z.boolean().optional().default(false),
});

export type CKANUserFormType = z.infer<typeof CKANUserSchema>;

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z
    .string()
    .regex(/^[a-zA-ZÀ-ÿ'-]+(?: [a-zA-ZÀ-ÿ'-]+)*$/, "Invalid name"),
  lastName: z
    .string()
    .regex(/^[a-zA-ZÀ-ÿ'-]+(?: [a-zA-ZÀ-ÿ'-]+)*$/, "Invalid last name"),
  hasAcceptedTerms: z.boolean().refine((value) => value, {
    message: "You must accept the terms to proceed",
  }),
  hasConsentedToReceiveEmails: z.boolean().optional(),
  organizationTitle: z
    .string()
    .min(1, { message: "Title must be at least 1 characters long" }),
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
    existingUser: z.boolean(),
    user: z.string(),
    role: z.enum(["admin", "editor", "member"]),
    group_id: z.string(), //  ... or orgId,
  })
  .refine(
    (data) => (data.existingUser ? true : checkIfStringIsEmail(data.user)),
    {
      message:
        "If you wish to invite a new user, please provide a valid email address",
      path: ["user"],
    }
  );

function checkIfStringIsEmail(value: string) {
  return value.includes("@");
}

export type UserInviteFormType = z.infer<typeof UserInviteSchema>;

export const MemberEditSchema = z.object({
  username: z.string(),
  role: z.enum(["admin", "editor", "member"]),
  id: z.string(), //  ... or orgId,
});

export type MemberEditFormType = z.infer<typeof MemberEditSchema>;
