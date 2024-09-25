import { z } from "zod";

export const OnboardingSchema = z.object({
  followingOrganizations: z.array(z.string()).optional(),
  interestedLocations: z.array(z.string()).optional(),
  interestedTopics: z.array(z.string()).optional(),
  newUsersEmailsToInvite: z.array(z.string().email()).optional(),
  orgInWhichItParticipates: z.string().optional(),
  confirmThatItParticipatesOfTheOrg: z.boolean().default(false),
  messageToParticipateOfTheOrg: z.string().optional(),
  messageToInviteNewUsers: z.string().optional(),
  newOrganizationName: z.string().optional(),
  newOrganizationDescription: z.string().optional(),
  newOrganizationDataDescription: z.string().optional(),
});

export type OnboardingFormType = z.infer<typeof OnboardingSchema>;
