import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import SimpleSearchInput from "@components/ui/simple-search-input";
import classNames from "@utils/classnames";
import { Dispatch, SetStateAction, useState } from "react";

export type Facet = { name: string; display_name: string; count: number };

export default ({
  tags,
  orgs,
  resourcesFormats,
  groups,
  regions,
  metadataCreated,
  yearsCoverage,
}: {
  tags: Facet[];
  orgs: Facet[];
  resourcesFormats: Facet[];
  groups: Facet[];
  regions: Facet[];
  metadataCreated: Facet[];
  yearsCoverage: Facet[];
}) => {
  const mapFacetsToFilterItems = (facets: Facet[]) => {
    return facets.map((x) => ({
      value: x.name,
      amountOfDatasets: x.count,
      selected: false,
      label: x.display_name,
    }));
  };

  const tabs = [
    { name: "All", current: false },
    { name: "Regions", current: true },
    { name: "Countries", current: false },
    { name: "Cities", current: false },
  ];
  const [keywordItems, setKeywordItems] = useState(
    mapFacetsToFilterItems(tags)
  );

  const [publicationDates, setPublicationDates] = useState([
    { value: "All (1,156)", label: "All (1,156)", selected: false },
    { value: "Last Month (97)", label: "Last Month (97)", selected: false },
    { value: "2023 (97)", label: "2023 (97)", selected: false },
    { value: "2022 (234)", label: "2022 (234)", selected: false },
    { value: "2021 (45)", label: "2021 (45)", selected: false },
    { value: "2020 (176)", label: "2020 (176)", selected: false },
    { value: "2019 (34)", label: "2019 (34)", selected: false },
    { value: "2018 (49)", label: "2018 (49)", selected: false },
  ]);

  const [internalOrgs, setInternalOrgs] = useState<
    {
      value: string;
      label: string;
      selected: boolean;
    }[]
  >(mapFacetsToFilterItems(orgs));

  const [formats, setFormats] = useState(
    mapFacetsToFilterItems(resourcesFormats)
  );

  const [years, setYears] = useState(mapFacetsToFilterItems(yearsCoverage));

  const [internalRegions, setInternalRegions] = useState(
    mapFacetsToFilterItems(regions)
  );

  return (
    <>
      <div className="mb-[12px] flex items-center justify-between gap-6 text-sm">
        <div>
          <h3 className="text-base font-medium text-[#111928]">Filters</h3>
          <p className="text-sm text-[#6B7280]">Showing all 156 results</p>
        </div>
        <span className="cursor-pointer text-sm font-medium text-cyan-900">
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
              setItems={setKeywordItems}
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
                setItems={setInternalRegions}
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
              <Checkboxes items={years} setItems={setYears} />
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
              setItems={setFormats}
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
              setItems={setInternalOrgs}
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
              setItems={setPublicationDates}
              items={publicationDates}
              limitToPresentViewAll={7}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="archived">
          <AccordionTrigger className="group justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.full]:w-full [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="full flex">Archived</span>
            <span className="hide mx-2 flex w-full justify-end text-sm">
              Without archived
            </span>
          </AccordionTrigger>
          <AccordionContent className="mt-[12px]">
            <p className="mb-6">
              Select whether to include the archive in the search if you are
              looking for older data.
            </p>
            <RadioGroup defaultValue="withoutArchived" className="flex gap-3.5">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="withoutArchived"
                  id="withoutArchived"
                  className="border-none bg-[#006064] text-white"
                />
                <Label htmlFor="withoutArchived">Without archived</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="all"
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
  setItems,
  spaceCount,
  items,
  limitToPresentViewAll,
}: {
  setItems: Dispatch<
    SetStateAction<
      {
        value: string;
        amountOfDatasets: number;
        selected: boolean;
        label: string;
      }[]
    >
  >;
  items: {
    value: string;
    amountOfDatasets: number;
    selected: boolean;
    label: string;
  }[];
  limitToPresentViewAll?: number;
  spaceCount?: boolean;
}) => {
  return (
    <>
      {items.map((x, index) =>
        index <= (limitToPresentViewAll ?? 999999 * 999999) ? (
          <div className="flex items-center gap-2">
            <input
              onChange={() => {
                x.selected = !x.selected;
                setItems([...items]);
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
