import SimpleSearchInput from "@components/ui/simple-search-input";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import classNames from "@utils/classnames";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { ReactNode, useState } from "react";

export default ({ children }: { children?: ReactNode }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="grid grid-cols-12 gap-2 xl:max-h-[36px] ">
      <div
        className={
          children ? "col-span-12 xl:col-span-5" : "col-span-12 xl:col-span-6"
        }
      >
        <SimpleSearchInput onTextInput={(x) => setSearchText(x)} />
      </div>
      <div className={classNames("col-span-12 xl:col-span-2")}>
        <div
          className="flex  
            h-[36px]
            items-center
            rounded-lg
            rounded-e-lg
            border
            border-s
            border-gray-300 border-l-gray-300
            border-s-gray-100 bg-white
          text-black shadow-sm
           focus-within:ring-[1px] focus-within:ring-[#111928]"
        >
          <span className="z-10 inline-flex flex-shrink-0 items-end rounded-xl  pl-3 text-center text-sm font-medium text-[#6B7280] dark:bg-gray-700 dark:text-white ">
            Sort by:
          </span>
          <select
            id="states"
            className="remove-input-ring block w-full rounded-lg rounded-e-lg border-0 bg-white p-0 pl-[3px]
            text-sm text-gray-900 ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
          >
            <option selected>Latest activity</option>
          </select>
        </div>
      </div>
      <div className={classNames("col-span-12 xl:col-span-2")}>
        <select
          id="label"
          name="label"
          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#111928]"
        >
          <option>Label</option>
        </select>
      </div>
      <div className={classNames("col-span-12 xl:col-span-2")}>
        <select
          id="filter"
          name="filter"
          className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#111928]"
        >
          <option>Filter</option>
        </select>
      </div>
      <div className="col-span-12 xl:col-span-1">{children}</div>
    </div>
  );
};
