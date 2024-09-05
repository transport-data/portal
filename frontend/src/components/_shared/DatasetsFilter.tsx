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
import { useState } from "react";

export default () => {
  const tabs = [
    { name: "All", current: false },
    { name: "Regions", current: true },
    { name: "Countries", current: false },
    { name: "Cities", current: false },
  ];
  const [keywordItems, setKeywordItems] = useState([
    { value: "Transport data (56)", selected: false },
    { value: "Urban Mobility (97)", selected: false },
    { value: "Public Transit (234)", selected: false },
    { value: "Traffic (45)", selected: false },
    { value: "Emissions (176)", selected: false },
    { value: "Infrastructure (49)", selected: false },
    { value: "Forecast (16)", selected: false },
    { value: "Accessibility (87)", selected: false },
    { value: "Mobility Analytics (23)", selected: false },
    { value: "Transportation Demand (35)", selected: false },
    { value: "Transportation Demand (35)", selected: false },
  ]);

  const [publicationDates, setPublicationDates] = useState([
    { value: "All (1,156)", selected: false },
    { value: "Last Month (97)", selected: false },
    { value: "2023 (97)", selected: false },
    { value: "2022 (234)", selected: false },
    { value: "2021 (45)", selected: false },
    { value: "2020 (176)", selected: false },
    { value: "2019 (34)", selected: false },
    { value: "2018 (49)", selected: false },
  ]);

  const [orgs, setOrgs] = useState([
    { value: "World Bank Group (1,156)", selected: false },
    { value: "Eurostat (97)", selected: false },
    { value: "UN (97)", selected: false },
    { value: "OECD (234)", selected: false },
    { value: "Federal Transit Administration (45)", selected: false },
    {
      value: "International Association of Public Transport (176)",
      selected: false,
    },
    { value: "European Environment Agency (34)", selected: false },
    { value: "Environmental Protection Agency (49)", selected: false },
    { value: "Environmental Protection Agency (49)", selected: false },
  ]);

  const [formats, setFormats] = useState([
    { value: "CSV (1,156)", selected: false },
    { value: "GarminIMG (97)", selected: false },
    { value: "GeoJSON (97)", selected: false },
    { value: "GeoTIFF (234)", selected: false },
    { value: "KML (45)", selected: false },
    { value: "PDF (176)", selected: false },
    { value: "SHP (34)", selected: false },
    { value: "XLSX (49)", selected: false },
  ]);

  const [years, setYears] = useState([
    { value: 1994, selected: false },
    { value: 1995, selected: false },
    { value: 1996, selected: false },
    { value: 1997, selected: false },
    { value: 1998, selected: false },
    { value: 1999, selected: false },
    { value: 2000, selected: false },
    { value: 2001, selected: false },
    { value: 2002, selected: false },
    { value: 2003, selected: false },
    { value: 2004, selected: false },
    { value: 2005, selected: false },
  ]);

  const [regions, setRegions] = useState([
    { value: "APAC", selected: false, amountOfDatasets: 54 },
    { value: "Asia", selected: false, amountOfDatasets: 49 },
    { value: "Australia and Oceania", selected: false, amountOfDatasets: 14 },
    { value: "MENA", selected: false, amountOfDatasets: 19 },
    { value: "OECD", selected: false, amountOfDatasets: 2 },
    // {
    //   value: "Central and South America",
    //   selected: false,
    //   amountOfDatasets: 54,
    // },
    // { value: "Europe", selected: false, amountOfDatasets: 2 },
    // { value: "North America", selected: false, amountOfDatasets: 54 },
    // { value: "EU", selected: false, amountOfDatasets: 54 },
    // { value: "CEE", selected: false, amountOfDatasets: 54 },
    // { value: "LAC", selected: false, amountOfDatasets: 54 },
  ]);

  return (
    <>
      <div className="flex items-center justify-between gap-6 text-sm">
        <div>
          <h3 className="text-base text-[#111928]">Filters</h3>
          <p className="text-sm text-[#6B7280]">Showing all 156 results</p>
        </div>
        <span className="cursor-pointer text-cyan-900">Clear all</span>
      </div>
      <SimpleSearchInput
        onTextInput={(x) => console.log(x)}
        placeholder="Search"
      />

      <Accordion type="single" collapsible className="w-full text-[#6B7280]">
        <AccordionItem value="keyword">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Keyword</span>
            <span className="mr-2">
              {keywordItems.every((x) => x.selected) ||
              keywordItems.every((x) => !x.selected)
                ? "All"
                : keywordItems.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3.5">
            {keywordItems.map((x, index) =>
              index <= 9 ? (
                <div className="flex items-center gap-2">
                  <input
                    onChange={() => {
                      x.selected = !x.selected;
                      setKeywordItems([...keywordItems]);
                    }}
                    checked={x.selected}
                    className="remove-input-ring rounded text-[#006064]"
                    type="checkbox"
                  />
                  <label htmlFor="">{x.value}</label>
                </div>
              ) : index === 10 ? (
                <span className="mt-[1px] cursor-pointer text-[#006064]">
                  View all
                </span>
              ) : (
                <></>
              )
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="location">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Location</span>
            <span className="hide mr-2">
              {regions.every((x) => x.selected) ||
              regions.every((x) => !x.selected)
                ? "All"
                : regions.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-1">
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
                  regions.forEach((x) => (x.selected = true));
                  setRegions([...regions]);
                }}
              >
                Check all
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  regions.forEach((x) => (x.selected = false));
                  setRegions([...regions]);
                }}
              >
                Uncheck all
              </span>
            </div>
            <div className="customized-scroll flex max-h-[324px] flex-col gap-3 overflow-y-scroll">
              {regions.map((x) => (
                <div className="flex items-center gap-2 pr-4">
                  <input
                    onChange={() => {
                      x.selected = !x.selected;
                      setRegions([...regions]);
                    }}
                    checked={x.selected}
                    className="remove-input-ring rounded text-[#006064]"
                    type="checkbox"
                  />
                  <label htmlFor="" className="flex flex-grow justify-between">
                    <span>{x.value}</span>
                    <span>{x.amountOfDatasets}</span>
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="yearsCovered">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Years covered</span>
            <span className="hide mr-2">
              {years.every((x) => x.selected) || years.every((x) => !x.selected)
                ? "All"
                : years.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-3 flex items-center gap-2">
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
              {years.map((x) => (
                <div className="flex items-center gap-2">
                  <input
                    onChange={() => {
                      x.selected = !x.selected;
                      setYears([...years]);
                    }}
                    checked={x.selected}
                    className="remove-input-ring rounded text-[#006064]"
                    type="checkbox"
                  />
                  <label htmlFor="">{x.value}</label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="format">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Format</span>
            <span className="hide mr-2">
              {formats.every((x) => x.selected) ||
              formats.every((x) => !x.selected)
                ? "All"
                : formats.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3.5">
            {formats.map((x, index) =>
              index <= 9 ? (
                <div className="flex items-center gap-2">
                  <input
                    onChange={() => {
                      x.selected = !x.selected;
                      setFormats([...formats]);
                    }}
                    checked={x.selected}
                    className="remove-input-ring rounded text-[#006064]"
                    type="checkbox"
                  />
                  <label htmlFor="">{x.value}</label>
                </div>
              ) : index === 10 ? (
                <span className="mt-[1px] cursor-pointer text-[#006064]">
                  View all
                </span>
              ) : (
                <></>
              )
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="org">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Organisation</span>
            <span className="hide mr-2">
              {orgs.every((x) => x.selected) || orgs.every((x) => !x.selected)
                ? "All"
                : orgs.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3.5">
            {orgs.map((x, index) =>
              index <= 7 ? (
                <div className="flex items-center gap-2">
                  <input
                    onChange={() => {
                      x.selected = !x.selected;
                      setOrgs([...orgs]);
                    }}
                    checked={x.selected}
                    className="remove-input-ring rounded text-[#006064]"
                    type="checkbox"
                  />
                  <label htmlFor="">{x.value}</label>
                </div>
              ) : index === 8 ? (
                <span className="mt-[1px] cursor-pointer text-[#006064]">
                  View all
                </span>
              ) : (
                <></>
              )
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="publicationDate">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="flex w-full">Publication date</span>
            <span className="hide mr-2">
              {publicationDates.every((x) => x.selected) ||
              publicationDates.every((x) => !x.selected)
                ? "All"
                : publicationDates.filter((x) => x.selected).length}
            </span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3.5">
            {publicationDates.map((x, index) =>
              index <= 7 ? (
                <div className="flex items-center gap-2">
                  <input
                    onChange={() => {
                      x.selected = !x.selected;
                      setPublicationDates([...publicationDates]);
                    }}
                    checked={x.selected}
                    className="remove-input-ring rounded text-[#006064]"
                    type="checkbox"
                  />
                  <label htmlFor="">{x.value}</label>
                </div>
              ) : index === 8 ? (
                <span className="mt-[1px] cursor-pointer text-[#006064]">
                  View all
                </span>
              ) : (
                <></>
              )
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="archived">
          <AccordionTrigger className="group mb-3 justify-start border-b-[1px] border-[#F3F4F6] py-6 text-[#6B7280] hover:no-underline [&[data-state=open]>span.full]:w-full [&[data-state=open]>span.hide]:hidden [&[data-state=open]]:text-[#111928]">
            <span className="full flex">Archived</span>
            <span className="hide mx-2 flex w-full justify-end">
              Without archived
            </span>
          </AccordionTrigger>
          <AccordionContent>
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
