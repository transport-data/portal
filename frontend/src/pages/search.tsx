import DatasetsFilter, { Facet } from "@components/_shared/DatasetsFilter";
import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../components/_shared/Layout";

import QuickFilterDropdown from "@components/ui/quick-filter-dropdown";

import DatasetSearchItem from "@components/search/DatasetSearchItem";
import SearchBar from "@components/search/SearchBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@components/ui/pagination";
import { Transition } from "@headlessui/react";
import { cn } from "@lib/utils";
import { SearchDatasetType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateQuickFilterDropdown from "@components/ui/date-quick-filter-dropdown";
import React from "react";
import { DatasetsCardsLoading } from "@components/_shared/DashboardDatasetCard";

export function getServerSideProps({ query }: any) {
  return {
    props: query,
  };
}

export type SearchPageOnChange = (
  data: {
    value: string[] | boolean | string | number | undefined;
    key: keyof SearchDatasetType;
  }[]
) => void;

export default function DatasetSearch({
  query,
  topic,
  tdc_category,
  sector,
  mode,
  service,
  region,
  fuel,
  before,
  after,
  country,
}: any) {
  const [modes, setModes] = useState<Facet[]>([]);
  const [services, setServices] = useState<Facet[]>([]);
  const [updateFrequencies, setUpdateFrequencies] = useState<Facet[]>([]);
  const [tags, setTags] = useState<Facet[]>([]);
  const [sectors, setSectors] = useState<Facet[]>([]);
  const [orgs, setOrgs] = useState<Facet[]>([]);
  const [resourcesFormats, setResourcesFormats] = useState<Facet[]>([]);
  const [regions, setRegions] = useState<Facet[]>([]);
  const [countries, setCountries] = useState<Facet[]>([]);
  const [metadataCreatedDates, setMetadataCreatedDates] = useState<Facet[]>([]);
  const [yearsCoverage, setYearsCoverage] = useState<Facet[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const resetFilter = () => {
    setSearchFilter({
      offset: 0,
      limit: 9,
      sort: "score desc, metadata_modified desc",
      //leaving sectors in is causing a 500 on search
      facetsFields: `["tags", "groups", "services", "modes", "frequency","regions", "sectors", "geographies", "organization", "res_format", "metadata_created"]`,
    });
    setCurrentPage(0);
  };

  const [searchFilter, setSearchFilter] = useState<SearchDatasetType>({
    offset: 0,
    limit: 9,
    endYear: before ? Number(after) : undefined,
    startYear: after ? Number(after) : undefined,
    modes: mode ? [mode as string] : undefined,
    services: service ? [service as string] : undefined,
    sectors: sector ? [sector as string] : undefined,
    fuel: fuel as string | undefined,
    groups: topic ? [topic as string] : undefined,
    tdc_category: tdc_category as string | undefined,
    regions: region ? [region as string] : undefined,
    countries: country ? [country as string] : undefined,
    query: query as string,
    sort: "score desc, metadata_modified desc",
    //leaving sectors in is causing a 500 on search
    facetsFields: `["tags", "groups", "services", "modes", "frequency","regions", "sectors", "geographies", "organization", "res_format", "metadata_created"]`,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const {
    isLoading,
    data: { datasets, count: datasetCount, facets } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery(searchFilter);


  api.dataset.search.useQuery({...searchFilter, offset: (currentPage + 1) * 9});

  useEffect(() => {
    for (const key in facets) {
      switch (key) {
        case "organization": {
          if (!orgs.length) setOrgs(facets[key].items);
          break;
        }
        case "tags": {
          if (!tags.length) setTags(facets[key].items);
          break;
        }
        case "geographies": {
          if (!countries.length) setCountries(facets[key].items);
          break;
        }
        case "regions": {
          if (!regions.length) setRegions(facets[key].items);
          break;
        }
        case "res_format": {
          if (!resourcesFormats.length) setResourcesFormats(facets[key].items);
          break;
        }
        case "modes": {
          if (!modes.length) setModes(facets[key].items);
          break;
        }
        case "services": {
          if (!services.length) setServices(facets[key].items);
          break;
        }
        case "frequency": {
          if (!updateFrequencies.length)
            setUpdateFrequencies(facets[key].items);
          break;
        }
        case "sectors": {
          if (!sectors.length) setSectors(facets[key].items);
          break;
        }
        case "metadata_created": {
          const countByYear = new Map<string, number>();
          const LAST_MONTH_KEY = "Last month";
          const setYearsCoverage = (map: Map<string, number>) => {
            const data = Array.from(map.keys()).map((k) => {
              return {
                name: k,
                display_name: k,
                count: map.get(k) || 0,
              };
            });
            const [lastMonthFacet] = data.splice(
              data.findIndex((x) =>
                x.display_name.toLowerCase().includes("last")
              ),
              1
            );

            data.sort(
              (a, b) => Number(a.display_name) - Number(b.display_name)
            );
            data.splice(1, 0, lastMonthFacet!);
            setMetadataCreatedDates(data);
          };

          facets[key].items.forEach((x: any) => {
            const dateConverted = new Date(x.name);
            const today = new Date();
            let _key;
            // this is checking if the dataset was created at December of last year and today is January making the dataset be in last month filter
            if (
              today.getFullYear() - dateConverted.getFullYear() === 1 &&
              today.getMonth() === 0 &&
              dateConverted.getMonth() === 11
            ) {
              _key = LAST_MONTH_KEY;
            } else {
              _key =
                dateConverted.getFullYear() === today.getFullYear() &&
                dateConverted.getMonth() === today.getMonth() - 1
                  ? LAST_MONTH_KEY
                  : x.name.slice(0, 4);
            }

            let count = countByYear.get(_key);
            if (!count) {
              countByYear.set(_key, x.count);
            } else {
              countByYear.set(_key, count + x.count);
            }
          });
          countByYear.set(
            new Date().getFullYear().toString(),
            (countByYear.get(new Date().getFullYear().toString()) ?? 0) +
              (countByYear.get(LAST_MONTH_KEY) ?? 0)
          );

          if (!countByYear.get(LAST_MONTH_KEY)) {
            countByYear.set(LAST_MONTH_KEY, 0);
          }

          setYearsCoverage(countByYear);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [facets]);

  const onChange: SearchPageOnChange = (data) => {
    setSearchFilter((oldValue) => {
      const updatedValue: any = { ...oldValue, offset: 0 };
      data.forEach((x) => (updatedValue[x.key] = x.value));
      return updatedValue;
    });
    setCurrentPage(0);
  };

  const pages = new Array(Math.ceil((datasetCount || 0) / 9)).fill(0);

  return (
    <>
      <Head>
        <title>Datasets</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect effectSize="100px">
        <div className="container overflow-x-hidden">
          <div className="pt-5">
            <SearchBar
              onChange={onChange}
              hideDatasetSuggestion
              query={searchFilter.query || ""}
              facetName={
                (searchFilter.sectors
                  ? "sector"
                  : searchFilter.modes
                  ? "mode"
                  : searchFilter.regions?.at(0)
                  ? "region"
                  : searchFilter.startYear
                  ? "after"
                  : searchFilter.fuel
                  ? "fuel"
                  : searchFilter.endYear
                  ? "before"
                  : searchFilter.services
                  ? "service"
                  : undefined) as keyof SearchDatasetType
              }
              facetValue={
                searchFilter.sectors
                  ? searchFilter.sectors.at(0)
                  : searchFilter.modes
                  ? searchFilter.modes.at(0)
                  : searchFilter.regions?.at(0)
                  ? searchFilter.regions.at(0)
                  : searchFilter.startYear
                  ? searchFilter.startYear.toString()
                  : searchFilter.fuel
                  ? searchFilter.fuel
                  : searchFilter.endYear
                  ? searchFilter.endYear.toString()
                  : searchFilter.services
                  ? searchFilter.services.at(0)
                  : undefined
              }
            />
          </div>
          <div className="mt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-[64px]">
              <div className="mb-8 flex w-full flex-col justify-between">
                <div>
                  <div className="flex flex-col flex-wrap items-center justify-between gap-2 md:flex-row">
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                      <div className="text-nowrap break-keep text-base font-medium	text-gray-900">
                        Quick filters:
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:flex-row xl:flex-nowrap">
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          isCheckbox
                          defaultValue={searchFilter.sectors}
                          text="Sector"
                          filterFieldName="sectors"
                          items={sectors}
                        />
                        <DateQuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          defaultStartValue={searchFilter.startYear}
                          defaultEndValue={searchFilter.endYear}
                          text="Years covered"
                          filterStartFieldName="startYear"
                          filterEndFieldName="endYear"
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          text="Mode"
                          isCheckbox
                          filterFieldName="modes"
                          defaultValue={searchFilter.modes}
                          items={modes}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          text="Service"
                          isCheckbox
                          filterFieldName="services"
                          defaultValue={searchFilter.services}
                          items={services}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          defaultValue={
                            searchFilter.regions ? searchFilter.regions[0] : "*"
                          }
                          text="Region"
                          filterFieldName="regions"
                          isCheckbox
                          items={regions}
                        />

                        <label
                          className={
                            "hidden cursor-pointer items-center lg:inline-flex " +
                            (showAdvancedFilter ? "" : "xl:min-w-fit")
                          }
                        >
                          <input
                            id="show-advanced-filter-large-w"
                            type="checkbox"
                            checked={showAdvancedFilter}
                            onChange={() =>
                              setShowAdvancedFilter(!showAdvancedFilter)
                            }
                            className="peer sr-only"
                          />
                          <div
                            className={cn(
                              showAdvancedFilter
                                ? "after:start-[2px] xl:after:-start-2"
                                : "after:start-[2px]",
                              "peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                            )}
                          ></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Advanced filter
                          </span>
                        </label>

                        <div className="w-full lg:hidden">
                          <QuickFilterDropdown
                            searchFilter={searchFilter}
                            onChange={onChange}
                            hideAllOption
                            defaultValue={searchFilter.sort}
                            text="Sort by"
                            filterFieldName="sort"
                            items={[
                              {
                                display_name: "Relevance",
                                name: "score desc, metadata_modified desc",
                                count: 0,
                              },
                              {
                                display_name: "Name Ascending",
                                name: "name asc",
                                count: 0,
                              },
                              {
                                display_name: "Name Descending",
                                name: "name desc",
                                count: 0,
                              },
                              {
                                display_name: "Last Modified",
                                name: "metadata_modified desc",
                                count: 0,
                              },
                            ]}
                          />
                        </div>
                        <label
                          className={
                            "inline-flex cursor-pointer items-center lg:hidden " +
                            (showAdvancedFilter ? "" : "xl:min-w-fit")
                          }
                        >
                          <input
                            id="show-advanced-filter"
                            type="checkbox"
                            checked={showAdvancedFilter}
                            onChange={() =>
                              setShowAdvancedFilter(!showAdvancedFilter)
                            }
                            className="peer sr-only"
                          />
                          <div
                            className={cn(
                              "after:start-[2px]",
                              "peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                            )}
                          ></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Advanced filter
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <QuickFilterDropdown
                        searchFilter={searchFilter}
                        onChange={onChange}
                        hideAllOption
                        defaultValue={searchFilter.sort}
                        text="Sort by"
                        filterFieldName="sort"
                        items={[
                          {
                            display_name: "Relevance",
                            count: 0,
                            name: "score desc, metadata_modified desc",
                          },
                          {
                            count: 0,
                            display_name: "Name Ascending",
                            name: "name asc",
                          },
                          {
                            count: 0,
                            display_name: "Name Descending",
                            name: "name desc",
                          },
                          {
                            count: 0,
                            display_name: "Last Modified",
                            name: "metadata_modified desc",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <section className="mt-8">
                    <div className="flex flex-col gap-8">
                      {isLoading ? (
                        <DatasetsCardsLoading />
                      ) : !datasets.length ? (
                        <p className="text-sm">No datasets found</p>
                      ) : (
                        datasets.map((item, i) => (
                          <DatasetSearchItem
                            frequencies={updateFrequencies}
                            key={`dataset-result-${i}`}
                            {...item}
                          />
                        ))
                      )}
                    </div>
                  </section>
                </div>
                {pages.length ? (
                  <Pagination className="mx-0 mt-8 justify-start">
                    <PaginationContent>
                      <PaginationItem>
                        <button
                          disabled={currentPage === 0}
                          aria-label="Go to previous page"
                          className={cn(
                            "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                            "rounded-s-lg px-2",
                            currentPage === 0 ? "cursor-not-allowed" : ""
                          )}
                          onClick={() => {
                            setSearchFilter((oldV) => ({
                              ...oldV,
                              offset: (currentPage - 1) * 9,
                            }));
                            setCurrentPage((oldV) => oldV - 1);
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      </PaginationItem>
                      {pages.map((x, i) =>
                        i > currentPage + 2 || i < currentPage - 2 ? (
                          <></>
                        ) : (
                          <PaginationItem>
                            <button
                              disabled={currentPage === i}
                              onClick={() => {
                                setSearchFilter((oldV) => ({
                                  ...oldV,
                                  offset: i * 9,
                                }));
                                setCurrentPage(i);
                              }}
                              className={cn(
                                `flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 `,
                                currentPage === i
                                  ? "cursor-auto bg-gray-100"
                                  : ""
                              )}
                            >
                              {i + 1}
                            </button>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <button
                          disabled={currentPage === pages.length - 1}
                          aria-label="Go to next page"
                          onClick={() => {
                            setSearchFilter((oldV) => ({
                              ...oldV,
                              offset: (currentPage + 1) * 9,
                            }));
                            setCurrentPage((oldV) => oldV + 1);
                          }}
                          className={cn(
                            "flex h-8 cursor-pointer items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                            "rounded-e-lg px-2",
                            currentPage === pages.length - 1
                              ? "cursor-not-allowed"
                              : ""
                          )}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                ) : (
                  <></>
                )}
              </div>
              <Transition show={showAdvancedFilter}>
                <div
                  className={cn(
                    "relative transition ease-in-out",
                    // Shared closed styles
                    "data-[closed]:opacity-0",
                    // Entering styles
                    "data-[enter]:data-[closed]:translate-x-full data-[enter]:duration-100",
                    // Leaving styles
                    "data-[leave]:data-[closed]:translate-x-full data-[leave]:duration-300",

                    "order-first w-full border-l pl-5 pt-[12px] duration-1000 ease-in lg:order-last lg:max-w-[340px]"
                  )}
                >
                  <DatasetsFilter
                    resetFilter={resetFilter}
                    datasetCount={datasetCount || 0}
                    onChange={onChange}
                    searchFilter={searchFilter}
                    defaultStartValue={searchFilter.startYear}
                    defaultEndValue={searchFilter.endYear}
                    tags={tags}
                    orgs={orgs}
                    resourcesFormats={resourcesFormats}
                    regions={regions}
                    countries={countries}
                    metadataCreatedDates={metadataCreatedDates}
                  />
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const Checkboxes = ({
  onChange,
  items,
  selectedItems = [],
  limitToPresentViewAll,
}: {
  items: Facet[];
  selectedItems?: string[];
  limitToPresentViewAll?: number;
  onChange: (v: string[]) => void;
}) => {
  const [showAll, setShowAll] = useState<boolean>(!limitToPresentViewAll);
  return (
    <>
      {items.map((x, index) =>
        index <=
        (limitToPresentViewAll && !showAll
          ? limitToPresentViewAll
          : 999999 * 999999) ? (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
              id={x.name}
              onChange={() => {
                const selectedItemsCopy = [...selectedItems];
                const i = selectedItemsCopy.findIndex((c) => c === x.name);
                if (i > -1) selectedItemsCopy.splice(i, 1);
                else selectedItemsCopy.push(x.name);
                onChange([...selectedItemsCopy]);
              }}
              checked={selectedItems.includes(x.name)}
              className="remove-input-ring rounded text-[#006064]"
              type="checkbox"
            />
            <label htmlFor={x.name}>{x.display_name}</label>
          </div>
        ) : index === 8 ? (
          <span
            id={"show-all-checkboxes"}
            onClick={() => setShowAll(true)}
            className="mt-[1px] cursor-pointer text-[#006064]"
          >
            View all
          </span>
        ) : (
          <></>
        )
      )}
    </>
  );
};
