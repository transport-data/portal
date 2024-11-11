import { ErrorAlert, SuccessAlert } from "@components/_shared/Alerts";
import { SingInLayout } from "@components/_shared/SignInLayout";
import Spinner from "@components/_shared/Spinner";
import { Button } from "@components/ui/button";
import type { InferGetServerSidePropsType } from "next";

import InterestsSteps from "@components/onboarding-steps/InterestsSteps";
import InviteUsersStep from "@components/onboarding-steps/InviteUsersStep";
import OrganizationSelectionStep from "@components/onboarding-steps/OrganizationSelectionStep";
import { OnboardingFormType } from "@schema/onboarding.schema";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";
import { listGroups } from "@utils/group";
import { listOrganizations, listUserOrganizations } from "@utils/organization";
import { api } from "@utils/api";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { deleteCookie } from "cookies-next";
import { getServerAuthSession } from "@server/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  const session = await getServerAuthSession(context);
  const apiKey = (context as any).session?.apiKey || "";
  const topicsData = await listGroups({
    type: "topic",
    apiKey,
  });
  const locationData = await listGroups({
    apiKey,
    type: "geography",
  });
  const organizationsData = await listOrganizations({
    input: {
      detailed: true,
      includeUsers: false,
    },
  });
  try {
    const userOrganizations = await listUserOrganizations({
      apiKey,
      id: session?.user?.id || "",
    });

    const userOrganizationsIds = userOrganizations.map((o) => o.id);

    organizationsData.forEach((o) => {
      if (userOrganizationsIds.includes(o.id)) {
        o.is_user_member = true;
      }
    });
  } catch (e) {
    console.error(e);
  }
  return {
    props: {
      csrfToken: csrfToken ? csrfToken : "",
      organizationsData: organizationsData,
      topicsData: topicsData,
      locationData: locationData,
    },
  };
}

export default function LoginPage({
  csrfToken,
  organizationsData,
  topicsData,
  locationData,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();
  const [disableButton, setDisableButton] = useState(false);
  const form = useForm<OnboardingFormType>();
  const { handleSubmit, watch } = form;
  const [followedGroups, setFollowedGroups] = useState([]);

  const { data: userFollowee, isLoading } = api.user.getFollowee.useQuery();
  const onBoardUser = api.user.onboard.useMutation({
    onSuccess: async () => {
      setLoading(false);
      setShowSuccessAlert(true);
      if (stepNumber === 0) {
        setSuccessMessage("Successfully followed Groups");
      } else if (stepNumber === 1) {
        setSuccessMessage("Request Submitted Successfully");
      } else {
        setSuccessMessage("Successfully sent Invites");
      }
      setTimeout(() => setShowSuccessAlert(false), 3000);
      toast({
        description: "Successfully Onboarded User",
      });
      form.reset();
      setErrorMessage(null);
      if (stepNumber === 2) {
        await router.push("/dashboard/newsfeed");
      }
      setStep(stepNumber + 1);
    },
    onError: (error) => {
      setLoading(false);
      setErrorMessage(error.message);
    },
  });

  useEffect(() => {
    deleteCookie("invite_id");
    setIsSmallScreen(window.innerWidth < 1457);
  }, []);

  const [locations, setLocations] = useState(
    locationData
      ? locationData.map((loc) => ({
          id: loc.id,
          name: loc.display_name,
          selected: false,
        }))
      : []
  );

  const [organizations, setOrganizations] = useState(
    organizationsData
      ? organizationsData.map((org) => ({
          id: org.id,
          name: org.display_name,
          selected: false,
        }))
      : []
  );

  const [topics, setTopics] = useState(
    topicsData
      ? topicsData.map((topic) => ({
          id: topic.id,
          name: topic.display_name,
          selected: false,
        }))
      : []
  );

  const [stepNumber, setStep] = useState(0);
  const steps = [
    { name: "Data interest", href: "1" },
    { name: "Organisation", href: "Organisation" },
    { name: "Invite colleagues", href: "invite" },
  ];

  const [paragraphText, setParagraphText] = useState<string | ReactNode>(
    "The changes appear as a running list on your dashboard."
  );
  const [subtitleText, setSubtitleText] = useState(
    "Track the changes being made to the data you are interested in."
  );

  const inviteFriends = watch("newUsersEmailsToInvite");
  const inviteMessage = watch("messageToInviteNewUsers");

  const isMessageEmpty = inviteMessage
    ? !(inviteMessage.length > 0 && inviteMessage.toString() !== "<p></p>")
    : true;

  const isUserEmpty = inviteFriends ? !(inviteFriends.length > 0) : true;

  useEffect(() => {
    if (userFollowee && !isLoading) {
      const selectedLocations = locationData
        ? locationData.map((loc) => ({
            id: loc.id,
            name: loc.display_name,
            selected: userFollowee.some(
              (followee: any) =>
                followee.type === "group" &&
                followee.dict.type === "geography" &&
                followee.dict.id === loc.id
            ),
          }))
        : [];
      const selectedOrganizations = organizationsData
        ? organizationsData.map((org) => ({
            id: org.id,
            name: org.display_name,
            selected: userFollowee.some(
              (followee: any) =>
                followee.type === "organization" && followee.dict.id === org.id
            ),
          }))
        : [];
      const selectedTopics = topicsData
        ? topicsData.map((topic) => ({
            id: topic.id,
            name: topic.display_name,
            selected: userFollowee.some(
              (followee: any) =>
                followee.type === "group" &&
                followee.dict.type === "topic" &&
                followee.dict.id === topic.id
            ),
          }))
        : [];
      setLocations(selectedLocations);
      setOrganizations(selectedOrganizations);
      setTopics(selectedTopics);
    }
  }, [userFollowee, isLoading]);

  useEffect(() => {
    if (stepNumber === 0) {
      if (followedGroups) {
        setDisableButton(false);
      }
    } else if (stepNumber === 1) {
      setSubtitleText("Prepare to share data");
      setParagraphText(
        <>
          <p>
            Data on TDC is shared trough organisations. Join an existing
            organisation or create a new one. Data can be shared publicly or
            privately between members of an organisation.
          </p>
          <br />
          <p className="mb-3">
            Not a member of an organisation, but still want to contribute your
            data?
          </p>
          <Button
            className="flex h-[41px] w-[144px] justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            onClick={() => router.push("/contact")}
          >
            Reach out
          </Button>
        </>
      );
      if (watch("isNewOrganizationSelected")) {
        setDisableButton(
          !(
            watch("newOrganizationName") &&
            watch("newOrganizationDescription") &&
            watch("confirmThatItParticipatesOfTheOrg")
          )
        );
      } else {
        setDisableButton(
          !(
            watch("orgInWhichItParticipates") &&
            watch("messageToParticipateOfTheOrg") &&
            watch("confirmThatItParticipatesOfTheOrg")
          )
        );
      }
    } else if (stepNumber === 2) {
      setSubtitleText("Invite your friends and colleagues");
      setParagraphText(
        "Invite your colleagues to collaborate on sustainable transportation solutions. Together, you can share and analyse transport-related data, identify trends, and develop evidence-based policies that promote a more sustainable future."
      );
      setDisableButton(isMessageEmpty || isUserEmpty);
    } else {
      setDisableButton(false);
    }
  }, [
    watch("orgInWhichItParticipates"),
    watch("messageToParticipateOfTheOrg"),
    watch("confirmThatItParticipatesOfTheOrg"),
    watch("newOrganizationName"),
    watch("newOrganizationDescription"),
    watch("newOrganizationDataDescription"),
    watch("isNewOrganizationSelected"),
    inviteMessage,
    inviteFriends,
    //watch("newUsersEmailsToInvite"),
    //watch("messageToInviteNewUsers"),
    stepNumber,
    followedGroups,
  ]);

  const nextStep = async () => {
    if (stepNumber === 0) {
      form.setValue("followingGroups", followedGroups);
    }
    form.setValue("onBoardingStep", stepNumber);
    setLoading(true);
    const data = form.getValues();
    onBoardUser.mutate(data);
  };

  const skipStep = async () => {
    if (stepNumber === 2) {
      setLoading(true);
      router.push("/dashboard/newsfeed");
    }
    setStep(stepNumber + 1);
  };

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="text-slate-900" />
    </div>
  ) : (
    <>
      <NextSeo title="Onboarding" />
      <SingInLayout subtitleText={subtitleText} paragraphText={paragraphText}>
        <form
          onSubmit={handleSubmit((data) => {
            nextStep();
          })}
          className="w-full bg-white px-28 py-28"
        >
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={csrfToken ? csrfToken : ""}
          />
          <div className="pb-8">
            <div className="flex items-center justify-between gap-4 md:flex-col md:items-start lg:flex-row lg:items-center">
              {steps.map((step, stepIdx) => (
                <Fragment key={stepIdx}>
                  <div className="w-fit">
                    <div
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => setStep(stepIdx)}
                    >
                      {stepNumber === stepIdx ? (
                        <svg
                          className="absolute"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="15"
                          viewBox="0 0 16 15"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.00005 14.6998C9.90961 14.6998 11.741 13.9412 13.0912 12.591C14.4415 11.2407 15.2 9.40936 15.2 7.4998C15.2 5.59025 14.4415 3.7589 13.0912 2.40864C11.741 1.05837 9.90961 0.299805 8.00005 0.299805C6.09049 0.299805 4.25914 1.05837 2.90888 2.40864C1.55862 3.7589 0.800049 5.59025 0.800049 7.4998C0.800049 9.40936 1.55862 11.2407 2.90888 12.591C4.25914 13.9412 6.09049 14.6998 8.00005 14.6998ZM11.3363 6.3361C11.5003 6.16636 11.591 5.93902 11.589 5.70304C11.5869 5.46707 11.4923 5.24134 11.3254 5.07447C11.1585 4.9076 10.9328 4.81295 10.6968 4.8109C10.4608 4.80885 10.2335 4.89956 10.0637 5.06351L7.10005 8.02721L5.93635 6.86351C5.76661 6.69956 5.53927 6.60885 5.30329 6.6109C5.06731 6.61295 4.84158 6.7076 4.67471 6.87447C4.50784 7.04134 4.41319 7.26707 4.41114 7.50304C4.40909 7.73902 4.49981 7.96636 4.66375 8.1361L6.46375 9.9361C6.63252 10.1048 6.8614 10.1996 7.10005 10.1996C7.3387 10.1996 7.56757 10.1048 7.73635 9.9361L11.3363 6.3361Z"
                            fill="#006064"
                          />
                        </svg>
                      ) : stepNumber > stepIdx ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M5.75 8L7.25 9.5L10.25 6.5M14.75 8C14.75 8.88642 14.5754 9.76417 14.2362 10.5831C13.897 11.4021 13.3998 12.1462 12.773 12.773C12.1462 13.3998 11.4021 13.897 10.5831 14.2362C9.76417 14.5754 8.88642 14.75 8 14.75C7.11358 14.75 6.23583 14.5754 5.41689 14.2362C4.59794 13.897 3.85382 13.3998 3.22703 12.773C2.60023 12.1462 2.10303 11.4021 1.76381 10.5831C1.42459 9.76417 1.25 8.88642 1.25 8C1.25 6.20979 1.96116 4.4929 3.22703 3.22703C4.4929 1.96116 6.20979 1.25 8 1.25C9.79021 1.25 11.5071 1.96116 12.773 3.22703C14.0388 4.4929 14.75 6.20979 14.75 8Z"
                            stroke="#006064"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <></>
                      )}

                      <div
                        style={
                          isSmallScreen ? ({} as any) : { textWrap: "nowrap" }
                        }
                        className={
                          "whitespace-normal break-keep	text-sm " +
                          (stepNumber >= stepIdx
                            ? "pl-6 text-[#006064]"
                            : "text-gray-500")
                        }
                      >
                        {step.name}
                      </div>
                    </div>
                  </div>
                  {stepIdx === steps.length - 1 ? (
                    <></>
                  ) : (
                    <div className="min-w-[15%] border-t border-gray-300 md:min-w-full lg:min-w-[15%]" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          {stepNumber === 0 ? (
            <InterestsSteps
              locations={locations}
              setLocations={setLocations}
              topics={topics}
              setTopics={setTopics}
              organizations={organizations}
              setOrganizations={setOrganizations}
              setFollowedGroups={setFollowedGroups}
            />
          ) : stepNumber === 1 ? (
            <OrganizationSelectionStep orgs={organizationsData} form={form} />
          ) : (
            <InviteUsersStep form={form} />
          )}
          <div className="mt-5">
            <div className="mb-5">
              <div className="col-span-full">
                {match(loading)
                  .with(false, () => (
                    <Button
                      disabled={disableButton}
                      type="submit"
                      className={
                        "flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" +
                        (disableButton ? " cursor-not-allowed opacity-20" : "")
                      }
                    >
                      {stepNumber === 2 ? "Submit" : "Next"}
                    </Button>
                  ))
                  .otherwise(() => (
                    <Button
                      disabled
                      className="flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      <Spinner className="text-slate-900" />
                    </Button>
                  ))}
              </div>
            </div>
            <p className="text-sm leading-6 text-[#6B7280]">
              {stepNumber === 0
                ? "You can always do this later."
                : stepNumber === 1
                ? "Don’t want to share data?"
                : "Don’t want to submit form?"}{" "}
              <span
                onClick={() => skipStep()}
                className="cursor-pointer text-[#00ACC1] hover:text-[#008E9D]"
              >
                {stepNumber === 2 ? "Skip" : "Skip this step"}{" "}
              </span>
            </p>
            {errorMessage && <ErrorAlert text={errorMessage} />}
            {showSuccessAlert && (
              <SuccessAlert
                text={successMessage}
                onClose={() => setShowSuccessAlert(false)} // Close alert on demand
              />
            )}
          </div>
        </form>
      </SingInLayout>
    </>
  );
}
