import TextDivisor from "@components/_shared/TextDivisor";
import TextEditor from "@components/_shared/TextEditor";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { OnboardingFormType } from "@schema/onboarding.schema";
import Link from "next/link";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ChevronDown, Building } from "lucide-react";
import NewOrganizationRequest from "./NewOrganizationRequest";

export default ({
  form,
  orgs,
}: {
  form: UseFormReturn<OnboardingFormType, any, undefined>;
  orgs: any[];
}) => {
  const [query, setQuery] = useState("");
  const filteredOrgs =
    query === ""
      ? orgs
      : orgs.filter((org: any) => {
          return org.display_name.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <div className="space-y-5">
      {form.getValues("isNewOrganizationSelected") ? (
        <NewOrganizationRequest form={form} />
      ) : (
        <>
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
              value={form.watch("orgInWhichItParticipates")}
              onChange={(org) => {
                setQuery("");
                form.setValue("orgInWhichItParticipates", org || undefined);
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
                  displayValue={(org: any) => org?.display_name}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none data-[open]:rotate-180">
                  <ChevronDown size={14} />
                </ComboboxButton>

                {filteredOrgs.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredOrgs.map((org: any) => (
                      <ComboboxOption
                        disabled={org?.is_user_member}
                        key={org.id}
                        value={org}
                        className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-500 hover:bg-[#E5E7EB]"
                      >
                        <div className="flex items-center gap-3.5">
                          <Building size={14} />
                          <span className="block truncate group-data-[selected]:font-semibold">
                            {org.display_name}{" "}
                            {org?.is_user_member && (
                              <span className="opacity-75">
                                (Already a member of this organisation)
                              </span>
                            )}
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
                href={""}
                onClick={() => form.setValue("isNewOrganizationSelected", true)}
                className="text-[#00ACC1] hover:text-[#008E9D]"
              >
                Request a new organisation
              </Link>
            </p>
          </div>
          <TextDivisor text="Message for organisation owner*" />
          <TextEditor
            placeholder="Message for organisation admin..."
            setText={(text) =>
              form.setValue("messageToParticipateOfTheOrg", text)
            }
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[#006064] focus:ring-[#006064]"
              {...form.register("confirmThatItParticipatesOfTheOrg")}
              id="confirmThatItParticipatesOfTheOrg"
            />
            <div className="pb-1 text-sm text-[#6B7280]">
              <label htmlFor="confirmationWorkingForTheOrg">
                I confirm that I work for this organisation
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
