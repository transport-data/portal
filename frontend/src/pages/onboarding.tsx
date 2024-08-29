import { ErrorAlert } from "@components/_shared/Alerts";
import { SingInLayout } from "@components/_shared/SignInLayout";
import Spinner from "@components/_shared/Spinner";
import TextDivisor from "@components/_shared/TextDivisor";
import TextEditor from "@components/_shared/TextEditor";
import { Button } from "@components/ui/button";
import { TagsButtonsSelectionGroup } from "@components/ui/tags-buttons-selection-group";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import Image from "next/image";

import MultipleSelector from "@components/_shared/ChipsInput";
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function LoginPage({ csrfToken }: { csrfToken: string }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggingIn, setLogin] = useState(false);
  const [messageToOrg, setMessageToOrg] = useState("");
  const [messageToInvitation, setMessageToInvitation] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const { register, handleSubmit, formState, setValue } = useForm<{
    username: string;
    password: string;
    remember?: boolean;
  }>();

  const orgs = [
    { id: 1, name: "Asia Development Bank (ADB)" },
    { id: 2, name: "CAF - Banco de desarrollo de América Latina" },
    { id: 3, name: "Chalmers University" },
    { id: 4, name: "European Bank for Reconstrution and Development (EBRD)" },
    { id: 5, name: "Fabrique des Mobilités" },
    { id: 6, name: "FIA Foundation" },
  ];

  const [locations, setLocations] = useState([
    { selected: false, name: "Africa" },
    { selected: false, name: "Asia" },
    { selected: false, name: "Australia and oceania" },
    { selected: false, name: "Europe" },
    { selected: false, name: "South America" },
    { selected: false, name: "Middle East and North Africa" },
    { selected: false, name: "EU" },
    { selected: false, name: "OECD" },
    { selected: false, name: "Africa" },
    { selected: false, name: "Africa" },
    { selected: false, name: "Africa" },
    { selected: false, name: "Africa" },
  ]);

  const [organizations, setOrganizations] = useState([
    { selected: false, name: "Transport Data Commons" },
    { selected: false, name: "World Bank" },
    { selected: false, name: "ITF-OECD" },
    { selected: false, name: "UNECE" },
    { selected: false, name: "ADB" },
    { selected: false, name: "Eurostat" },
    { selected: false, name: "IEA" },
    { selected: false, name: "KFW" },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
  ]);

  const [topics, setTopics] = useState([
    { selected: false, name: "Air travel" },
    { selected: false, name: "Passenger travel" },
    { selected: false, name: "Transportation Emissions" },
    { selected: false, name: "Road Safety" },
    { selected: false, name: "Rail" },
    { selected: false, name: "Freight" },
    { selected: false, name: "Electric vehicles" },
    { selected: false, name: "Public Transit " },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
    { selected: false, name: "ITDP" },
  ]);

  const [stepNumber, setStep] = useState(2);

  const steps = [
    { name: "Data interest", href: "1" },
    { name: "Organisation", href: "Organisation" },
    { name: "Invite colleagues", href: "invite" },
  ];

  const [query, setQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);

  const filteredOrgs =
    query === ""
      ? orgs
      : orgs.filter((org) => {
          return org.name.toLowerCase().includes(query.toLowerCase());
        });

  const [paragraphText, setParagraphText] = useState<string | ReactNode>(
    "The changes appear as a running list on your dashboard."
  );
  const [subtitleText, setSubtitleText] = useState(
    "Track the changes being made to the data you are interested in."
  );

  useEffect(() => {
    setDisableButton(!(selectedOrg && messageToOrg));
  }, [selectedOrg, messageToOrg]);

  useEffect(() => {
    if (stepNumber === 1) {
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
          <Button className="flex h-[41px] w-[144px] justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"></Button>
        </>
      );
    }

    if (stepNumber === 2) {
      setSubtitleText("Invite your friends and colleagues");
      setParagraphText(
        "Invite your colleagues to collaborate on sustainable transportation solutions. Together, you can share and analyse transport-related data, identify trends, and develop evidence-based policies that promote a more sustainable future."
      );
    }
  }, [stepNumber]);

  const [isComboboxOpened, setIsComboBoxOpened] = useState(false);

  const comboboxRef = useRef<any>();

  if (
    comboboxRef?.current?.attributes["data-headlessui-state"].value.includes(
      "open"
    ) &&
    !isComboboxOpened
  ) {
    setIsComboBoxOpened(true);
  } else if (
    !comboboxRef?.current?.attributes["data-headlessui-state"].value.includes(
      "open"
    ) &&
    isComboboxOpened
  ) {
    setIsComboBoxOpened(false);
  }

  const nextStep = () => {
    if (stepNumber === steps.length - 1) return;
    setStep(stepNumber + 1);
  };

  return (
    <>
      <NextSeo title="Onboarding" />
      <SingInLayout subtitleText={subtitleText} paragraphText={paragraphText}>
        <form
          onSubmit={(event) =>
            void handleSubmit(async (data) => {
              nextStep();
            })(event)
          }
          className="w-full bg-white px-28 py-28"
        >
          <input
            name="csrfToken"
            type="hidden"
            defaultValue={csrfToken ? csrfToken : ""}
          />
          <div className="pb-8">
            <div className="flex items-center justify-between gap-4">
              {steps.map((step, stepIdx) => (
                <div className="w-full">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
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
                            fill-rule="evenodd"
                            clip-rule="evenodd"
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
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <></>
                      )}

                      <span
                        className={
                          "text-sm " +
                          (stepNumber >= stepIdx
                            ? "pl-6 text-[#006064]"
                            : "text-gray-500")
                        }
                      >
                        {step.name}
                      </span>
                    </div>
                    {stepIdx === steps.length - 1 ? (
                      <></>
                    ) : (
                      <div className="w-[69px] border-t border-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {stepNumber === 0 ? (
            <>
              <h2 className="text-xl font-bold text-[#111928]">
                Select locations, topics and organisations you want to follow
              </h2>
              <div>
                <div className="space-y-5">
                  <TextDivisor text="Locations" />
                  <TagsButtonsSelectionGroup
                    data={locations}
                    setData={setLocations}
                  />
                  <TextDivisor text="Topics" />
                  <TagsButtonsSelectionGroup
                    data={topics}
                    setData={setTopics}
                  />
                  <TextDivisor text="Organisations" />
                  <TagsButtonsSelectionGroup
                    data={organizations}
                    setData={setOrganizations}
                  />
                </div>
              </div>
            </>
          ) : stepNumber === 1 ? (
            <div className="space-y-5">
              <div>
                <h2 className="mb-2.5 text-xl font-bold text-[#111928]">
                  Find your organisation
                </h2>
                <p className="text-gray-500">
                  Please note that that your account must be associated with an
                  organisation to submit data.
                </p>
              </div>
              <TextDivisor text="Select organisation*" />
              <div className="space-y-1">
                <Combobox
                  as="div"
                  value={selectedOrg}
                  onChange={(org) => {
                    setQuery("");
                    setSelectedOrg(org);
                  }}
                >
                  <div className="relative mt-2">
                    <ComboboxInput
                      placeholder="Select an organization"
                      className="icon-at-left w-full rounded-md border-0 bg-white py-1.5 pl-11 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                      onChange={(event) => {
                        setQuery(event.target.value);
                      }}
                      onBlur={() => {
                        setQuery("");
                      }}
                      displayValue={(org: any) => org?.name}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none data-[open]:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                      >
                        <path
                          d="M8.5 1.5L5 5L1.5 1.5"
                          stroke="#6B7280"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ComboboxButton>

                    {filteredOrgs.length > 0 && (
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOrgs.map((org) => (
                          <ComboboxOption
                            key={org.id}
                            value={org}
                            className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-500"
                          >
                            <div className="flex items-center gap-3.5">
                              <Image
                                alt="Small building icon"
                                src="/assets/organization-icon.svg"
                                width={14}
                                height={16}
                              />
                              <span className="block truncate group-data-[selected]:font-semibold">
                                {org.name}
                              </span>
                            </div>
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
                <p className="text-sm text-gray-500">
                  Don’t see your organisation?{" "}
                  <Link
                    href={"https://google.com"}
                    className="text-[#00ACC1] hover:text-[#008E9D]"
                  >
                    Request a new organisation
                  </Link>
                </p>
              </div>
              <TextDivisor text="Message for organisation owner*" />
              <TextEditor
                placeholder="Message for organisation admin..."
                setText={setMessageToOrg}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#006064] focus:ring-[#006064]"
                  id="remember"
                  {...register("remember")}
                />
                <div className="pb-1 text-sm text-[#6B7280]">
                  <label htmlFor="remember">
                    I confirm that I work for this organisation
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="mb-2.5 text-xl font-bold text-[#111928]">
                Invite friends & colleagues
              </h2>

              <div className="space-y-4">
                <TextDivisor text="Emails*" />
                <MultipleSelector
                  removeSuggestions={true}
                  hidePlaceholderWhenSelected={true}
                  inputProps={{
                    className:
                      "border-0 text-[#111928] ring-0 border-[#00000000]",
                  }}
                  badgeClassName="px-3 py-[2px] bg-[#E3F9ED] rounded-md text-[#006064] overflow-wrap-anywhere"
                  placeholder="name1@email.com; name2@email.com;"
                  creatable
                  validationOptions={{
                    errorMessage: "Invalid e-mail",
                    validateData: (v) =>
                      !!v &&
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v),
                  }}
                  triggerSearchOnFocus={false}
                  className="mail-icon-at-left pl-11 pr-4"
                  hideClearAllButton={true}
                />
              </div>
              <TextDivisor text="Attach a message" />
              <TextEditor
                placeholder="Message for friends and colleagues..."
                setText={setMessageToInvitation}
              />
            </div>
          )}
          <div className="mt-5">
            <div className="mb-5">
              <div className="col-span-full">
                {match(loggingIn)
                  .with(false, () => (
                    <Button
                      disabled={disableButton}
                      type="submit"
                      className={
                        "flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" +
                        (disableButton ? " cursor-not-allowed opacity-20" : "")
                      }
                    >
                      Next
                    </Button>
                  ))
                  .otherwise(() => (
                    <Button
                      disabled
                      className="flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      <Spinner />
                    </Button>
                  ))}
              </div>
            </div>
            <p className="text-sm leading-6 text-[#6B7280]">
              {stepNumber === 0
                ? "You can always do this later."
                : stepNumber === 1
                ? "Don’t want to share data?"
                : "Don’t want to invite anyone?"}{" "}
              <span
                onClick={() => nextStep()}
                className="cursor-pointer text-[#00ACC1] hover:text-[#008E9D]"
              >
                {stepNumber === 0 ? "Skip" : "Skip this step"}{" "}
              </span>
            </p>
            {errorMessage && <ErrorAlert text={errorMessage} />}
          </div>
        </form>
      </SingInLayout>
    </>
  );
}
