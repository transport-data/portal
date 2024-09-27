import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { Checkboxes, SearchPageOnChange } from "@pages/search";
import { SearchDatasetsType } from "@schema/dataset.schema";
import classNames from "@utils/classnames";
import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { cn } from "@lib/utils";

export type Facet = { name: string; display_name: string; count: number };

export default ({
  tags,
  orgs,
  resourcesFormats,
  datasetCount,
  searchFilter,
  resetFilter,
  regions,
  countries,
  onChange,
  metadataCreatedDates,
}: {
  tags: Facet[];
  resetFilter: () => void;
  searchFilter: SearchDatasetsType;
  orgs: Facet[];
  metadataCreatedDates: Facet[];
  datasetCount: number;
  resourcesFormats: Facet[];
  regions: Facet[];
  countries: Facet[];
  onChange: SearchPageOnChange;
}) => {
  const [tabs, setTabs] = useState([
    { name: "All", current: false },
    { name: "Regions", current: true },
    { name: "Countries", current: false },
  ]);

  const [searchedGeographyText, setSearchedGeographyText] = useState("");
  const [startYear, setStartYear] = useState<number | undefined>();
  const [endYear, setEndYear] = useState<number | undefined>();

  const totalOfFiltersApplied =
    (searchFilter.tags?.length ?? 0) +
    (searchFilter.orgs?.length ?? 0) +
    (searchFilter.resFormat?.length ?? 0) +
    (searchFilter.publicationDates?.length ?? 0) +
    (searchFilter.countries?.length ?? 0) +
    (searchFilter.regions?.length ?? 0) +
    (searchFilter.sector ? 1 : 0) +
    (searchFilter.service ? 1 : 0) +
    (searchFilter.after ? 1 : 0) +
    (searchFilter.before ? 1 : 0) +
    (searchFilter.fuel ? 1 : 0) +
    (searchFilter.showArchived ? 1 : 0) +
    (searchFilter.mode ? 1 : 0);

  let showFilteredByAllCountriesAndRegions;

  if (!searchFilter.countries?.length && !searchFilter.regions?.length) {
    showFilteredByAllCountriesAndRegions = true;
  } else if (!searchFilter.countries && !countries.length) {
    showFilteredByAllCountriesAndRegions =
      searchFilter.regions?.length === regions.length;
  } else if (!searchFilter.regions && !regions.length) {
    showFilteredByAllCountriesAndRegions =
      searchFilter.countries?.length === countries.length;
  } else {
    showFilteredByAllCountriesAndRegions =
      searchFilter.countries?.length === countries.length &&
      searchFilter.regions?.length === regions.length;
  }

  return (
    <>
      <div className="mb-[12px] flex items-center justify-between gap-6 text-sm">
        <div>
          <h3 className="text-base font-medium text-[#111928]">Filters</h3>
          <p className="text-sm text-[#6B7280]">
            {totalOfFiltersApplied > 0 && (
              <span>
                {totalOfFiltersApplied}{" "}
                {totalOfFiltersApplied > 1 ? "Filters" : "Filter"} •{" "}
              </span>
            )}
            Showing{" "}
            {datasetCount > 1
              ? `all ${datasetCount} results`
              : `${datasetCount} result`}
          </p>
        </div>
        <span
          onClick={resetFilter}
          className="cursor-pointer text-sm font-medium text-cyan-900"
        >
          Clear all
        </span>
      </div>

      <Accordion type="single" collapsible className="w-full text-[#6B7280]">
        <AccordionItem value="keyword">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Keyword</span>
            <span className="hide mr-2 text-sm">
              {tags.length === searchFilter.tags?.length ||
              !searchFilter.tags?.length
                ? "All"
                : searchFilter.tags?.length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <div
              onClick={() => onChange([{ value: [], key: "tags" }])}
              className="ml-auto cursor-pointer font-semibold text-[#006064]"
            >
              Clear filter
            </div>
            <Checkboxes
              onChange={(items) => onChange([{ value: items, key: "tags" }])}
              items={tags}
              selectedItems={searchFilter.tags}
              limitToPresentViewAll={9}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Location</span>
            <span className="hide mr-2 text-sm">
              {showFilteredByAllCountriesAndRegions
                ? "All"
                : searchFilter.regions
                ? (searchFilter.regions?.length ?? 0) +
                  (searchFilter.countries?.length ?? 0)
                : 0}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-2 mt-[12px]">
              <div className="mb-2">
                <SimpleSearchInput
                  onTextInput={setSearchedGeographyText}
                  placeholder="Search geographies"
                />
              </div>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  onChange={({ target: { value: i } }: any) => {
                    setTabs((oldV) => {
                      const tabs = [...oldV];

                      tabs[Number(i)]?.current;
                      tabs.forEach(
                        (x, index) => (x.current = index === Number(i))
                      );
                      return tabs;
                    });
                  }}
                  name="tabs"
                  defaultValue={tabs.findIndex((tab) => tab.current)}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#111928] focus:outline-none focus:ring-transparent sm:text-sm"
                >
                  {tabs.map((tab, i) => (
                    <option
                      value={i}
                      className={classNames(
                        i === 1 &&
                          !regions?.filter((x) =>
                            x.display_name
                              .toLowerCase()
                              .includes(searchedGeographyText.toLowerCase())
                          ).length
                          ? "hidden"
                          : i === 2 &&
                            !countries?.filter((x) =>
                              x.display_name
                                .toLowerCase()
                                .includes(searchedGeographyText.toLowerCase())
                            ).length
                          ? "hidden"
                          : "block",
                        tab.current
                          ? "border-[#111928] text-[#111928]"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "cursor-pointer whitespace-nowrap border-b-2 px-1 py-1 text-sm font-medium"
                      )}
                      key={tab.name}
                    >
                      {tab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden justify-between sm:flex">
                <nav aria-label="Tabs" className="-mb-px flex gap-2.5">
                  {tabs.map((tab, i) => (
                    <a
                      key={tab.name}
                      onClick={() => {
                        setTabs((oldV) => {
                          const tabs = [...oldV];

                          tabs[i]?.current;
                          tabs.forEach((x, index) => (x.current = index === i));
                          return tabs;
                        });
                      }}
                      aria-current={tab.current ? "page" : undefined}
                      className={classNames(
                        i === 1 &&
                          !regions?.filter((x) =>
                            x.display_name
                              .toLowerCase()
                              .includes(searchedGeographyText.toLowerCase())
                          ).length
                          ? "hidden"
                          : i === 2 &&
                            !countries?.filter((x) =>
                              x.display_name
                                .toLowerCase()
                                .includes(searchedGeographyText.toLowerCase())
                            ).length
                          ? "hidden"
                          : "block",
                        tab.current
                          ? "border-[#111928] text-[#111928]"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "cursor-pointer whitespace-nowrap border-b-2 px-1 py-1 text-sm font-medium"
                      )}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
                <span
                  onClick={() => {
                    onChange([
                      { value: [], key: "regions" },
                      { value: [], key: "countries" },
                    ]);
                  }}
                  className="cursor-pointer font-semibold text-[#006064]"
                >
                  Clear filter
                </span>
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2.5 font-semibold text-[#006064]">
              <span
                className="cursor-pointer"
                onClick={() => {
                  const currentTabIdx = tabs.findIndex((x) => x.current)!;
                  if (currentTabIdx === 0) {
                    onChange([
                      {
                        value: [...regions.map((x) => x.name)],
                        key: "regions",
                      },
                      {
                        value: [...countries.map((x) => x.name)],
                        key: "countries",
                      },
                    ]);
                  } else if (currentTabIdx === 1) {
                    onChange([
                      {
                        value: [...regions.map((x) => x.name)],
                        key: "regions",
                      },
                    ]);
                  } else {
                    onChange([
                      {
                        value: [...countries.map((x) => x.name)],
                        key: "countries",
                      },
                    ]);
                  }
                }}
              >
                Check all
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  const currentTabIdx = tabs.findIndex((x) => x.current)!;
                  if (currentTabIdx === 0) {
                    onChange([{ value: [], key: "regions" }]);
                    onChange([{ value: [], key: "countries" }]);
                  } else if (currentTabIdx === 1) {
                    onChange([{ value: [], key: "regions" }]);
                  } else {
                    onChange([{ value: [], key: "countries" }]);
                  }
                }}
              >
                Uncheck all
              </span>
              <div
                className="ml-auto sm:hidden"
                onClick={() => {
                  onChange([
                    { value: [], key: "regions" },
                    { value: [], key: "countries" },
                  ]);
                }}
              >
                Clear filter
              </div>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll">
              {tabs[0]?.current ? (
                <>
                  <Checkboxes
                    items={regions.filter((x) =>
                      x.display_name
                        .toLowerCase()
                        .includes(searchedGeographyText.toLowerCase())
                    )}
                    selectedItems={searchFilter.regions}
                    onChange={(items) =>
                      onChange([{ value: items, key: "regions" }])
                    }
                  />
                  <Checkboxes
                    items={countries.filter((x) =>
                      x.display_name
                        .toLowerCase()
                        .includes(searchedGeographyText.toLowerCase())
                    )}
                    selectedItems={searchFilter.countries}
                    onChange={(items) =>
                      onChange([{ value: items, key: "countries" }])
                    }
                  />
                </>
              ) : tabs[1]?.current ? (
                <Checkboxes
                  items={regions.filter((x) =>
                    x.display_name
                      .toLowerCase()
                      .includes(searchedGeographyText.toLowerCase())
                  )}
                  selectedItems={searchFilter.regions}
                  onChange={(items) =>
                    onChange([{ value: items, key: "regions" }])
                  }
                />
              ) : (
                <Checkboxes
                  items={countries.filter((x) =>
                    x.display_name
                      .toLowerCase()
                      .includes(searchedGeographyText.toLowerCase())
                  )}
                  selectedItems={searchFilter.countries}
                  onChange={(items) =>
                    onChange([{ value: items, key: "countries" }])
                  }
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="yearsCovered">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Years covered</span>
            <span className="hide mr-2 text-sm">
              {searchFilter.before && searchFilter.after
                ? searchFilter.before.slice(0, 4) +
                  " - " +
                  searchFilter.after?.slice(0, 4)
                : "All"}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-[12px] flex justify-between">
              <div
                className={
                  !searchFilter.startYear || searchFilter.endYear
                    ? "invisible"
                    : ""
                }
              >
                {searchFilter.startYear}
                <span>—</span>
                {searchFilter.endYear}
              </div>
              <div
                className="font-semibold text-[#006064]"
                onClick={() => {
                  onChange([
                    { value: [], key: "regions" },
                    { value: [], key: "countries" },
                  ]);
                }}
              >
                Clear filter
              </div>
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
                  disabled={!startYear}
                  minDate={dayjs((startYear! + 1).toString())}
                  openTo="year"
                  views={["year"]}
                  yearsOrder="desc"
                  sx={{
                    maxWidth: 150,
                    cursor: !startYear ? "not-allowed" : "",
                  }}
                />
                <button
                  disabled={!endYear || !startYear}
                  className={cn(
                    "ml-auto cursor-pointer text-[#006064]",
                    !endYear || !startYear
                      ? "cursor-not-allowed opacity-60"
                      : ""
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
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="format">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Format</span>
            <span className="hide mr-2 text-sm">
              {resourcesFormats.length === searchFilter.resFormat?.length ||
              !searchFilter.resFormat?.length
                ? "All"
                : searchFilter.resFormat?.length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <div
              onClick={() => onChange([{ value: [], key: "resFormat" }])}
              className="ml-auto cursor-pointer font-semibold text-[#006064]"
            >
              Clear filter
            </div>

            <Checkboxes
              onChange={(items) =>
                onChange([{ value: items, key: "resFormat" }])
              }
              items={resourcesFormats}
              selectedItems={searchFilter.resFormat}
              limitToPresentViewAll={9}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="org">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Organisation</span>
            <span className="hide mr-2 text-sm">
              {orgs.length === searchFilter.orgs?.length ||
              !searchFilter.orgs?.length
                ? "All"
                : searchFilter.orgs?.length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <div
              onClick={() => onChange([{ value: [], key: "orgs" }])}
              className="ml-auto cursor-pointer font-semibold text-[#006064]"
            >
              Clear filter
            </div>

            <Checkboxes
              onChange={(items) => onChange([{ value: items, key: "orgs" }])}
              items={orgs}
              selectedItems={searchFilter.orgs}
              limitToPresentViewAll={7}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="publicationDate">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Publication date</span>
            <span className="hide mr-2 text-sm">
              {metadataCreatedDates.length ===
                searchFilter.publicationDates?.length ||
              !searchFilter.publicationDates?.length
                ? "All"
                : searchFilter.publicationDates?.length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <div
              onClick={() => onChange([{ value: [], key: "publicationDates" }])}
              className="ml-auto cursor-pointer font-semibold text-[#006064]"
            >
              Clear filter
            </div>

            <Checkboxes
              onChange={(items) =>
                onChange([{ value: items, key: "publicationDates" }])
              }
              items={metadataCreatedDates}
              selectedItems={searchFilter.publicationDates}
              limitToPresentViewAll={7}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="archived">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.full]:w-full [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="full flex">Archived</span>
            <span className="hide mx-2 flex w-full justify-end text-sm">
              {searchFilter.showArchived ? "All" : "Without archived"}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-[12px]">
            <p className="mb-6">
              Select whether to include the archive in the search if you are
              looking for older data.
            </p>
            <RadioGroup
              defaultValue={`${!!searchFilter.showArchived}`}
              onValueChange={(v) =>
                onChange([{ value: v === "true", key: "showArchived" }])
              }
              className="flex gap-3.5"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="false"
                  id="withoutArchived"
                  className="border-none bg-[#006064] text-white"
                />
                <Label htmlFor="withoutArchived">Without archived</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="true"
                  id="all"
                  className="border-none bg-[#006064] text-white"
                />
                <Label htmlFor="all">All (incl. archived)</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
