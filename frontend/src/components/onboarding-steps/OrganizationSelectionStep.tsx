import TextDivisor from "@components/_shared/TextDivisor";
import TextEditor from "@components/_shared/TextEditor";
import Image from "next/image";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import Link from "next/link";

export default ({
  orgs,
  setSelectedOrg,
  selectedOrg,
  setMessageToOrg,
  setConfirmationWorkingForTheOrg,
}: {
  orgs: any;
  setSelectedOrg: any;
  selectedOrg: any;
  setMessageToOrg: any;
  setConfirmationWorkingForTheOrg: any;
}) => {
  const [query, setQuery] = useState("");
  const filteredOrgs =
    query === ""
      ? orgs
      : orgs.filter((org: any) => {
          return org.name.toLowerCase().includes(query.toLowerCase());
        });
  return (
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
                {filteredOrgs.map((org: any) => (
                  <ComboboxOption
                    key={org.id}
                    value={org}
                    className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-500 hover:bg-[#E5E7EB]"
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
          id="confirmationWorkingForTheOrg"
          onChange={(e) => setConfirmationWorkingForTheOrg(e)}
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
