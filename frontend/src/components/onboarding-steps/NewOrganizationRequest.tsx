import TextDivisor from "@components/_shared/TextDivisor";
import TextEditor from "@components/_shared/TextEditor";
import {
  Combobox,
  ComboboxInput,
} from "@headlessui/react";
import { useState } from "react";
import { OnboardingFormType } from "@schema/onboarding.schema";
import { UseFormReturn } from "react-hook-form";
import { ArrowLeft } from 'lucide-react';

export default ({
  form,
  setRequestNewOrg
}: {
  form: UseFormReturn<OnboardingFormType, any, undefined>;
  setRequestNewOrg: any;
}) => {

  return (
    <div className="space-y-5">
      <div>
        <div className="flex">
              <div className="mt-1"><ArrowLeft size={14} onClick={() => setRequestNewOrg(false)}/></div>
              <h2 className="ml-3 mb-2.5 text-sxl font-bold text-[#111928]">
                  Create a new organization
              </h2>   
        </div>  
        <p className="text-gray-500">
          Please tell us more about your organization. We will review your request and get back to you within 2 working days 
          to discuss the data you would like to share.
        </p>
      </div>
      <TextDivisor text="About your organization*" />
      <div className="space-y-1">
        <Combobox
          as="div"
          value={form.watch("newOrganizationName")}
          onChange={(org) => {
            form.setValue("newOrganizationName", org || undefined);
          }}
        >
          <div className="relative mt-2">
            <ComboboxInput
              placeholder="Name of the organization..."
              className="icon-at-left w-full rounded-md border-0 bg-white py-1.5 pl-11 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
              onChange={(event) => {
                form.setValue("newOrganizationName", event.target.value);
              }}
              displayValue={(orgName:any) => orgName}
            />
          </div>
        </Combobox>
      </div>
      <TextEditor
        placeholder="Write a short description of your organization..."
        setText={(text) => form.setValue("newOrganizationDescription", text)}
      />
      <TextDivisor text="What data would you like to share?" />
      <TextEditor
        placeholder="What data would you like to share via TDC?"
        setText={(text) => form.setValue("newOrganizationDataDescription", text)}
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
    </div>
  );
};
