import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import SimpleSearchInput from "@components/ui/simple-search-input";
import { SearchDatasetsType } from "@schema/dataset.schema";
import classNames from "@utils/classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type Facet = { name: string; display_name: string; count: number };

export default ({
  tags,
  orgs,
  resourcesFormats,
  datasetCount,
  groups,
  setSearchFilter,
  resetPagination,
  searchFilter,
  resetFilter,
  regions,
  yearsCoverage,
  metadataCreatedDates,
}: {
  tags: Facet[];
  setSearchFilter: Dispatch<SetStateAction<SearchDatasetsType>>;
  resetPagination: () => void;
  resetFilter: () => void;
  searchFilter: SearchDatasetsType;
  orgs: Facet[];
  metadataCreatedDates: Facet[];
  datasetCount: number;
  resourcesFormats: Facet[];
  groups: Facet[];
  regions: Facet[];
  yearsCoverage: Facet[];
}) => {
  const mapFacetsToFilterItems = (
    facets: Facet[],
    isSelectedFn: (v: string) => boolean
  ) => {
    return facets.map((x) => ({
      value: x.name,
      amountOfDatasets: x.count,
      selected: isSelectedFn(x.name),
      label: x.display_name,
    }));
  };

  const tabs = [
    { name: "All", current: false },
    { name: "Regions", current: true },
    { name: "Countries", current: false },
    { name: "Cities", current: false },
  ];

  const [keywordItems, setKeywordItems] = useState<
    ReturnType<typeof mapFacetsToFilterItems> | never[]
  >([]);

  const [publicationDates, setPublicationDates] = useState<
    ReturnType<typeof mapFacetsToFilterItems> | never[]
  >([]);
  const [internalOrgs, setInternalOrgs] = useState<
    ReturnType<typeof mapFacetsToFilterItems> | never[]
  >([]);

  const [formats, setFormats] = useState<
    ReturnType<typeof mapFacetsToFilterItems> | never[]
  >([]);

  const [years, setYears] = useState<
    ReturnType<typeof mapFacetsToFilterItems> | never[]
  >([]);

  const [internalRegions, setInternalRegions] = useState<
    ReturnType<typeof mapFacetsToFilterItems> | never[]
  >([]);

  const [totalOfFiltersApplied, setTotalOfFiltersApplied] = useState(0);

  useEffect(() => {
    setKeywordItems(
      mapFacetsToFilterItems(tags, (v) => {
        return !!searchFilter.tags?.includes(v);
      })
    );

    setFormats(
      mapFacetsToFilterItems(resourcesFormats, (v) => {
        return !!searchFilter.resFormat?.includes(v);
      })
    );

    setInternalOrgs(
      mapFacetsToFilterItems(orgs, (v) => {
        return !!searchFilter.orgs?.includes(v);
      })
    );

    setYears(
      mapFacetsToFilterItems(yearsCoverage, (v) => {
        return false;
      })
    );

    setPublicationDates(
      mapFacetsToFilterItems(metadataCreatedDates, (v) => {
        return !!searchFilter.publicationDate?.includes(v);
      })
    );

    setTotalOfFiltersApplied(
      (searchFilter.tags?.length || 0) +
        (searchFilter.locations?.length || 0) +
        (searchFilter.orgs?.length || 0) +
        (searchFilter.resFormat?.length || 0) +
        (searchFilter.publicationDate?.length || 0) +
        (searchFilter.locations?.length || 0) +
        (searchFilter.sector ? 1 : 0) +
        (searchFilter.service ? 1 : 0) +
        (searchFilter.mode ? 1 : 0) +
        (searchFilter.region ? 1 : 0)
    );
  }, [
    tags,
    orgs,
    resourcesFormats,
    metadataCreatedDates,
    groups,
    regions,
    yearsCoverage,
  ]);

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
              {keywordItems.every((x) => x.selected) ||
              keywordItems.every((x) => !x.selected)
                ? "All"
                : keywordItems.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <Checkboxes
              onChange={(items) => {
                setKeywordItems(items);
                setSearchFilter((oldValue) => ({
                  ...oldValue,
                  offset: 0,
                  tags: items.filter((x) => x.selected).map((x) => x.value),
                }));
                resetPagination();
              }}
              items={keywordItems}
              limitToPresentViewAll={9}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Location</span>
            <span className="hide mr-2 text-sm">
              {internalRegions.every((x) => x.selected) ||
              internalRegions.every((x) => !x.selected)
                ? "All"
                : internalRegions.filter((x) => x.selected).length}
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
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      aria-current={tab.current ? "page" : undefined}
                      className={classNames(
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
                  internalRegions.forEach((x) => (x.selected = true));
                  setInternalRegions([...internalRegions]);
                }}
              >
                Check all
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  internalRegions.forEach((x) => (x.selected = false));
                  setInternalRegions([...internalRegions]);
                }}
              >
                Uncheck all
              </span>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll">
              <Checkboxes
                spaceCount
                items={internalRegions}
                onChange={(items) => {}}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="yearsCovered">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Years covered</span>
            <span className="hide mr-2 text-sm">
              {years.every((x) => x.selected) || years.every((x) => !x.selected)
                ? "All"
                : years.filter((x) => x.selected).length}
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
                  years.forEach((x) => (x.selected = true));
                  setYears([...years]);
                }}
              >
                Check all
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  years.forEach((x) => (x.selected = false));
                  setYears([...years]);
                }}
              >
                Uncheck all
              </span>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll">
              <Checkboxes items={years} onChange={(items) => {}} />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="format">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Format</span>
            <span className="hide mr-2 text-sm">
              {formats.every((x) => x.selected) ||
              formats.every((x) => !x.selected)
                ? "All"
                : formats.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <Checkboxes
              onChange={(items) => {
                setFormats(items);
                setSearchFilter((oldValue) => ({
                  ...oldValue,
                  offset: 0,
                  resFormat: items
                    .filter((x) => x.selected)
                    .map((x) => x.value),
                }));
                resetPagination();
              }}
              items={formats}
              limitToPresentViewAll={9}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="org">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Organisation</span>
            <span className="hide mr-2 text-sm">
              {internalOrgs.every((x) => x.selected) ||
              internalOrgs.every((x) => !x.selected)
                ? "All"
                : internalOrgs.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <Checkboxes
              onChange={(items) => {
                setInternalOrgs(items);
                setSearchFilter((oldValue) => ({
                  ...oldValue,
                  offset: 0,
                  orgs: items.filter((x) => x.selected).map((x) => x.value),
                }));
                resetPagination();
              }}
              items={internalOrgs}
              limitToPresentViewAll={7}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="publicationDate">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Publication date</span>
            <span className="hide mr-2 text-sm">
              {publicationDates.every((x) => x.selected) ||
              publicationDates.every((x) => !x.selected)
                ? "All"
                : publicationDates.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-5 flex flex-col gap-3.5">
            <Checkboxes
              onChange={(items) => {
                setPublicationDates(items);
                setSearchFilter((oldValue) => ({
                  ...oldValue,
                  offset: 0,
                  publicationDate: items
                    .filter((x) => x.selected)
                    .map((x) => x.value),
                }));
                resetPagination();
              }}
              items={publicationDates}
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
              onValueChange={(v) => {
                setSearchFilter((oldValue) => ({
                  ...oldValue,
                  offset: 0,
                  showArchived: v === "true",
                }));
                resetPagination();
              }}
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

const Checkboxes = ({
  spaceCount,
  onChange,
  items,
  limitToPresentViewAll,
}: {
  items: {
    value: string;
    amountOfDatasets: number;
    selected: boolean;
    label: string;
  }[];
  limitToPresentViewAll?: number;
  spaceCount?: boolean;
  onChange: (
    v: {
      value: string;
      amountOfDatasets: number;
      selected: boolean;
      label: string;
    }[]
  ) => void;
}) => {
  return (
    <>
      {items.map((x, index) =>
        index <= (limitToPresentViewAll ?? 999999 * 999999) ? (
          <div className="flex items-center gap-2">
            <input
              onChange={() => {
                x.selected = !x.selected;
                onChange([...items]);
              }}
              checked={x.selected}
              className="remove-input-ring rounded text-[#006064]"
              type="checkbox"
            />
            <label
              className={spaceCount ? "flex w-full justify-between" : ""}
              htmlFor=""
            >
              {x.label}{" "}
              {spaceCount ? (
                <span>{`(${x.amountOfDatasets})`}</span>
              ) : (
                `(${x.amountOfDatasets})`
              )}
            </label>
          </div>
        ) : index === 8 ? (
          <span className="mt-[1px] cursor-pointer text-[#006064]">
            View all
          </span>
        ) : (
          <></>
        )
      )}
    </>
  );
};
