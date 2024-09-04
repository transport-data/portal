import SimpleSearchInput from "@components/ui/simple-search-input";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import classNames from "@utils/classnames";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { ReactNode, useState } from "react";

export default ({ children }: { children?: ReactNode }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="grid grid-cols-12 gap-2">
      <div
        className={
          children ? "col-span-12 sm:col-span-5" : "col-span-12 sm:col-span-6"
        }
      >
        <SimpleSearchInput onTextInput={(x) => setSearchText(x)} />
      </div>
      <div className={classNames("col-span-12 sm:col-span-2")}>
        <Listbox value={{ title: "Latest activity" }} onChange={() => ""}>
          <div className="relative text-sm text-[#6B7280]">
            <div className="inline-flex w-full rounded-md shadow-sm">
              <div className="inline-flex items-center gap-x-1.5 rounded-l-md border-y-[1px] border-l-[1px] border-gray-300 bg-white py-2 pl-3 shadow-sm">
                <span>Sort by:</span>
              </div>
              <ListboxButton className="inline-flex flex-grow items-center justify-between rounded-l-none rounded-r-md border-y-[1px] border-r-[1px] border-gray-300 bg-white p-2 placeholder:text-gray-400 hover:opacity-90 focus:outline-none">
                <p className="mr-2 text-sm text-[#1F2A37]">
                  {"Latest activity"}
                </p>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-[#111928]"
                />
              </ListboxButton>
            </div>

            <ListboxOptions
              transition
              className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
            >
              {[{ title: "Latest activity" }].map((option) => (
                <ListboxOption
                  key={option.title}
                  value={option}
                  className="group cursor-default select-none p-4 text-sm text-gray-900 data-[focus]:bg-accent data-[focus]:text-white"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <p className="font-normal group-data-[selected]:font-semibold">
                        {option.title}
                      </p>
                      <span className="group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                        <CheckIcon aria-hidden="true" className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
      <div className={classNames("col-span-12 sm:col-span-2")}>
        <select
          id="label"
          name="label"
          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#111928]"
        >
          <option>Label</option>
        </select>
      </div>
      <div className={classNames("col-span-12 sm:col-span-2")}>
        <select
          id="filter"
          name="filter"
          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#111928]"
        >
          <option>Filter</option>
        </select>
      </div>
      <div className="col-span-12 sm:col-span-1">{children}</div>
    </div>
  );
};
