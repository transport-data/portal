import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";

import { cn } from "@lib/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SearchPageOnChange } from "@pages/search";
import { SearchDatasetType } from "@schema/dataset.schema";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function DateQuickFilterDropdown({
  text,
  filterStartFieldName,
  filterEndFieldName,
  searchFilter,
  defaultStartValue,
  defaultEndValue,
  onChange,
}: {
  text: string;
  searchFilter: SearchDatasetType;
  onChange: SearchPageOnChange;
  filterStartFieldName: keyof SearchDatasetType;
  filterEndFieldName: keyof SearchDatasetType;
  defaultStartValue?: number;
  defaultEndValue?: number;
}) {
  const [startYear, setStartYear] = useState<number | undefined>(
    defaultStartValue
  );
  const [endYear, setEndYear] = useState<number | undefined>(defaultEndValue);

  useEffect(() => {
    if (defaultStartValue !== startYear) setStartYear(defaultStartValue);
    if (defaultEndValue !== endYear) setEndYear(defaultEndValue);
  }, [defaultStartValue, defaultEndValue]);

  const selectedText =
    !searchFilter.startYear && searchFilter.endYear
      ? `before ${searchFilter.endYear}`
      : searchFilter.startYear && !searchFilter.endYear
      ? `after ${searchFilter.startYear}`
      : searchFilter.startYear && searchFilter.endYear
      ? searchFilter.startYear.toString().slice(0, 4) +
        " - " +
        searchFilter.endYear?.toString().slice(0, 4)
      : "All";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          id={`quick-filter-by-${filterStartFieldName}-${filterEndFieldName}`}
          size="sm"
          variant="input"
          className="flex items-center gap-1 rounded-[8px] shadow-none ring-[#E5E7EB] lg:w-fit"
        >
          <span className="text-sm font-normal text-gray-500">{text}: </span>
          <span className="text-sm font-medium text-gray-900">
            {selectedText}
          </span>
          <ChevronDownIcon width={16} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-[8px] p-0">
        <DropdownMenuLabel className="px-4 py-[12px]">{text}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4">
          <div className="flex justify-end">
            <button className="font-semibold text-[#006064]">
              <span
                onClick={() => {
                  setStartYear(undefined);
                  setEndYear(undefined);
                  onChange([
                    { value: undefined, key: filterStartFieldName },
                    { value: undefined, key: filterEndFieldName },
                  ]);
                }}
                className="max-w-fit cursor-pointer"
              >
                Clear filter
              </span>
            </button>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="mb-3 mt-[12px] flex items-center gap-2">
              <DatePicker
                label="From"
                value={startYear ? dayjs(startYear.toString()) : undefined}
                onChange={(x) => {
                  setStartYear(x?.year());
                  if (!x?.year()) {
                    setEndYear(undefined);
                  } else {
                    setEndYear(x.year() + 1);
                  }
                }}
                openTo="year"
                views={["year"]}
                yearsOrder="desc"
                sx={{ maxWidth: 150 }}
              />
              <span>—</span>
              <DatePicker
                label="To"
                value={endYear ? dayjs(endYear.toString()) : undefined}
                onChange={(x) => setEndYear(x?.year())}
                minDate={
                  startYear ? dayjs((startYear! + 1).toString()) : undefined
                }
                openTo="year"
                views={["year"]}
                yearsOrder="desc"
                sx={{
                  maxWidth: 150,
                }}
              />
              <button
                id="years-covered-search-button"
                disabled={!endYear && !startYear}
                className={cn(
                  "ml-auto cursor-pointer text-[#006064]",
                  !endYear && !startYear ? "cursor-not-allowed opacity-60" : ""
                )}
                onClick={() =>
                  onChange([
                    { key: "startYear", value: startYear },
                    { key: "endYear", value: endYear },
                  ])
                }
              >
                Search
              </button>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll"></div>
          </LocalizationProvider>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
