import { z } from "zod";
import { OrganizationSchema } from "./organization.schema";

export const FollowGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  selected: z.boolean(),
});

export const OnboardingSchema = z.object({
  followingGroups: z.array(FollowGroupSchema).optional(),
  newUsersEmailsToInvite: z.array(z.string().email()).optional(),
  orgInWhichItParticipates: OrganizationSchema.optional(),
  confirmThatItParticipatesOfTheOrg: z.boolean().default(false),
  messageToParticipateOfTheOrg: z.string().optional(),
  messageToInviteNewUsers: z.string().optional(),
  newOrganizationName: z.string().optional(),
  newOrganizationDescription: z.string().optional(),
  newOrganizationDataDescription: z.string().optional(),
  isNewOrganizationSelected: z.boolean().default(false),
  onBoardingStep: z.number().default(0),
});

export type OnboardingFormType = z.infer<typeof OnboardingSchema>;
