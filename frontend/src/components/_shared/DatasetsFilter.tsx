import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { Checkboxes } from "@pages/search";
import { SearchDatasetsType } from "@schema/dataset.schema";
import classNames from "@utils/classnames";
import { Dispatch, SetStateAction, useState } from "react";

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
  yearsCoverage,
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
  yearsCoverage: Facet[];
  onChange: (
    items: string[] | boolean | string,
    key: keyof SearchDatasetsType
  ) => void;
}) => {
  const [tabs, setTabs] = useState([
    { name: "All", current: false },
    { name: "Regions", current: true },
    { name: "Countries", current: false },
  ]);

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
      <SimpleSearchInput
        onTextInput={(x) => console.log(x)}
        placeholder="Search"
      />

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
            <Checkboxes
              onChange={(items) => onChange(items, "tags")}
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
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  name="tabs"
                  defaultValue={tabs.find((tab) => tab.current)!.name}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#111928] focus:outline-none focus:ring-[#111928] sm:text-sm"
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
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
                        i === 1 && !regions?.length
                          ? "hidden"
                          : i === 2 && !countries?.length
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
              </div>
            </div>
            <div className="mb-3 flex gap-2.5 font-semibold text-[#006064]">
              <span
                className="cursor-pointer"
                onClick={() => {
                  const currentTabIdx = tabs.findIndex((x) => x.current)!;
                  if (currentTabIdx === 0) {
                    onChange([...regions.map((x) => x.name)], "regions");
                    onChange([...countries.map((x) => x.name)], "countries");
                  } else if (currentTabIdx === 1) {
                    onChange([...regions.map((x) => x.name)], "regions");
                  } else {
                    onChange([...countries.map((x) => x.name)], "countries");
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
                    onChange([], "regions");
                    onChange([], "countries");
                  } else if (currentTabIdx === 1) {
                    onChange([], "regions");
                  } else {
                    onChange([], "countries");
                  }
                }}
              >
                Uncheck all
              </span>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll">
              {tabs[0]?.current ? (
                <>
                  <Checkboxes
                    spaceCount
                    items={regions}
                    selectedItems={searchFilter.regions}
                    onChange={(items) => onChange(items, "regions")}
                  />
                  <Checkboxes
                    spaceCount
                    items={countries}
                    selectedItems={searchFilter.countries}
                    onChange={(items) => onChange(items, "countries")}
                  />
                </>
              ) : tabs[1]?.current ? (
                <Checkboxes
                  spaceCount
                  items={regions}
                  selectedItems={searchFilter.regions}
                  onChange={(items) => onChange(items, "regions")}
                />
              ) : (
                <Checkboxes
                  spaceCount
                  items={countries}
                  selectedItems={searchFilter.countries}
                  onChange={(items) => onChange(items, "countries")}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="yearsCovered">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Years covered</span>
            <span className="hide mr-2 text-sm">
              {/* {yearsCoverage.length === searchFilter.ye
                ? "All"
                : years.filter((x) => x.selected).length} */}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-3 mt-[12px] flex items-center gap-2">
              <input
                className="remove-input-number-arrows block w-[137px] rounded-md
          border-0 px-4 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-black  focus:ring-1 focus:ring-inset focus:ring-[#111928] sm:text-sm sm:leading-6
          "
                placeholder="From"
                type="number"
              />
              <span>—</span>
              <input
                className="remove-input-number-arrows block w-[137px] rounded-md
          border-0 px-4 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-black  focus:ring-1 focus:ring-inset focus:ring-[#111928] sm:text-sm sm:leading-6
          "
                placeholder="To"
                type="number"
              />
            </div>
            <div className="mb-3 flex gap-2.5 font-semibold text-[#006064]">
              <span
                className="cursor-pointer"
                onClick={() => {
                  // years.forEach((x) => (x.selected = true));
                  // setYears([...years]);
                }}
              >
                Check all
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  // setSearchFilter(oldV => ({...oldV, }))
                }}
              >
                Uncheck all
              </span>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll">
              {/* <Checkboxes items={years} onChange={(items) => {}} /> */}
            </div>
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
            <Checkboxes
              onChange={(items) => onChange(items, "resFormat")}
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
            <Checkboxes
              onChange={(items) => onChange(items, "orgs")}
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
            <Checkboxes
              onChange={(items) => onChange(items, "publicationDates")}
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
              onValueChange={(v) => onChange(v === "true", "showArchived")}
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
