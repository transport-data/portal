import { z } from "zod";
import { OrganizationSchema } from "./organization.schema";

export const OnboardingSchema = z.object({
  followingGroups: z.array(z.string()).optional(),
  newUsersEmailsToInvite: z.array(z.string().email()).optional(),
  orgInWhichItParticipates: OrganizationSchema.optional(),
  confirmThatItParticipatesOfTheOrg: z.boolean().default(false),
  messageToParticipateOfTheOrg: z.string().optional(),
  messageToInviteNewUsers: z.string().optional(),
  newOrganizationName: z.string().optional(),
  newOrganizationDescription: z.string().optional(),
  newOrganizationDataDescription: z.string().optional(),
  isNewOrganizationSelected: z.boolean().default(false),
  isInterestSubmitted: z.boolean().default(false),
  isOrganizationSubmitted: z.boolean().default(false),
});

export type OnboardingFormType = z.infer<typeof OnboardingSchema>;
