import { SearchNewsfeedPageOnChange } from "@components/dashboard/NewsFeedTabContent";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { useEffect, useState } from "react";

export default function NewsFeedSearchFilters({
  sortOrder,
  actionsFilter,
  onChange,
  actionsFilterOptions,
}: {
  onChange: SearchNewsfeedPageOnChange;
  sortOrder: "latest" | "oldest";
  actionsFilter: string;
  actionsFilterOptions: any[];
}) {
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    onChange([{ key: "query", value: debouncedTerm }]);
  }, [debouncedTerm]);

  return (
    <div className="grid grid-cols-12 gap-2 xl:max-h-[36px] ">
      <div className="col-span-12 xl:col-span-6">
        <SimpleSearchInput
          placeholder="Search by dataset title, organization title or activity actor"
          onTextInput={(x) => setSearchTerm(x)}
        />
      </div>
      <div className="col-span-12 xl:col-span-3">
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
            onChange={(e) =>
              onChange([
                {
                  key: "sort",
                  value: e.target.value as any,
                },
              ])
            }
          >
            <option value="latest" selected={sortOrder === "latest"}>
              Latest activity
            </option>
            <option value="oldest" selected={sortOrder === "oldest"}>
              Oldest activity
            </option>
          </select>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-3">
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
            Action:
          </span>
          <select
            id="filter"
            name="filter"
            className="remove-input-ring block w-full rounded-lg rounded-e-lg border-0 bg-white p-0 pl-[3px]
            text-sm text-gray-900 ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
            onChange={(e) =>
              onChange([
                {
                  key: "action",
                  value: e.target.value,
                },
              ])
            }
            value={actionsFilter}
          >
            {actionsFilterOptions &&
              actionsFilterOptions.map((item) => (
                <option value={item}>{item}</option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
