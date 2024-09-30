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
      facetsFields: `["tags", "groups", "services", "modes", "sectors","frequency","regions", "geographies", "organization", "res_format", "metadata_created"]`,
    });
    setCurrentPage(0);
  };

  const [searchFilter, setSearchFilter] = useState<SearchDatasetType>({
    offset: 0,
    limit: 9,
    endYear: after ? Number(after) : undefined,
    mode: mode as string | undefined,
    service: service as string | undefined,
    sector: sector as string | undefined,
    fuel: fuel as string | undefined,
    before: before as string | undefined,
    after: after as string | undefined,
    regions: region ? [region as string] : undefined,
    countries: country ? [country as string] : undefined,
    query: query as string,
    sort: "score desc, metadata_modified desc",
    facetsFields: `["tags", "groups", "services", "modes", "sectors","frequency","regions", "geographies", "organization", "res_format", "metadata_created"]`,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: { datasets, count: datasetCount, facets } = {
      datasets: [],
      facets: {} as any,
    },
  } = api.dataset.search.useQuery(searchFilter);

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
            setMetadataCreatedDates(
              Array.from(map.keys())
                .map((k) => {
                  return {
                    name: k,
                    display_name: k,
                    count: map.get(k) || 0,
                  };
                })
                .sort((a, b) => Number(a.display_name) - Number(b.display_name))
            );
          };

          facets[key].items.forEach((x: any) => {
            const dateConverted = new Date(x.name);
            const today = new Date();
            const _key =
              dateConverted.getFullYear() === today.getFullYear() &&
              dateConverted.getMonth() === today.getMonth() - 1
                ? LAST_MONTH_KEY
                : x.name.slice(0, 4);
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
                (searchFilter.sector
                  ? "sector"
                  : searchFilter.mode
                  ? "mode"
                  : searchFilter.regions?.at(0)
                  ? "region"
                  : searchFilter.after
                  ? "after"
                  : searchFilter.fuel
                  ? "fuel"
                  : searchFilter.before
                  ? "before"
                  : searchFilter.service
                  ? "service"
                  : undefined) as keyof SearchDatasetType
              }
              facetValue={
                searchFilter.sector
                  ? searchFilter.sector
                  : searchFilter.mode
                  ? searchFilter.mode
                  : searchFilter.regions?.at(0)
                  ? searchFilter.regions.at(0)
                  : searchFilter.after
                  ? searchFilter.after
                  : searchFilter.fuel
                  ? searchFilter.fuel
                  : searchFilter.before
                  ? searchFilter.before
                  : searchFilter.service
                  ? searchFilter.service
                  : undefined
              }
            />
          </div>
          <div className="mt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-[64px]">
              <div className="mb-8 flex w-full flex-col justify-between">
                <div>
                  <div className="flex flex-col flex-wrap items-center justify-between gap-2 md:flex-row xl:flex-nowrap">
                    <div className="flex flex-col items-center gap-4 md:flex-row">
                      <span className="text-base font-medium text-gray-900">
                        Quick filters:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 sm:flex-row sm:flex-nowrap">
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          defaultValue={searchFilter.sector}
                          text="Sector"
                          filterFieldName="sector"
                          items={sectors}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          text="Mode"
                          filterFieldName="mode"
                          defaultValue={searchFilter.mode}
                          items={modes}
                        />
                        <QuickFilterDropdown
                          searchFilter={searchFilter}
                          onChange={onChange}
                          text="Service"
                          filterFieldName="service"
                          defaultValue={searchFilter.service}
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
                            "hidden cursor-pointer items-center sm:inline-flex " +
                            (showAdvancedFilter ? "" : "xl:min-w-fit")
                          }
                        >
                          <input
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
                                ? "after:-start-[8px]"
                                : "after:start-[2px]",
                              "peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                            )}
                          ></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Advanced filter
                          </span>
                        </label>

                        <div className="w-full sm:hidden">
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
                            "inline-flex cursor-pointer items-center sm:hidden " +
                            (showAdvancedFilter ? "" : "xl:min-w-fit")
                          }
                        >
                          <input
                            type="checkbox"
                            checked={showAdvancedFilter}
                            onChange={() =>
                              setShowAdvancedFilter(!showAdvancedFilter)
                            }
                            className="peer sr-only"
                          />
                          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Advanced filter
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="hidden sm:block">
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
                      {!datasets.length && (
                        <p className="text-sm">No datasets found</p>
                      )}
                      {datasets.map((item, i) => (
                        <DatasetSearchItem
                          frequencies={updateFrequencies}
                          key={`dataset-result-${i}`}
                          {...item}
                        />
                      ))}
                    </div>
                  </section>
                </div>
                {pages.length ? (
                  <Pagination className="mx-0 mt-8 justify-start">
                    <PaginationContent>
                      <PaginationItem>
                        <button
                          disabled={currentPage === 0}
                          aria-label="Go to next page"
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
  return (
    <>
      {items.map((x, index) =>
        index <= (limitToPresentViewAll ?? 999999 * 999999) ? (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <input
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
            <label htmlFor="">{x.display_name}</label>
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
